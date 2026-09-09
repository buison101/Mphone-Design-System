import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import UserAvatar from './UserAvatar';
import ChatMessageAction from './ChatMessageAction';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { useGetUserChat } from 'api/chat';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

export default function ChatHistoryPage({ user }) {
  const bottomRef = useRef(null);
  const { chat, chatLoading } = useGetUserChat(user.name);

  useEffect(() => {
    // @js-ignore
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chat]);

  // Component for a 'Sent' message (Right-aligned)
  const SentMessage = ({ history, index }) => (
    <Stack direction="row" sx={{ width: 1, gap: 1.25, justifyContent: 'flex-end' }}>
      <Stack>
        <Stack direction="row" sx={{ width: 1, gap: 0.25, justifyContent: 'flex-end' }}>
          {/* Assuming ChatMessageAction and EditOutlined are available */}
          <ChatMessageAction index={index} />
          <IconButton size="small" color="secondary">
            <EditOutlined />
          </IconButton>
          <MainCard content={false} border={false} sx={{ ml: 0.75, p: 1.5, bgcolor: 'primary.main' }}>
            <Typography variant="h6" sx={{ overflowWrap: 'anywhere', color: 'common.white' }}>
              {history.text}
            </Typography>
          </MainCard>
        </Stack>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', textAlign: 'right' }}>
          {history.time}
        </Typography>
      </Stack>
      {/* Avatar for the current user/sender */}
      <UserAvatar size={48} user={{ online_status: 'available', avatar: 'avatar-1.png', name: 'User 1' }} />
    </Stack>
  );

  // Component for a 'Received' message (Left-aligned)
  const ReceivedMessage = ({ history, user }) => (
    <Stack direction="row" sx={{ width: 1, gap: 1.25 }}>
      <UserAvatar
        size={48}
        user={{
          online_status: user.online_status,
          avatar: user.avatar,
          // In group chat, use history.from for the name; for private chat, it's the peer's name
          name: user.isGroup ? history.from : user.name
        }}
      />
      <Stack sx={{ gap: 0.25 }}>
        <MainCard
          content={false}
          border={false}
          sx={(theme) => ({ p: 1.5, ...theme.applyStyles('dark', { bgcolor: 'background.default' }) })}
        >
          <Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>
            {history.text}
          </Typography>
        </MainCard>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {history.time}
        </Typography>
      </Stack>
    </Stack>
  );

  // Filter the chat array once based on the group status
  const filteredChat = chat.filter((item) => (user.isGroup ? item.type === 'group' : item.type !== 'group'));

  if (chatLoading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 410px)' }}>
        <CircularWithPath color="inherit" sx={{ color: 'text.secondary' }} />
      </Stack>
    );
  }

  return (
    <SimpleBar sx={{ overflowX: 'hidden', height: 'calc(100vh - 410px)', minHeight: 420, '& .simplebar-content': { height: '100%' } }}>
      <Box sx={{ px: 2.5, py: 0.75, height: '100%' }}>
        <Grid container spacing={2.5}>
          {filteredChat.map((history, index) => {
            // Determine if the message was sent by the current user
            let isMyMessage;

            if (user.isGroup) {
              // Group chat logic: Check if the 'from' user is 'User1' (the current user)
              isMyMessage = history.from === 'User1';
            } else {
              // Private chat logic: The 'from' field is used in your original code to distinguish sender.
              // Sent message: history.from is NOT the current user's name.
              // Received message: history.from IS the current user's name (which seems inverted from the original code but we'll stick to the original logic structure's intent: history.from !== user.name)
              // NOTE: In the original private chat block (!user.isGroup), the 'sent' message was based on `history.from !== user.name`. This is unusual. Typically a sent message is `history.from === user.name`. I'll follow the literal condition of your provided code for the optimization:
              isMyMessage = history.from !== user.name;
            }

            // Best practice is to use a unique ID for the key, not the index
            return (
              <Grid key={history.id || index} size={12} sx={{ width: 1 }}>
                {isMyMessage ? <SentMessage history={history} index={index} /> : <ReceivedMessage history={history} user={user} />}
              </Grid>
            );
          })}
          <Grid ref={bottomRef} />
        </Grid>
      </Box>
    </SimpleBar>
  );
}

ChatHistoryPage.propTypes = { user: PropTypes.any };
