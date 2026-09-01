import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import LogoMain from 'components/logo/LogoMain';
import { withAlpha } from 'utils/colorUtils';

// ==============================|| PATTERN - STANDALONE PAGE LAYOUT ||============================== //
//
// The frame for every page that renders outside the portal shell: mark at the
// top left, one card in the middle, a footer line at the bottom.
//
// It was AuthLayout until the maintenance screens needed the same frame. A 404
// and a sign-in have nothing to do with each other except this: neither has a
// drawer, a header or a session, and both have to look like the same product
// anyway. Naming the frame after the first family that needed it would have left
// the next one either importing something called "auth" or drawing its own.
//
// Mantis fills the background with a large blurred chevron artwork. The shape is
// drawn here with two radial gradients instead of an asset, for a plain reason:
// this is the first screen the portal ever paints, it is painted before the
// session exists, and an image request that has not answered yet leaves the one
// screen a locked-out user is looking at visibly unfinished. Gradients are part
// of the stylesheet and cannot arrive late.
//
// The mark is not a link. LogoSection wraps it in a route to the dashboard, and
// on this screen that route leads straight back to this screen.

// Two soft fields of colour, bottom left and top right, tinted from palette
// tokens so the backdrop follows the scheme instead of carrying a colour of its
// own. Both sit far under the contrast floor the card and its text need, which
// is the point: the backdrop is atmosphere and nothing else.
function backdrop(theme, primaryAlpha, infoAlpha) {
  return [
    `radial-gradient(60rem 40rem at 8% 88%, ${withAlpha(theme.vars.palette.primary.main, primaryAlpha)}, transparent 60%)`,
    `radial-gradient(48rem 34rem at 92% 8%, ${withAlpha(theme.vars.palette.info.main, infoAlpha)}, transparent 62%)`
  ].join(', ');
}

export default function StandaloneLayout({ children, banner }) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        backgroundImage: backdrop(theme, 0.3, 0.22),
        backgroundRepeat: 'no-repeat',
        // The same alphas in both schemes do not read the same. Over #fafafb the
        // pair that carries a dark page washes out to nothing, and over #121212
        // the pair that carries a light one glows. Each scheme gets its own,
        // tuned against its own canvas.
        ...theme.applyStyles('dark', { backgroundImage: backdrop(theme, 0.16, 0.12) })
      })}
    >
      {banner}

      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
        <LogoMain />
      </Box>

      {/* the card is centred in what is left after the mark and the footer, so it
          does not jump when a taller error message appears above the fields */}
      <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', px: 2, py: { xs: 3, sm: 5 } }}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>{children}</Box>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2.5, sm: 4 }, py: 3 }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          &copy; {new Date().getFullYear()} Mphone
        </Typography>
      </Stack>
    </Box>
  );
}

StandaloneLayout.propTypes = { children: PropTypes.node, banner: PropTypes.node };
