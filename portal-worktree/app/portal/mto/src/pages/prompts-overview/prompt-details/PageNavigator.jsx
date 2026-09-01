import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// project imports
import usePromptNavigationPaths from './usePromptNavigationPaths';

// assets
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

// ==============================|| PROMPT DETAILS - PAGE NAVIGATOR ||============================== //

export default function PageNavigator({ filter, matchedCategory, selectedItem }) {
  const navigate = useNavigate();
  const { nextPath, previousPath } = usePromptNavigationPaths({ filter, matchedCategory, selectedItem });

  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: { xs: 'center', sm: 'space-between' } }}>
      <Button
        variant="outlined"
        disabled={!previousPath}
        startIcon={<ArrowLeftOutlined />}
        onClick={() => previousPath && navigate(previousPath)}
      >
        Previous
      </Button>
      <Button
        variant="outlined"
        disabled={!nextPath}
        endIcon={<ArrowLeftOutlined style={{ transform: 'rotate(180deg)' }} />}
        onClick={() => nextPath && navigate(nextPath)}
      >
        Next
      </Button>
    </Stack>
  );
}

PageNavigator.propTypes = { filter: PropTypes.string, matchedCategory: PropTypes.any, selectedItem: PropTypes.any };
