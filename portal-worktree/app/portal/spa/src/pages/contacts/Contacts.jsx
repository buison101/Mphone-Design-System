import { useState } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { FormattedMessage, useIntl } from 'react-intl';

import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';
import DataPagination from 'components/patterns/DataPagination';
import PageHeader from 'components/patterns/PageHeader';
import useAnalytics from 'hooks/useAnalytics';
import useSession from 'hooks/useSession';
import { CLICK_TO_CALL_URL, CONTACTS_URL } from 'config';

export default function Contacts() {
  const intl = useIntl();
  const { session, can } = useSession();
  const [filters, setFilters] = useState({ q: '', page: 1, page_size: 20 });
  const [source, setSource] = useState(session?.user?.extensions?.[0]?.extension_uuid ?? '');
  const [message, setMessage] = useState('');
  const { data, error, isLoading, refresh } = useAnalytics(CONTACTS_URL, filters);
  const call = async (number) => {
    setMessage('');
    try {
      const response = await fetch(CLICK_TO_CALL_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf },
        body: JSON.stringify({ extension_uuid: source, destination: number })
      });
      setMessage(intl.formatMessage({ id: response.ok ? 'clickToCall.accepted' : 'clickToCall.failed' }));
    } catch {
      setMessage(intl.formatMessage({ id: 'clickToCall.failed' }));
    }
  };
  const contacts = data?.contacts ?? [];

  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader title={<FormattedMessage id="contacts.title" />} description={<FormattedMessage id="contacts.description" />} />
      <MainCard>
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            label={intl.formatMessage({ id: 'contacts.search' })}
            value={filters.q}
            onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value, page: 1 }))}
          />
          <TextField
            select
            size="small"
            label={intl.formatMessage({ id: 'contacts.source' })}
            value={source}
            onChange={(event) => setSource(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            {(session?.user?.extensions ?? []).map((extension) => (
              <MenuItem key={extension.extension_uuid} value={extension.extension_uuid}>
                {extension.extension}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {message && (
          <Alert severity={message === intl.formatMessage({ id: 'clickToCall.accepted' }) ? 'success' : 'error'} sx={{ mt: 1.5 }}>
            {message}
          </Alert>
        )}
      </MainCard>
      {isLoading && !data ? (
        <ContentState state="loading" title={<FormattedMessage id="table.loading" />} />
      ) : error ? (
        <ContentState
          state="error"
          title={<FormattedMessage id="table.error" />}
          actionLabel={<FormattedMessage id="action.retry" />}
          onAction={refresh}
        />
      ) : (
        <>
          <Typography variant="h6">
            <FormattedMessage id="contacts.company" />
          </Typography>
          {contacts.length === 0 ? (
            <ContentState state="empty" title={<FormattedMessage id="contacts.empty" />} />
          ) : (
            <Grid container spacing={2}>
              {contacts.map((contact) => (
                <Grid key={contact.uuid} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <MainCard>
                    <Typography variant="h6">{contact.name || contact.organization || '—'}</Typography>
                    {contact.name && contact.organization && (
                      <Typography variant="body2" color="text.secondary">
                        {contact.organization}
                      </Typography>
                    )}
                    <Stack sx={{ mt: 2, gap: 1 }}>
                      {contact.phones.map((phone) => (
                        <Stack
                          key={`${contact.uuid}-${phone.number}`}
                          direction="row"
                          sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
                        >
                          <Typography variant="body2">
                            {phone.number}
                            {phone.extension ? ` · ${phone.extension}` : ''}
                          </Typography>
                          <Button size="small" disabled={!source || !can('click_to_call_call')} onClick={() => call(phone.number)}>
                            <FormattedMessage id="contacts.call" />
                          </Button>
                        </Stack>
                      ))}
                    </Stack>
                  </MainCard>
                </Grid>
              ))}
            </Grid>
          )}
          {(data?.total ?? 0) > 0 && (
            <MainCard content={false}>
              <DataPagination
                page={data?.page ?? filters.page}
                pageSize={data?.page_size ?? filters.page_size}
                total={data?.total ?? 0}
                onChange={(event, page) => setFilters((current) => ({ ...current, page }))}
              />
            </MainCard>
          )}
          <Typography variant="h6">
            <FormattedMessage id="contacts.directory" />
          </Typography>
          <Grid container spacing={1.5}>
            {(data?.extensions ?? []).map((extension) => (
              <Grid key={extension.extension_uuid} size={{ xs: 12, sm: 6, lg: 3 }}>
                <MainCard>
                  <Typography variant="h6">{extension.extension}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {extension.effective_caller_id_name || '—'}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    disabled={!source || !can('click_to_call_call')}
                    onClick={() => call(extension.extension)}
                  >
                    <FormattedMessage id="contacts.call" />
                  </Button>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Stack>
  );
}
