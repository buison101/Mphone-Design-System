import { useEffect, useMemo, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import ContactCard from 'components/cards/contacts/ContactCard';
import ContactPreviewDialog from 'components/cards/contacts/ContactPreviewDialog';
import { contactName } from 'components/cards/contacts/contactFields';
import ContentState from 'components/states/ContentState';
import DataPagination from 'components/patterns/DataPagination';
import FilterBar from 'components/patterns/FilterBar';
import PageHeader from 'components/patterns/PageHeader';
import { callErrorMessage } from 'sections/customer/callErrors';
import useAnalytics from 'hooks/useAnalytics';
import useSession from 'hooks/useSession';
import { CLICK_TO_CALL_URL, CONTACTS_URL } from 'config';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| PAGE - CUSTOMER CARDS ||============================== //
//
// Mantis's Customer > Cards, on the portal's own directory. The composition is
// kept — a toolbar over a three-per-row wall of cards over a pager — because
// that is what makes a directory browsable. What is not kept is anything the
// server does not answer for.
//
// `contacts.php` is GET-only: it returns name, title, organization, type and the
// contact's phone numbers, paged, plus whether this identity may place a call.
// So there is no Add Customer button, no Edit and no Delete, and no Export PDF —
// three controls that would each need an endpoint that answers 405 today. What
// replaces the primary button is the control the page actually needs: the
// extension a call would be placed from.
//
// **Sorting says where it applies.** The endpoint sorts by name and takes no
// sort parameter, so anything this page offers can only reorder the twenty rows
// already on screen. The label says "on this page" rather than pretending the
// other four hundred moved.
//
// Search is the server's `q` (name, organization or number), debounced, and it
// resets to page one — a filtered result set is a different list, and keeping
// the reader on page seven of it is how an empty screen with no cause happens.

const SORTS = ['default', 'name', 'organization', 'title', 'type'];

export default function CustomerCards() {
  const intl = useIntl();
  const { session, can } = useSession();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState('default');
  const [source, setSource] = useState('');
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState(null);

  const allowed = can('contact_view');
  const { data, error, isLoading, isValidating, refresh } = useAnalytics(
    CONTACTS_URL,
    { q: query, page, page_size: pageSize },
    { enabled: allowed }
  );

  // the server caps `q` at 64 characters; sending more is a request it will trim
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim().slice(0, 64));
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // memoised so the default-source effect below does not re-run every render
  const extensions = useMemo(() => data?.extensions ?? [], [data]);

  // the first assigned extension is the sensible default caller, and it can only
  // be chosen once the payload has arrived
  useEffect(() => {
    if (!source && extensions.length > 0) setSource(extensions[0].extension_uuid);
  }, [extensions, source]);

  const callable = Boolean(can('click_to_call_call') && data?.capabilities?.click_to_call);

  const contacts = useMemo(() => {
    const rows = data?.contacts ?? [];
    if (sort === 'default') return rows;
    const key = {
      name: (row) => contactName(row, ''),
      organization: (row) => row.organization || '',
      title: (row) => row.title || '',
      type: (row) => row.type || ''
    }[sort];
    return [...rows].sort((a, b) => key(a).localeCompare(key(b), 'vi'));
  }, [data, sort]);

  const call = async (number) => {
    if (!source) return;
    setNotice(null);
    try {
      const response = await fetch(CLICK_TO_CALL_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session?.csrf ?? '' },
        body: JSON.stringify({ extension_uuid: source, destination: number })
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload.accepted) {
        setNotice({ severity: 'success', id: 'customer.call.accepted', values: { number } });
      } else {
        setNotice({ severity: 'error', id: callErrorMessage(payload.error) });
      }
    } catch {
      setNotice({ severity: 'error', id: 'customer.call.error.network' });
    }
  };

  const copy = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setNotice({ severity: 'success', id: 'customer.copy.done', values: { number } });
    } catch {
      setNotice({ severity: 'error', id: 'customer.copy.failed' });
    }
  };

  const total = data?.total ?? 0;
  const scope = data?.scope;
  const empty = contacts.length === 0;

  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader
        title={<FormattedMessage id="customer.cards.title" />}
        description={<FormattedMessage id="customer.cards.description" />}
        actions={
          scope ? (
            <Chip
              size="small"
              variant="outlined"
              color="secondary"
              label={intl.formatMessage({ id: scope === 'domain' ? 'customer.scope.domain' : 'customer.scope.assigned' })}
            />
          ) : null
        }
      />

      <MainCard content={false}>
        <FilterBar
          ariaLabel={intl.formatMessage({ id: 'customer.toolbar' })}
          busy={isValidating}
          busyLabel={intl.formatMessage({ id: 'table.loading' })}
        >
          <TextField
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={intl.formatMessage({ id: 'customer.search' }, { count: total })}
            aria-label={intl.formatMessage({ id: 'customer.search' }, { count: total })}
            sx={{ minWidth: { sm: 260 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined aria-hidden="true" />
                  </InputAdornment>
                )
              }
            }}
          />
          <TextField
            select
            size="small"
            label={intl.formatMessage({ id: 'customer.sort' })}
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            sx={{ minWidth: 200 }}
          >
            {SORTS.map((option) => (
              <MenuItem key={option} value={option}>
                {intl.formatMessage({ id: `customer.sort.${option}` })}
              </MenuItem>
            ))}
          </TextField>
          {callable && (
            <TextField
              select
              size="small"
              label={intl.formatMessage({ id: 'customer.field.source' })}
              value={source}
              onChange={(event) => setSource(event.target.value)}
              sx={{ minWidth: 200, ml: { sm: 'auto' } }}
            >
              {extensions.map((extension) => (
                <MenuItem key={extension.extension_uuid} value={extension.extension_uuid}>
                  {extension.extension}
                  {extension.effective_caller_id_name ? ` · ${extension.effective_caller_id_name}` : ''}
                </MenuItem>
              ))}
            </TextField>
          )}
        </FilterBar>
      </MainCard>

      {notice && (
        <Alert severity={notice.severity} onClose={() => setNotice(null)}>
          <FormattedMessage id={notice.id} values={notice.values} />
        </Alert>
      )}

      {!allowed ? (
        <MainCard>
          <ContentState
            state="forbidden"
            title={<FormattedMessage id="customer.forbidden" />}
            detail={<FormattedMessage id="customer.forbidden.detail" />}
          />
        </MainCard>
      ) : error ? (
        <MainCard>
          <ContentState
            state="error"
            title={<FormattedMessage id="table.error" />}
            actionLabel={<FormattedMessage id="action.retry" />}
            onAction={refresh}
          />
        </MainCard>
      ) : isLoading && !data ? (
        <MainCard>
          <ContentState state="loading" title={<FormattedMessage id="table.loading" />} />
        </MainCard>
      ) : empty ? (
        <MainCard>
          <ContentState
            state="empty"
            title={<FormattedMessage id={query ? 'customer.empty.search' : 'customer.empty'} values={{ query }} />}
            detail={<FormattedMessage id={query ? 'customer.empty.search.detail' : 'customer.empty.detail'} />}
            actionLabel={query ? <FormattedMessage id="customer.empty.clear" /> : undefined}
            onAction={query ? () => setSearch('') : undefined}
          />
        </MainCard>
      ) : (
        <Grid container spacing={2.5}>
          {contacts.map((contact, index) => (
            <Grid key={contact.uuid} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ContactCard
                contact={contact}
                index={index}
                callable={callable && Boolean(source)}
                onPreview={setPreview}
                onCall={call}
                onCopy={copy}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {allowed && total > 0 && (
        <MainCard content={false}>
          <DataPagination
            page={data?.page ?? page}
            pageSize={data?.page_size ?? pageSize}
            total={total}
            busy={isValidating}
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            onChange={(event, next) => setPage(next)}
          />
        </MainCard>
      )}

      <ContactPreviewDialog
        open={Boolean(preview)}
        contact={preview}
        extensions={extensions}
        source={source}
        scope={scope}
        callable={callable}
        onSourceChange={setSource}
        onCall={call}
        onClose={() => setPreview(null)}
      />
    </Stack>
  );
}
