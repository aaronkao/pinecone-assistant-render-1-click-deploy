'use client';

import Card from '@mui/material/Card';
import { useChat } from '@/hooks/useChat';
import ChatHistory from './ChatHistory/ChatHistory';
import ChatInput from './ChatInput';

type AssistantChatProps = {
  hasFiles: boolean;
};

const styles = {
  root: {
    boxSizing: 'border-box' as const,
    height: '100%',
    width: '100%',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    p: 0,
    border: 'none',
  },
};

function AssistantChat({ hasFiles }: AssistantChatProps) {
  const { chat, sendMessage, clearChat } = useChat();

  return (
    <Card sx={styles.root}>
      <ChatHistory chat={chat} hasFiles={hasFiles} />
      <ChatInput
        loading={chat.loading}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        disableClearAction={!chat.messages.length || chat.loading}
      />
    </Card>
  );
}

export default AssistantChat;

