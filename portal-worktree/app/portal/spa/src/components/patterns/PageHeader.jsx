import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function PageHeader({ title, description, eyebrow, actions }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'space-between', gap: 2 }}>
      <Stack sx={{ gap: 0.5, minWidth: 0 }}>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.08em' }}>
            {eyebrow}
          </Typography>
        )}
        <Typography component="h1" variant="h2">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 680 }}>
            {description}
          </Typography>
        )}
      </Stack>
      {actions && (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  eyebrow: PropTypes.node,
  actions: PropTypes.node
};
