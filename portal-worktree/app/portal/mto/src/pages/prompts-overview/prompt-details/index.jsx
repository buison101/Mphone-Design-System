import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import PageNavigator from './PageNavigator';
import PromptDetailsState from './PromptDetailsState';
import RelatedPrompts from './RelatedPrompts';
import { normalizeCategorySlug } from './usePromptNavigationPaths';

import Breadcrumb from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import PromptExplorer from 'components/pages/PromptExplorer';
import { promptsFileReader } from 'utils/prompts-file-reader';

// data
import { promptCategories } from 'data/prompt-categories';

// assets
import RightOutlined from '@ant-design/icons/RightOutlined';

// ==============================|| PROMPTS ITEM - DETAILS ||============================== //

export default function PromptDetails() {
  const { filter, category, item } = useParams();

  const filterPrefix = filter && ['free', 'pro'].includes(filter) ? `/${filter}` : '';

  const matchedCategory = useMemo(() => {
    if (!category) return null;
    const categorySlug = decodeURIComponent(category).toLowerCase();
    return (
      promptCategories.find((c) => normalizeCategorySlug(c).toLowerCase() === categorySlug) ||
      promptCategories.find((c) => c.name.toLowerCase() === categorySlug)
    );
  }, [category]);

  const selectedItem = useMemo(() => {
    if (!matchedCategory || !item) return null;
    return matchedCategory.items.find((i) => i.id === decodeURIComponent(item)) ?? null;
  }, [matchedCategory, item]);

  const selectedPromptFile = useMemo(() => {
    if (!selectedItem?.fileName || !matchedCategory) return null;

    const categoryFolder = normalizeCategorySlug(matchedCategory).toLowerCase();
    const promptFolder = promptsFileReader.find((folder) => folder.name.toLowerCase() === categoryFolder);

    return promptFolder?.files.find((file) => file.fileName === selectedItem.fileName) ?? null;
  }, [matchedCategory, selectedItem]);

  const promptContent = useMemo(() => {
    return selectedPromptFile?.content ?? '';
  }, [selectedPromptFile]);

  const promptDescription = selectedPromptFile?.description ?? selectedItem?.description ?? null;
  const promptVideoId = selectedPromptFile?.videoId ?? selectedItem?.videoId ?? null;

  // Trigger PromptExplorer to display current prompt
  useEffect(() => {
    if (selectedItem && matchedCategory) {
      const folderName = normalizeCategorySlug(matchedCategory).toLowerCase();

      const event = new CustomEvent('prompt-explorer-select', {
        detail: {
          folderName,
          fileName: selectedItem.fileName,
          isFree: selectedItem.type !== 'pro'
        }
      });
      window.dispatchEvent(event);
    }
  }, [selectedItem, matchedCategory]);

  if (!category || !matchedCategory || !selectedItem) {
    return <PromptDetailsState category={category} item={item} matchedCategory={matchedCategory} selectedItem={selectedItem} />;
  }

  return (
    <Stack sx={{ gap: 4 }}>
      {/* Responsive Media Breadcrumb Section */}
      <Breadcrumb
        isFormatted={false}
        custom
        links={[
          { title: 'Home', to: '/prompts-overview' },
          { title: 'Prompts', to: `/prompts-overview${filterPrefix}` },
          { title: `${matchedCategory.name}: ${selectedItem.title}` }
        ]}
        title={false}
        separator={RightOutlined}
        card
        sx={{ mb: 0, display: { xs: 'flex', md: 'none' } }}
      />
      {/* Simple Hero Section */}
      <MainCard>
        {selectedItem.type && (
          <Chip
            size="small"
            label={selectedItem.type.toUpperCase()}
            color={selectedItem.type === 'pro' ? 'primary' : 'success'}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          />
        )}
        <Stack sx={{ gap: 1.5 }}>
          <Typography variant="h4">{selectedItem.title}</Typography>
          {promptDescription && (
            <Typography variant="h5" sx={{ color: 'grey.600', fontWeight: 400, width: { xs: 1, sm: '75%' } }}>
              {promptDescription}
            </Typography>
          )}
        </Stack>
      </MainCard>
      {/* Video Guides */}
      {promptVideoId && (
        <MainCard content={false}>
          <Box
            sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', bgcolor: 'common.black', borderRadius: 1, overflow: 'hidden' }}
          >
            <iframe
              title="Mantis Prompt Explorer Video"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${promptVideoId}?autoplay=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </Box>
        </MainCard>
      )}
      {/* Code Sample */}
      {promptContent && (
        <PromptExplorer
          folderName={normalizeCategorySlug(matchedCategory).toLowerCase()}
          fileName={selectedItem.fileName}
          watchVideo={false}
          showDrawer={false}
        />
      )}
      <RelatedPrompts filter={filter} matchedCategory={matchedCategory} selectedItem={selectedItem} />
      {/* Navigation Buttons */}
      <PageNavigator filter={filter} matchedCategory={matchedCategory} selectedItem={selectedItem} />
    </Stack>
  );
}
