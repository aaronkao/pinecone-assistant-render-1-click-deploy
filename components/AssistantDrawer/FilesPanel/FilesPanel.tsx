'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { useQuery } from '@tanstack/react-query';
import type { AssistantFile } from '@/lib/types';
import FileItem from './FileItem';

type FilesPanelProps = {
  assistantName: string; // Only used for React Query cache key differentiation
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    p: 2,
  },
  filesScrollBox: {
    overflowY: 'auto',
    flex: 1,
  },
  files: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    p: 2,
  },
  emptyState: {
    mt: 2,
    border: 2,
    borderStyle: 'dashed',
    borderColor: 'divider',
    borderRadius: 1,
    p: 4,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'text.secondary',
    mb: 2,
  },
};

async function fetchFiles(): Promise<{ files: AssistantFile[] }> {
  const response = await fetch('/api/files');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch files');
  }
  return response.json();
}

export default function FilesPanel({ assistantName }: FilesPanelProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['files', assistantName],
    queryFn: fetchFiles,
    staleTime: 0, // Always consider data stale to ensure fresh signed URLs on page refresh
    refetchOnMount: true, // Always refetch when component mounts (e.g., on page refresh)
  });

  const files = data?.files || [];
  const hasFiles = files.length > 0;

  if (isLoading) {
    return (
      <Box sx={styles.loading}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.error}>
        <Typography color="error">Error loading files</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
          {error instanceof Error ? error.message : 'Please try again later'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      {!hasFiles ? (
        <Box sx={styles.emptyState}>
          <FolderOpenOutlinedIcon sx={styles.emptyIcon} />
          <Typography color="text.secondary" variant="body2">
            No files uploaded yet
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Files uploaded to your assistant will appear here
          </Typography>
        </Box>
      ) : (
        <Box sx={styles.filesScrollBox}>
          <Box sx={styles.files}>
            {files.map((file) => (
              <FileItem key={file.id} file={file} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

