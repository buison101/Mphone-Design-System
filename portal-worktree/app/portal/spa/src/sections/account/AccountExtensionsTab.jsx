import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import DataTableContainer from 'components/patterns/DataTableContainer';
import ContentState from 'components/states/ContentState';

// ==============================|| ACCOUNT - EXTENSIONS TAB ||============================== //
//
// Which extensions this identity may use, and which it may administer. Two
// separate permissions, so they get two chips rather than one combined label:
// "use" without "manage" is the ordinary case and the reader has to be able to
// see that at a glance.
//
// A permission the identity does not hold is drawn as an outlined chip, not
// omitted. An empty cell reads as missing data; a visibly unfilled chip reads as
// a decision.

function PermissionChip({ granted, label }) {
  return <Chip size="small" variant={granted ? 'combined' : 'outlined'} color={granted ? 'success' : 'secondary'} label={label} />;
}

PermissionChip.propTypes = { granted: PropTypes.bool, label: PropTypes.string };

export default function AccountExtensionsTab({ extensions = [] }) {
  const intl = useIntl();

  if (extensions.length === 0) {
    return (
      <ContentState
        state="empty"
        title={<FormattedMessage id="account.extensions.empty" />}
        detail={<FormattedMessage id="account.extensions.emptyDetail" />}
      />
    );
  }

  return (
    <DataTableContainer ariaLabel={intl.formatMessage({ id: 'account.extensions' })}>
      <Table size="small" sx={{ minWidth: 560, '& td, & th': { whiteSpace: 'nowrap' } }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="account.extensions.number" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="account.extensions.name" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="account.extensions.permissions" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {extensions.map((extension) => (
            <TableRow hover key={extension.extension_uuid ?? extension.extension} sx={{ '&:last-child td': { border: 0 } }}>
              <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                <Typography variant="subtitle2">{extension.extension}</Typography>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'normal' }}>{extension.display_name || '—'}</TableCell>
              <TableCell>
                <Stack direction="row" sx={{ gap: 0.75 }}>
                  <PermissionChip granted={Boolean(extension.can_use)} label={intl.formatMessage({ id: 'account.canUse' })} />
                  <PermissionChip granted={Boolean(extension.can_manage)} label={intl.formatMessage({ id: 'account.canManage' })} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableContainer>
  );
}

AccountExtensionsTab.propTypes = { extensions: PropTypes.array };
