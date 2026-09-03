const promptCategories = ['ui-elements', 'theming', 'layouts', 'landing', 'dashboard', 'core', 'auth', 'apps', 'api'];

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

// Utility to extract metadata from HTML comments and strip them from content
const extractMetadata = (rawContent) => {
  let content = rawContent;
  let description;
  let videoId;

  // Extract all metadata comments
  const metadataRegex = /<!--\s*(DESCRIPTION|VIDEO_ID):\s*(.+?)\s*-->/g;
  let match;
  while ((match = metadataRegex.exec(content)) !== null) {
    const key = match[1];
    const value = match[2].trim();

    if (key === 'DESCRIPTION') {
      const sentences = value.split(/(?<=[.!?])\s+/).filter(Boolean);
      description = value;
      if (sentences.length > 5) {
        description = sentences.slice(0, 5).join(' ');
      }
    } else if (key === 'VIDEO_ID') {
      videoId = value;
    }
  }

  // Strip all metadata comments from content
  content = content.replace(/<!--\s*(DESCRIPTION|VIDEO_ID):.+?-->\s*\n?/g, '').trimStart();

  return { description, videoId, content };
};

// Utility to get file type (pro or free) from filename
const getFileType = (fileName) => {
  const baseName = fileName.replace(/\.prompt.md$/, '');
  if (baseName.endsWith('-free')) return 'free';
  return 'pro';
};

const getCategoryFromFileName = (fileName) => {
  const baseName = fileName.replace(/\.md$/, '');
  const matchedCategory = promptCategories.find((category) => baseName.startsWith(`${category}-`));

  if (!matchedCategory) {
    return { folderName: 'prompts', promptName: baseName };
  }

  return {
    folderName: matchedCategory,
    promptName: baseName.slice(matchedCategory.length + 1)
  };
};

// Load all markdown files from the root .github/prompts directory
const rawPrompts = import.meta.glob('../../.github/prompts/*.md', { query: '?raw', eager: true });

// Load AGENTS.md specifically
const agentsFile = import.meta.glob('../../../AGENTS.md', { query: '?raw', eager: true });

const processPrompts = () => {
  const foldersMap = {};

  Object.entries(rawPrompts).forEach(([path, module]) => {
    const segments = path.split('/');
    const fileName = segments.pop() || '';
    const { folderName, promptName } = getCategoryFromFileName(fileName);

    const { description, videoId, content } = extractMetadata(module.default);

    const file = {
      name: getDisplayName(promptName),
      fileName: fileName,
      type: getFileType(fileName),
      content,
      description,
      videoId
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
