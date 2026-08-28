import PropTypes from 'prop-types';

// material-ui
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import IconButton from 'components/@extended/IconButton';

// assets
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

// ==============================|| APP PHONE - TOP BAR ||============================== //
//
// Title on the left, at most two actions on the right. A phone top bar that
// carries three or more actions pushes the title into an ellipsis, and in
// Vietnamese the title is the longer string.
//
// Back is a real control, not decoration: it is what a detail screen owes the
// reader when the system gesture is not available.

export default function AppTopBar({ title, subtitle, onBack, actions, backLabel }) {
  return (
    <>
      <Stack direction="row" sx={{ px: 1.5, py: 1.5, gap: 1, alignItems: 'center', flexShrink: 0 }}>
        {onBack && (
          <IconButton size="small" color="secondary" onClick={onBack} aria-label={backLabel}>
            <ArrowLeftOutlined />
          </IconButton>
        )}
        <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {subtitle}
            </Typography>
          )}
        </Stack>
        {actions}
      </Stack>
      <Divider />
    </>
  );
}

AppTopBar.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  onBack: PropTypes.func,
  actions: PropTypes.node,
  backLabel: PropTypes.string
};
