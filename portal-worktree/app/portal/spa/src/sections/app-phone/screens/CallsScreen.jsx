import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import ContentState from 'components/states/ContentState';

// assets
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';

// ==============================|| APP PHONE - CALLS ||============================== //
//
// Call history, filtered by three tabs rather than a filter sheet: on a phone the
// only three questions worth one tap are all, missed and recorded.
//
// The direction arrow is the row's icon, and missed calls are the only rows drawn
// in error colour. Colouring every inbound row would leave the reader hunting for
// the two that matter.

const TABS = ['all', 'missed', 'recorded'];

export default function CallsScreen({ calls = [], onCall }) {
  const intl = useIntl();
  const [tab, setTab] = useState('all');

  const rows = calls.filter((row) =>
    tab === 'missed' ? row.status === 'missed' : tab === 'recorded' ? row.duration !== '—' && row.status === 'answered' : true
  );

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
      <Tabs value={tab} onChange={(event, next) => setTab(next)} variant="fullWidth">
        {TABS.map((value) => (
          <Tab key={value} value={value} label={intl.formatMessage({ id: `appPhone.calls.${value}` })} sx={{ minHeight: 44 }} />
        ))}
      </Tabs>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        {rows.length === 0 ? (
          <ContentState state="empty" title={<FormattedMessage id="appPhone.calls.empty" />} compact />
        ) : (
          <List sx={{ p: 0 }}>
            {rows.map((row, index) => {
              const missed = row.status === 'missed';
              const Arrow = row.direction === 'inbound' ? ArrowDownOutlined : ArrowUpOutlined;
              return (
                <ListItemButton key={row.id} divider={index < rows.length - 1} sx={{ px: 2, py: 1.5, gap: 1.5 }}>
                  <Avatar color={missed ? 'error' : 'secondary'} size="sm">
                    <Arrow />
                  </Avatar>
                  <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="subtitle2" noWrap sx={{ color: missed ? 'error.main' : 'text.primary' }}>
                      {row.name || row.number}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {row.name ? `${row.number} · ` : ''}
                      {row.time} · {row.duration}
                    </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    color="success"
                    variant="light"
                    onClick={(event) => {
                      event.stopPropagation();
                      onCall?.(row);
                    }}
                    aria-label={intl.formatMessage({ id: 'webphone.call' })}
                  >
                    <PhoneOutlined />
                  </IconButton>
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>
    </Stack>
  );
}

CallsScreen.propTypes = { calls: PropTypes.array, onCall: PropTypes.func };
