import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import MessageThread from 'components/chat/MessageThread';
import MessageComposer from 'components/chat/MessageComposer';

// ==============================|| APP PHONE - CONVERSATION ||============================== //
//
// Message detail. The thread and the composer are the portal's own components,
// unchanged: if the design system cannot render a conversation at 360px without
// a mobile fork, it is not a design system.
//
// Attachments are off here. The app has a camera and a file picker behind that
// button and neither exists in this reconstruction; an inert paperclip on a
// phone screen is a promise the build cannot keep.

export default function ConversationScreen({ messages = [] }) {
  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <MessageThread
          messages={messages}
          emptyTitle={<FormattedMessage id="chat.thread.empty" />}
          emptyDetail={<FormattedMessage id="chat.thread.emptyDetail" />}
        />
      </Box>
      <MessageComposer onSend={() => {}} />
    </Stack>
  );
}

ConversationScreen.propTypes = { messages: PropTypes.array };
