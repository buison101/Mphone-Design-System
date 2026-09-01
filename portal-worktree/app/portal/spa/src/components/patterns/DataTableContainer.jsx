import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';

export default function DataTableContainer({ children, ariaLabel, sx }) {
  const intl = useIntl();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('sm'));
  const label = ariaLabel || intl.formatMessage({ id: 'table.regionLabel' });

  return (
    <Box>
      {compact && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 2, pt: 1.5 }}>
          {intl.formatMessage({ id: 'table.scrollHint' })}
        </Typography>
      )}
      <TableContainer
        role="region"
        tabIndex={0}
        aria-label={label}
        sx={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2
          },
          ...sx
        }}
      >
        {children}
      </TableContainer>
    </Box>
  );
}

DataTableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  sx: PropTypes.object
};
