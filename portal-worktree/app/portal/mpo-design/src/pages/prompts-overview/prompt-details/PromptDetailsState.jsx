import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// data
import { promptCategories } from 'data/prompt-categories';

function PromptHeader({ title, caption }) {
  return (
    <MainCard>
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant="h4">{title}</Typography>
        {caption && (
          <Typography variant="h5" sx={{ color: 'grey.600', fontWeight: 400, width: { xs: 1, sm: '75%' } }}>
            {caption}
          </Typography>
        )}
      </Stack>
    </MainCard>
  );
}

// ==============================|| PROMPT DETAILS - ERROR STATES ||============================== //

export default function PromptDetailsState({ category, item, matchedCategory, selectedItem }) {
  if (!category) {
    return (
      <Stack sx={{ gap: 2 }}>
        <PromptHeader title="Prompt item not found" caption="No category was provided" />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Please select a category item from the drawer or use the correct URL format.
        </Typography>
      </Stack>
    );
  }

  if (!matchedCategory) {
    return (
      <Stack sx={{ gap: 2 }}>
        <PromptHeader title="Category not found" caption={`Category '${category}' does not exist`} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Available categories: {promptCategories.map((promptCategory) => promptCategory.name).join(', ')}.
        </Typography>
      </Stack>
    );
  }

  if (!selectedItem) {
    return (
      <Stack sx={{ gap: 2 }}>
        <PromptHeader title="Prompt item not found" caption={`Item '${item}' is not available in category '${matchedCategory.name}'`} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Available prompts: {matchedCategory.items.map((promptItem) => promptItem.title).join(', ')}.
        </Typography>
      </Stack>
    );
  }

  return null;
}

PromptHeader.propTypes = { title: PropTypes.string, caption: PropTypes.string };

PromptDetailsState.propTypes = {
  category: PropTypes.string,
  item: PropTypes.string,
  matchedCategory: PropTypes.any,
  selectedItem: PropTypes.any
};
