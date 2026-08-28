import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// third-party
import { useIntl } from 'react-intl';

// project imports
import IconButton from 'components/@extended/IconButton';

// assets
import SendOutlined from '@ant-design/icons/SendOutlined';
import PaperClipOutlined from '@ant-design/icons/PaperClipOutlined';
import SmileOutlined from '@ant-design/icons/SmileOutlined';

// ==============================|| CHAT - MESSAGE COMPOSER ||============================== //
//
// Enter sends, Shift+Enter breaks the line. That is what every messenger the
// reader already uses does, and a chat box that needs a mouse to send is the
// fastest way to make people go back to their phone.
//
// The field grows to four lines and then scrolls, so a long message never
// pushes the conversation off the screen it belongs to.
//
// Send stays disabled on an empty or whitespace-only draft rather than sending
// nothing and leaving an empty bubble in the history.

export default function MessageComposer({ onSend, disabled = false, placeholder, attachments = false }) {
  const intl = useIntl();
  const [draft, setDraft] = useState('');
  const empty = draft.trim().length === 0;

  const send = () => {
    if (empty || disabled) return;
    onSend?.(draft.trim());
    setDraft('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <Stack>
      <Divider />
      <Stack direction="row" sx={{ p: 1.5, gap: 1, alignItems: 'flex-end' }}>
        {attachments && (
          <Stack direction="row" sx={{ gap: 0.5, pb: 0.5 }}>
            <Tooltip title={intl.formatMessage({ id: 'chat.emoji' })}>
              <span>
                <IconButton color="secondary" disabled={disabled} aria-label={intl.formatMessage({ id: 'chat.emoji' })}>
                  <SmileOutlined />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'chat.attach' })}>
              <span>
                <IconButton color="secondary" disabled={disabled} aria-label={intl.formatMessage({ id: 'chat.attach' })}>
                  <PaperClipOutlined />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )}

        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder || intl.formatMessage({ id: 'chat.placeholder' })}
          aria-label={intl.formatMessage({ id: 'chat.placeholder' })}
        />

        <IconButton
          variant="contained"
          color="primary"
          onClick={send}
          disabled={disabled || empty}
          aria-label={intl.formatMessage({ id: 'chat.send' })}
          sx={{ mb: 0.25 }}
        >
          <SendOutlined />
        </IconButton>
      </Stack>
    </Stack>
  );
}

MessageComposer.propTypes = {
  onSend: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  attachments: PropTypes.bool
};
