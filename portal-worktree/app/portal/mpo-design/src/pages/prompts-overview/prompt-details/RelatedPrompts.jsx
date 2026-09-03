import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { filterItemsByType, normalizeCategorySlug } from './usePromptNavigationPaths';
import MainCard from 'components/MainCard';

// ==============================|| PROMPT DETAILS - RELATED PROMPTS ||============================== //

export default function RelatedPrompts({ filter, matchedCategory, selectedItem }) {
  const navigate = useNavigate();

  const filterItems = useCallback((items) => filterItemsByType(items, filter), [filter]);

  const relatedPrompts = useMemo(() => {
    const filteredItems = filterItems(matchedCategory.items);
    return filteredItems.filter((item) => item.id !== selectedItem.id).slice(0, 3);
  }, [filterItems, matchedCategory.items, selectedItem.id]);

  const filterPrefix = filter && ['free', 'pro'].includes(filter) ? `/${filter}` : '';

  if (relatedPrompts.length === 0) {
    return null;
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h4">Related Prompts</Typography>
      <Grid container spacing={2}>
        {relatedPrompts.map((relatedItem) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={relatedItem.id}>
            <MainCard
              boxShadow
              sx={{ height: 1, cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/prompts-overview${filterPrefix}/category/${encodeURIComponent(normalizeCategorySlug(matchedCategory))}/${encodeURIComponent(relatedItem.id)}`
                )
              }
            >
              <Typography variant="h5" sx={{ mb: 1 }}>
                {relatedItem.title}
              </Typography>
              {relatedItem.description && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {relatedItem.description.length > 100 ? `${relatedItem.description.substring(0, 100)}...` : relatedItem.description}
                </Typography>
              )}
              {relatedItem.type && (
                <Chip
                  label={relatedItem.type.toUpperCase()}
                  size="small"
                  color={relatedItem.type === 'pro' ? 'primary' : 'success'}
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                />
              )}
            </MainCard>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

RelatedPrompts.propTypes = { filter: PropTypes.string, matchedCategory: PropTypes.any, selectedItem: PropTypes.any };
