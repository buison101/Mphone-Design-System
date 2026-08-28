import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Dot from 'components/@extended/Dot';

// ==============================|| APP PHONE - EXTENSIONS ||============================== //
//
// Which extension this device answers as. A radio, not a switch per row: the
// phone can only be one extension at a time, and a column of switches would let
// someone believe otherwise.
//
// Registration is a dot plus its word. An unregistered extension can still be
// picked — the app registers on selection — so it stays selectable and the state
// is written underneath rather than disabling the row with no explanation.

export default function ExtensionsScreen({ extensions = [], selected, onSelect }) {
  const intl = useIntl();

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="appPhone.extensions.hint" />
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {extensions.map((row, index) => (
            <ListItemButton
              key={row.id}
              divider={index < extensions.length - 1}
              onClick={() => onSelect?.(row)}
              sx={{ px: 1.5, py: 1.5, gap: 1, alignItems: 'flex-start' }}
            >
              <Radio
                checked={selected === row.id}
                tabIndex={-1}
                size="small"
                inputProps={{ 'aria-label': intl.formatMessage({ id: 'chat.extensionLine' }, { extension: row.extension }) }}
              />
              <Stack sx={{ minWidth: 0, flexGrow: 1, gap: 0.5 }}>
                <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="subtitle2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {row.extension}
                  </Typography>
                  {row.primary && (
                    <Chip
                      size="small"
                      variant="combined"
                      color="primary"
                      label={intl.formatMessage({ id: 'appPhone.extensions.primary' })}
                    />
                  )}
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {row.label}
                </Typography>
                <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
                  <Dot color={row.registered ? 'success' : 'secondary'} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={row.registered ? 'appPhone.extensions.registered' : 'appPhone.extensions.unregistered'} />
                    {row.registered && row.device ? ` · ${row.device}` : ''}
                  </Typography>
                </Stack>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Stack>
  );
}

ExtensionsScreen.propTypes = { extensions: PropTypes.array, selected: PropTypes.string, onSelect: PropTypes.func };
