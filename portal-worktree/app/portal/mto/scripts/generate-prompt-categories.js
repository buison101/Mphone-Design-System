const fs = require('fs');
const path = require('path');

const promptsDir = path.join(__dirname, '..', '.github', 'prompts');
const knownCategorySlugs = ['api', 'apps', 'auth', 'core', 'dashboard', 'landing', 'layouts', 'theming', 'ui-elements'];

function capitalizeWords(str) {
  const acronyms = {
    dnd: 'DnD',
    datatable: 'DataTable',
    ui: 'UI',
    api: 'API'
  };

  return str
    .split('-')
    .map((word) => {
      const lower = word.toLowerCase();
      return acronyms[lower] || word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function extractVideoId(content) {
  const match = content.match(/<!-- VIDEO_ID: ([^\s]+) -->/);
  return match ? match[1] : null;
}

function extractDescription(content) {
  const match = content.match(/<!-- DESCRIPTION: ([\s\S]*?) -->/);
  return match ? match[1].trim() : null;
}

function getCategorySlug(fileName) {
  const baseName = fileName.replace('.prompt.md', '').replace(/_/g, '-');
  const matchedSlug = knownCategorySlugs.find((slug) => baseName.startsWith(`${slug}-`));

  if (matchedSlug) {
    return matchedSlug;
  }

  return baseName.split('-')[0];
}

function generatePromptCategories() {
  const itemsByCategory = new Map();
  const files = fs.readdirSync(promptsDir).filter((file) => file.endsWith('.prompt.md'));

  for (const file of files) {
    const filePath = path.join(promptsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const videoId = extractVideoId(content);
    const description = extractDescription(content);

    const baseName = file.replace('.prompt.md', '').replace(/_/g, '-');
    const categorySlug = getCategorySlug(file);
    const itemBaseName = baseName.slice(categorySlug.length + 1);
    const isFree = itemBaseName.endsWith('-free');
    const id = itemBaseName;
    const titleBase = isFree ? itemBaseName.slice(0, -5) : itemBaseName;
    const title = capitalizeWords(titleBase);
    const type = isFree ? 'free' : 'pro';
    const existingItems = itemsByCategory.get(categorySlug) || [];

    existingItems.push({ id, title, type, fileName: file, videoId, description });
    itemsByCategory.set(categorySlug, existingItems);
  }

  return Array.from(itemsByCategory.entries()).map(([categorySlug, items]) => ({
    name: capitalizeWords(categorySlug),
    slug: categorySlug,
    items
  }));
}

const promptCategories = generatePromptCategories();

const output = `export interface PromptItem {
  id: string;
  title: string;
  type?: 'free' | 'pro';
  fileName: string;
  videoId: string | null;
  description: string | null;
}

export interface PromptCategory {
  name: string;
  slug?: string;
  items: PromptItem[];
}

export const promptCategories: PromptCategory[] = ${JSON.stringify(promptCategories, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'prompt-categories.js');
fs.writeFileSync(outputPath, output);

console.log('Generated prompt-categories.js');
