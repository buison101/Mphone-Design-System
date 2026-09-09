import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import ApiOutlined from '@ant-design/icons/ApiOutlined';
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import DisconnectOutlined from '@ant-design/icons/DisconnectOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import SwapOutlined from '@ant-design/icons/SwapOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import RoundIconCard from 'components/cards/statistics/RoundIconCard';
import useExtensionsStatus from '../hooks/useExtensionsStatus';
import usePortalActiveCalls from '../hooks/usePortalActiveCalls';
import usePortalSession from '../hooks/usePortalSession';

const directionIcon = {
  inbound: <ArrowDownOutlined style={{ fontSize: '0.875rem' }} />,
  outbound: <ArrowUpOutlined style={{ fontSize: '0.875rem' }} />,
  local: <SwapOutlined style={{ fontSize: '0.875rem' }} />,
  voicemail: <PhoneOutlined style={{ fontSize: '0.875rem' }} />
};
const stateColor = { ringing: 'warning', answered: 'success', early: 'info' };

function formatElapsed(createdTime, now) {
  if (!createdTime) return '—';
  const seconds = Math.max(Math.floor((now - Number(createdTime) / 1000) / 1000), 0);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const pad = (value) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes % 60)}:${pad(seconds % 60)}` : `${minutes}:${pad(seconds % 60)}`;
}

function CallRow({ call, canHangup, onHangup, now }) {
  const intl = useIntl();
  const state = call.answer_state || 'unknown';
  return (
    <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1}>
      <TableCell>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex' }}>{directionIcon[call.direction] ?? <PhoneOutlined />}</Box>
          <FormattedMessage id={`mphoneUi.activeCalls.direction.${call.direction || 'unknown'}`} />
        </Stack>
      </TableCell>
      <TableCell>
        <Stack>
          <Typography variant="subtitle2">{call.caller_caller_id_name || '—'}</Typography>
          <Typography variant="caption" color="text.secondary">
            {call.caller_caller_id_number || ''}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{call.caller_destination_number || '—'}</TableCell>
      <TableCell>
        <Chip
          size="small"
          variant="combined"
          color={stateColor[state] ?? 'secondary'}
          label={intl.formatMessage({ id: `mphoneUi.activeCalls.state.${state}` })}
        />
      </TableCell>
      <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatElapsed(call.created_time, now)}
      </TableCell>
      {canHangup && (
        <TableCell align="right">
          <Tooltip title={intl.formatMessage({ id: 'mphoneUi.activeCalls.hangup' })}>
            <IconButton size="small" color="error" onClick={() => onHangup(call.unique_id)}>
              <DisconnectOutlined />
            </IconButton>
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  );
}

CallRow.propTypes = {
  call: PropTypes.object.isRequired,
  canHangup: PropTypes.bool.isRequired,
  onHangup: PropTypes.func.isRequired,
  now: PropTypes.number.isRequired
};

export default function ActiveCallsPage() {
  const intl = useIntl();
  const { calls, status, hangup } = usePortalActiveCalls();
  const { can } = usePortalSession();
  const { data: extensionData } = useExtensionsStatus();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const extensions = extensionData?.extensions ?? [];
  const online = extensions.filter((extension) => extension.registered).length;
  const answered = calls.filter((call) => call.answer_state === 'answered').length;
  const ringing = calls.filter((call) => call.answer_state === 'ringing').length;
  const canHangup = can('call_active_hangup');
  const waiting = status !== 'subscribed' && status !== 'preview' && calls.length === 0;
  const cards = [
    {
      title: 'onlineExtensions',
      value: online,
      content: 'registrationCaption',
      icon: ApiOutlined,
      color: 'success.main',
      bgcolor: 'success.lighter'
    },
    {
      title: 'connected',
      value: calls.length,
      content: 'connectedCaption',
      icon: CheckCircleOutlined,
      color: 'primary.main',
      bgcolor: 'primary.lighter'
    },
    { title: 'ringing', value: ringing, content: 'ringingCaption', icon: BellOutlined, color: 'warning.main', bgcolor: 'warning.lighter' },
    { title: 'calling', value: answered, content: 'callingCaption', icon: PhoneOutlined, color: 'error.main', bgcolor: 'error.lighter' }
  ];

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <RoundIconCard
            primary={intl.formatMessage({ id: `mphoneUi.activeCalls.${card.title}` })}
            secondary={String(card.value)}
            content={intl.formatMessage({ id: `mphoneUi.activeCalls.${card.content}` })}
            iconPrimary={card.icon}
            color={card.color}
            bgcolor={card.bgcolor}
          />
        </Grid>
      ))}

      <Grid size={{ xs: 12, lg: 8 }}>
        <Typography id="active-calls-table-title" variant="h5">
          <FormattedMessage id="mphoneUi.activeCalls.tableTitle" />
        </Typography>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <TableContainer
            sx={{
              width: '100%',
              overflowX: 'auto',
              position: 'relative',
              display: 'block',
              maxWidth: '100%',
              '& td, & th': { whiteSpace: 'nowrap' }
            }}
          >
            <Table aria-labelledby="active-calls-table-title">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="mphoneUi.activeCalls.direction" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="mphoneUi.activeCalls.caller" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="mphoneUi.activeCalls.destination" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="mphoneUi.activeCalls.status" />
                  </TableCell>
                  <TableCell align="right">
                    <FormattedMessage id="mphoneUi.activeCalls.duration" />
                  </TableCell>
                  {canHangup && <TableCell />}
                </TableRow>
              </TableHead>
              <TableBody>
                {calls.map((call) => (
                  <CallRow key={call.unique_id} call={call} canHangup={canHangup} onHangup={hangup} now={now} />
                ))}
                {calls.length === 0 && (
                  <TableRow sx={{ '&.MuiTableRow-root:hover': { bgcolor: 'transparent' }, '&:last-child td': { border: 0 } }}>
                    <TableCell colSpan={canHangup ? 6 : 5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                      <FormattedMessage id={waiting ? 'mphoneUi.activeCalls.connecting' : 'mphoneUi.activeCalls.empty'} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Typography variant="h5">
          <FormattedMessage id="mphoneUi.activeCalls.extensionStatus" />
        </Typography>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            {extensions.map((extension, index) => (
              <ListItemButton key={extension.extension_uuid} divider={index < extensions.length - 1}>
                <ListItemText
                  primary={extension.caller_id_name || extension.extension}
                  secondary={extension.extension}
                  slotProps={{ primary: { variant: 'subtitle1' }, secondary: { variant: 'body2', sx: { color: 'text.secondary' } } }}
                />
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Chip
                    size="small"
                    variant="combined"
                    color={extension.registered ? 'success' : 'warning'}
                    label={intl.formatMessage({
                      id: extension.registered ? 'mphoneUi.activeCalls.registered' : 'mphoneUi.activeCalls.unregistered'
                    })}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    <FormattedMessage id="mphoneUi.activeCalls.devices" values={{ count: extension.registered_devices ?? 0 }} />
                  </Typography>
                </Stack>
              </ListItemButton>
            ))}
            {extensions.length === 0 && (
              <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                <FormattedMessage id="mphoneUi.activeCalls.noExtensions" />
              </Box>
            )}
          </List>
        </MainCard>
      </Grid>
    </Grid>
  );
}
