import { useSyncExternalStore } from 'react';

// material-ui
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// project imports
import Profile from '../Profile';
import ProfileProposal from '.';

// Review-only switch between the current and the proposed profile popup. It is
// loaded through HeaderProfile.jsx only when import.meta.env.DEV is true, so it
// never ships in a production build. Labels are review chrome, not product copy.
const VARIANTS = [
  { value: 'current', label: 'Hiện tại' },
  { value: 'proposal', label: 'Đề xuất' }
];

// Shared across every mounted avatar (desktop header and mobile section).
let variant = 'proposal';
const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getVariant = () => variant;
const setVariant = (next) => {
  variant = next;
  listeners.forEach((listener) => listener());
};

export default function ProfilePreviewSwitch() {
  const current = useSyncExternalStore(subscribe, getVariant, getVariant);

  return (
    <>
      {/* Portaled to body: the mobile header popper is transformed, which would
          otherwise anchor position: fixed to the popper instead of the viewport. */}
      <Portal>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: (theme) => theme.zIndex.tooltip,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
            Popup hồ sơ (preview)
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={current}
            onChange={(event, next) => next && setVariant(next)}
            aria-label="Phiên bản popup hồ sơ (chỉ trong preview)"
            sx={{ '& .MuiToggleButton-root': { px: 1, py: 0.25, typography: 'caption', textTransform: 'none', lineHeight: 1.5 } }}
          >
            {VARIANTS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>
      </Portal>
      {current === 'proposal' ? <ProfileProposal /> : <Profile />}
    </>
  );
}
