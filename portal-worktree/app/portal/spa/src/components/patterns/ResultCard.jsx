import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// ==============================|| PATTERN - RESULT CARD ||============================== //
//
// The shape every signed-out screen takes when there is nothing to fill in:
// a mark, what happened, what it means, and the way onward.
//
// Mantis draws each of these as a one-off — check mail, 404, 500, under
// construction. Seven screens here end in this shape, and a shared card is what
// stops "expired" and "not found" from being styled as afterthoughts next to
// "verified".
//
// `mark` replaces the icon with a display numeral for the pages whose subject is
// a status code. Mantis renders a 3D illustration there; this portal draws no
// artwork it would have to ship as a file, for the same reason StandaloneLayout
// paints its backdrop with gradients — these pages are what a reader sees when
// something is already wrong, and an image request that has not answered is a
// second thing wrong.
//
// The tone is carried by the icon as well as the avatar colour, because these
// three outcomes differ only in tone and a reader who cannot tell success green
// from error red would otherwise have to infer the outcome from the prose.

export default function ResultCard({ icon: Icon, mark, tone = 'primary', title, description, children }) {
  return (
    <MainCard contentSX={{ p: { xs: 3, sm: 4 } }}>
      <Stack sx={{ gap: 2.5, alignItems: 'center', textAlign: 'center' }}>
        {mark ? (
          <Typography
            // decoration, so it must not be an element: variant="h1" maps to an
            // <h1> tag, which put a second, aria-hidden top-level heading above
            // the real one and made the numeral the page's accessible name
            component="div"
            aria-hidden="true"
            variant="h1"
            sx={{
              fontSize: { xs: '3.5rem', sm: '4.5rem' },
              lineHeight: 1,
              fontWeight: 700,
              color: `${tone}.main`,
              letterSpacing: '-0.02em'
            }}
          >
            {mark}
          </Typography>
        ) : (
          <Avatar type="filled" color={tone} size="lg" alt="">
            {Icon ? <Icon /> : null}
          </Avatar>
        )}
        <Stack sx={{ gap: 1 }}>
          <Typography component="h1" variant="h3">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          )}
        </Stack>
        {children && <Stack sx={{ gap: 1.5, width: '100%', alignItems: 'center' }}>{children}</Stack>}
      </Stack>
    </MainCard>
  );
}

ResultCard.propTypes = {
  icon: PropTypes.elementType,
  mark: PropTypes.node,
  tone: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  title: PropTypes.node,
  description: PropTypes.node,
  children: PropTypes.node
};
