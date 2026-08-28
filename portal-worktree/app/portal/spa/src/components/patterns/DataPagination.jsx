import PropTypes from 'prop-types';

import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormattedMessage, useIntl } from 'react-intl';

export default function DataPagination({ page, pageSize, total, onChange, pageSizeOptions = [], onPageSizeChange, busy = false }) {
  const intl = useIntl();
  if (total <= 0) return null;

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), pages);
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <Stack
      component="nav"
      aria-label={intl.formatMessage({ id: 'pagination.label' })}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1.5, p: 2, borderTop: 1, borderColor: 'divider' }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: { xs: 'center', sm: 'left' } }}>
        <FormattedMessage id="pagination.summary" values={{ from, to, total }} />
      </Typography>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {pageSizeOptions.length > 0 && onPageSizeChange && (
          <TextField
            select
            size="small"
            label={intl.formatMessage({ id: 'pagination.pageSize' })}
            value={pageSize}
            disabled={busy}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            sx={{ minWidth: 104 }}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
        {pages > 1 && <Pagination page={currentPage} count={pages} disabled={busy} onChange={onChange} size="small" />}
      </Stack>
    </Stack>
  );
}

DataPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onPageSizeChange: PropTypes.func,
  busy: PropTypes.bool
};
