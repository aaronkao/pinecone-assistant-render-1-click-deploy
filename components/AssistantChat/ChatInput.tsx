'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface ChatInputProps {
  loading?: boolean;
  disableClearAction: boolean;
  placeholder?: string;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
}

const MAX_MESSAGE_LENGTH = 127999;
const MAX_MESSAGE_LENGTH_ERROR = `Message must be less than 128k characters`;

const styles = {
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mx: 2,
    mb: 1,
  },
  input: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? 'background.default' : 'background.surface',
    borderRadius: 1,
    py: 0.5,
    px: 0.5,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  }),
  sendButton: {
    ':disabled': {
      color: 'secondary',
    },
  },
  clearButton: {
    height: 'min-content',
    m: 0,
    px: 0,
    py: 1,
    color: 'secondary.dark',
    ':disabled': {
      color: 'secondary',
    },
  },
};

const messageSchema = z.object({
  message: z.string().min(1, '').max(MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH_ERROR),
});

function ChatInput({
  onSendMessage,
  onClearChat,
  disableClearAction,
  loading = false,
  placeholder = 'Ask a question...',
}: ChatInputProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const {
    handleSubmit,
    reset,
    register,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      message: '',
    },
    resolver: zodResolver(messageSchema),
  });

  const sendMessage = ({ message }: { message: string }) => {
    if (!loading) {
      onSendMessage(message.trim());
      reset();
    }
  };

  const inputError = errors.message?.message;

  return (
    <>
      <form onSubmit={handleSubmit(sendMessage)}>
        <Box>
          <Box sx={styles.inputRow}>
            <Box sx={styles.input(isDarkMode)}>
              <Input
                placeholder={placeholder}
                disableUnderline
                fullWidth
                autoFocus
                sx={{ 
                  color: 'text.primary',
                  pl: 1, // Match IconButton padding on the right
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 1,
                  },
                }}
                {...register('message')}
              />
              <IconButton
                id="send-button"
                type="submit"
                sx={styles.sendButton}
                color="inherit"
                disabled={!isValid || loading}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            <Button
              sx={styles.clearButton}
              disabled={disableClearAction}
              variant="text"
              onClick={onClearChat}
              color="secondary"
            >
              Clear
            </Button>
          </Box>
          {inputError && (
            <Box sx={{ mb: 1, textAlign: 'center' }}>
              <Box component="span" sx={{ color: 'error.main', fontSize: '0.875rem' }}>
                {inputError}
              </Box>
            </Box>
          )}
        </Box>
      </form>
    </>
  );
}

export default ChatInput;

