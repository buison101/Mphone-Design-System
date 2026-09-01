import { useMemo } from 'react';

// data
import { promptCategories } from 'data/prompt-categories';

export function normalizeCategorySlug(cat) {
  return cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
}

export function filterItemsByType(items, filter) {
  if (filter === 'free' || filter === 'pro') {
    return items.filter((item) => item.type === filter);
  }
  return items;
}

function buildPromptPath(filterPrefix, category, promptId) {
  return `/prompts-overview${filterPrefix}/category/${encodeURIComponent(normalizeCategorySlug(category))}/${encodeURIComponent(promptId)}`;
}

// ==============================|| PROMPT DETAILS - NAVIGATION PATHS ||============================== //

export default function usePromptNavigationPaths({ filter, matchedCategory, selectedItem }) {
  return useMemo(() => {
    const filterPrefix = filter && ['free', 'pro'].includes(filter) ? `/${filter}` : '';
    const currentCategoryIndex = promptCategories.findIndex(
      (category) => normalizeCategorySlug(category).toLowerCase() === normalizeCategorySlug(matchedCategory).toLowerCase()
    );

    const filteredCurrentItems = filterItemsByType(matchedCategory.items, filter);
    const currentIndex = filteredCurrentItems.findIndex((item) => item.id === selectedItem.id);

    let previousPrompt = null;
    let previousCategory = null;
    let nextPrompt = null;
    let nextCategory = null;

    if (currentIndex > 0) {
      previousPrompt = filteredCurrentItems[currentIndex - 1];
    } else if (currentCategoryIndex > 0) {
      for (let i = currentCategoryIndex - 1; i >= 0; i--) {
        const filteredPrevItems = filterItemsByType(promptCategories[i].items, filter);
        if (filteredPrevItems.length > 0) {
          previousCategory = promptCategories[i];
          previousPrompt = filteredPrevItems[filteredPrevItems.length - 1];
          break;
        }
      }
    }

    if (currentIndex < filteredCurrentItems.length - 1) {
      nextPrompt = filteredCurrentItems[currentIndex + 1];
    } else if (currentCategoryIndex < promptCategories.length - 1) {
      for (let i = currentCategoryIndex + 1; i < promptCategories.length; i++) {
        const filteredNextItems = filterItemsByType(promptCategories[i].items, filter);
        if (filteredNextItems.length > 0) {
          nextCategory = promptCategories[i];
          nextPrompt = filteredNextItems[0];
          break;
        }
      }
    }

    const previousPath = previousPrompt ? buildPromptPath(filterPrefix, previousCategory || matchedCategory, previousPrompt.id) : undefined;

    const nextPath = nextPrompt ? buildPromptPath(filterPrefix, nextCategory || matchedCategory, nextPrompt.id) : undefined;

    return { previousPath, nextPath };
  }, [filter, matchedCategory, selectedItem]);
}
