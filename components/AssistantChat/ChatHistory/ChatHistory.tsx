'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import Logo from '@/components/Logo';
import type { AssistantChatSession } from '@/lib/types';
import ScrollBox from './ScrollBox';
import ChatMessageBlock from '@/components/ChatMessageBlock/ChatMessageBlock';

type ChatHistoryProps = {
  chat?: AssistantChatSession;
  hasFiles: boolean;
};

const styles = {
  root: {
    position: 'relative' as const,
    height: '100%',
    width: '100%',
    overflowY: 'auto' as const,
    boxSizing: 'border-box' as const,
    px: 2,
    py: 1,
  },
};

function ChatHistory({ chat, hasFiles }: ChatHistoryProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const loading = chat?.loading || false;
  const error = chat?.error;
  const messages = useMemo(() => chat?.messages ?? [], [chat?.messages]);

  if (messages.length === 0) {
    const logoColor = isDarkMode ? 'white' : 'black';
    const welcomeMessage = process.env.NEXT_PUBLIC_WELCOME_MESSAGE || (hasFiles
      ? 'Ask your assistant a question to get started.'
      : 'Your assistant is set up. Get started by uploading your files.');
    
    return (
      <Box sx={{ ...styles.root, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center" sx={{ width: '100%' }}>
          <Box sx={{ maxWidth: '160px', mx: 'auto', mb: 1 }}>
            <Logo color={logoColor as 'white' | 'black'} />
          </Box>
          <Typography color="secondary" mt={0.5}>
            {welcomeMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <ScrollBox loading={loading}>
        {messages.map((chatMessage, index) => (
          <ChatMessageBlock
            key={index}
            message={chatMessage}
          />
        ))}
        {error && (
          <ChatMessageBlock
            message={{ role: 'error', content: error.toString() }}
          />
        )}
      </ScrollBox>
    </Box>
  );
}

export default ChatHistory;

