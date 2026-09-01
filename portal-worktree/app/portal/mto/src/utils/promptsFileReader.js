// Utility to get display name from filename
const getDisplayName = (fileName) => {
  return fileName
    .replace(/\.md$/, '')
    .replace(/_pro$/, '')
    .replace(/_free$/, '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Utility to extract description from HTML comment and strip it from content
const extractDescription = (rawContent) => {
  const match = rawContent.match(/^<!--\s*DESCRIPTION:\s*(.+?)\s*-->/);
  if (!match) return { content: rawContent };

  const rawDesc = match[1].trim();
  // Clamp description: min 2 lines, max 5 lines worth of text
  // Split into sentences for cleaner line breaks
  const sentences = rawDesc.split(/(?<=[.!?])\s+/).filter(Boolean);
  let description = rawDesc;
  if (sentences.length > 5) {
    description = sentences.slice(0, 5).join(' ');
  }

  // Strip the description comment from content
  const content = rawContent.replace(/^<!--\s*DESCRIPTION:.+?-->\s*\n?/, '').trimStart();

  return { description, content };
};

// Utility to get file type (pro or free) from filename
const getFileType = (fileName) => {
  const baseName = fileName.replace(/\.prompt.md$/, '');
  if (baseName.endsWith('-free')) return 'free';
  return 'pro';
};

// Load all markdown files from the root prompts directory
const rawPrompts = import.meta.glob('../../../prompts/**/*.prompt.md', { query: '?raw', eager: true });

// Load AGENTS.md specifically
const agentsFile = import.meta.glob('../../../AGENTS.md', { query: '?raw', eager: true });

const processPrompts = () => {
  const foldersMap = {};

  Object.entries(rawPrompts).forEach(([path, module]) => {
    const segments = path.split('/');
    const fileName = segments.pop() || '';
    const folderName = segments.pop() || '';

    if (fileName === '_template.md' || fileName === 'README.md' || folderName === 'prompts') return;

    const { description, content } = extractDescription(module.default);

    const file = {
      name: getDisplayName(fileName),
      fileName: fileName,
      type: getFileType(fileName),
      content,
      description
    };

    if (!foldersMap[folderName]) {
      foldersMap[folderName] = [];
    }
    foldersMap[folderName].push(file);
  });

  return Object.entries(foldersMap)
    .map(([name, files]) => ({
      name,
      files: files.sort((a, b) => {
        // Free files come first within each folder
        if (a.type === 'free' && b.type !== 'free') return -1;
        if (a.type !== 'free' && b.type === 'free') return 1;
        return a.name.localeCompare(b.name);
      })
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const processedPrompts = processPrompts();

const agentsPath = Object.keys(agentsFile)[0];
const agentsContent = agentsPath ? agentsFile[agentsPath].default : '';

export const promptsFileReader = processedPrompts;

export const agentsData = agentsPath
  ? {
      name: 'AGENTS.md',
      fileName: 'AGENTS.md',
      type: 'pro',
      content: agentsContent
    }
  : undefined;

export const explorerData = {
  prompts: processedPrompts,
  agents: agentsData
};
