import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import PageHeader from 'components/patterns/PageHeader';
import TabbedCard from 'components/patterns/TabbedCard';
import ConfirmActionDialog from 'components/patterns/ConfirmActionDialog';
import ContentState from 'components/states/ContentState';
import AccountProfileTab from 'sections/account/AccountProfileTab';
import AccountExtensionsTab from 'sections/account/AccountExtensionsTab';
import AccountDevicesTab from 'sections/account/AccountDevicesTab';
import AccountSecurityTab from 'sections/account/AccountSecurityTab';
import useAnalytics from 'hooks/useAnalytics';
import useSession from 'hooks/useSession';
import { ACCOUNT_URL } from 'config';

// assets
import UserOutlined from '@ant-design/icons/UserOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import DesktopOutlined from '@ant-design/icons/DesktopOutlined';
import SafetyOutlined from '@ant-design/icons/SafetyOutlined';

// ==============================|| PAGE - ACCOUNT ||============================== //
//
// One identity, four facets, one card — the Mantis account shape fitted to what
// this portal can actually do.
//
// The page keeps a single H1 and lets the tab strip carry the section name.
// Mantis retitles the page per tab, which reads well but leaves a screen reader
// announcing a different document for what is still one record.
//
// Every destructive action goes through one dialog held here rather than inside
// the tabs. A tab that could sign a device out on its own would have to own the
// wording of the consequence too, and the four would drift apart.

const TABS = [
  { value: 'profile', labelId: 'account.tab.profile', icon: UserOutlined },
  { value: 'extensions', labelId: 'account.tab.extensions', icon: PhoneOutlined },
  { value: 'devices', labelId: 'account.tab.devices', icon: DesktopOutlined },
  { value: 'security', labelId: 'account.tab.security', icon: SafetyOutlined }
];

function AccountWorkspace({ session }) {
  const intl = useIntl();
  const { data, error, isLoading, refresh } = useAnalytics(ACCOUNT_URL);
  const [tab, setTab] = useState('profile');
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const postAction = async (body) => {
    try {
      const response = await fetch(ACCOUNT_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session?.csrf || '' },
        body: JSON.stringify(body)
      });
      const payload = await response.json().catch(() => ({}));
      return { response, payload };
    } catch {
      return { response: { ok: false }, payload: {} };
    }
  };

  const revoke = async (device) => {
    setBusy(device.session_id);
    setFeedback('');
    const { response, payload } = await postAction({ action: 'revoke_device', session_id: device.session_id });
    // revoking the session this browser holds ends the page along with it
    if (response.ok && payload.current) {
      window.location.reload();
      return;
    }
    setFeedback(response.ok ? 'revoked' : 'error');
    setBusy('');
    if (response.ok) refresh();
  };

  const signOutOthers = async () => {
    setBusy('all');
    setFeedback('');
    const { response } = await postAction({ action: 'logout_others' });
    setFeedback(response.ok ? 'othersRevoked' : 'error');
    setBusy('');
    if (response.ok) refresh();
  };

  const confirmAction = async () => {
    const current = confirmation;
    setConfirmation(null);
    if (current?.type === 'device') await revoke(current.device);
    if (current?.type === 'others') await signOutOthers();
  };

  const header = <PageHeader title={<FormattedMessage id="account.title" />} description={<FormattedMessage id="account.description" />} />;

  if (isLoading && !data) {
    return (
      <Stack sx={{ gap: 2.5 }}>
        {header}
        <ContentState state="loading" title={<FormattedMessage id="table.loading" />} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack sx={{ gap: 2.5 }}>
        {header}
        <ContentState
          state="error"
          title={<FormattedMessage id="table.error" />}
          actionLabel={<FormattedMessage id="action.retry" />}
          onAction={refresh}
        />
      </Stack>
    );
  }

  const devices = data?.devices ?? [];
  const extensions = data?.extensions ?? [];
  const activeDevices = devices.filter((device) => !device.revoked_at);
  const otherDevices = activeDevices.filter((device) => !device.current);

  const panels = {
    profile: () => (
      <AccountProfileTab
        identity={data?.identity}
        customer={data?.customer}
        membership={data?.membership}
        extensions={extensions}
        activeDevices={activeDevices.length}
        domain={session?.domain?.domain_name}
      />
    ),
    extensions: () => <AccountExtensionsTab extensions={extensions} />,
    devices: () => (
      <AccountDevicesTab
        devices={devices}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((value) => !value)}
        onRevoke={(device) => setConfirmation({ type: 'device', device })}
        busy={busy}
      />
    ),
    security: () => (
      <AccountSecurityTab
        identity={data?.identity}
        activeDevices={activeDevices.length}
        otherDevices={otherDevices.length}
        onSignOutOthers={() => setConfirmation({ type: 'others' })}
        busy={busy}
      />
    )
  };

  return (
    <Stack sx={{ gap: 2.5 }}>
      {header}

      {feedback === 'revoked' && (
        <Alert severity="success" onClose={() => setFeedback('')}>
          <FormattedMessage id="account.devices.revoked" />
        </Alert>
      )}
      {feedback === 'othersRevoked' && (
        <Alert severity="success" onClose={() => setFeedback('')}>
          <FormattedMessage id="account.devices.othersRevoked" />
        </Alert>
      )}
      {feedback === 'error' && (
        <Alert severity="error" onClose={() => setFeedback('')}>
          <FormattedMessage id="account.error" />
        </Alert>
      )}

      <TabbedCard
        value={tab}
        onChange={setTab}
        ariaLabel={intl.formatMessage({ id: 'account.tabsLabel' })}
        tabs={TABS.map((item) => ({
          value: item.value,
          label: intl.formatMessage({ id: item.labelId }),
          icon: item.icon,
          content: panels[item.value]
        }))}
      />

      <ConfirmActionDialog
        open={Boolean(confirmation)}
        title={<FormattedMessage id={confirmation?.type === 'device' ? 'account.devices.revoke' : 'account.logoutAll'} />}
        description={
          <FormattedMessage id={confirmation?.type === 'device' ? 'account.devices.revokeConfirm' : 'account.logoutAllConfirm'} />
        }
        cancelLabel={<FormattedMessage id="action.cancel" />}
        confirmLabel={<FormattedMessage id={confirmation?.type === 'device' ? 'account.devices.revoke' : 'account.logoutAll'} />}
        busy={busy !== ''}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmAction}
      />
    </Stack>
  );
}

AccountWorkspace.propTypes = { session: PropTypes.object.isRequired };

export default function Account() {
  const { session, logout } = useSession();

  if (!session?.identity) {
    return (
      <ContentState
        state="forbidden"
        title={<FormattedMessage id="account.identityRequired.title" />}
        detail={<FormattedMessage id="account.identityRequired.detail" />}
        actionLabel={<FormattedMessage id="account.identityRequired.action" />}
        onAction={logout}
      />
    );
  }

  return <AccountWorkspace session={session} />;
}
