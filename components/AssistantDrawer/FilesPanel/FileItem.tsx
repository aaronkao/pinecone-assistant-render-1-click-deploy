'use client';

import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { AssistantFile } from '@/lib/types';
import { AssistantFileStatus as FileStatus, type AssistantFileStatus } from '@/lib/types';

interface FileItemProps {
  file: AssistantFile;
}

const styles = {
  root: {
    p: 0.75,
    pt: 0,
    border: 'none !important',
    borderRadius: 0,
    backgroundColor: 'background.surface',
    boxShadow: 'none',
    elevation: 0,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: (theme: any) => 
        theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.06)' 
          : 'rgba(255, 255, 255, 0.08)',
    },
    '&:focus': {
      backgroundColor: (theme: any) => 
        theme.palette.mode === 'light' 
          ? 'rgba(0, 0, 0, 0.06)' 
          : 'rgba(255, 255, 255, 0.08)',
      outline: 'none',
    },
    '&::before, &::after': {
      display: 'none',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  name: {
    fontWeight: '600',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'text.primary',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    mt: 0.5,
  },
};

function getFileStatusLabel(status: AssistantFileStatus | string): string {
  // Handle both enum and string values
  const statusStr = typeof status === 'string' ? status : String(status);
  
  switch (statusStr) {
    case FileStatus.AVAILABLE:
    case 'Available':
      return 'Available';
    case FileStatus.PROCESSING:
    case 'Processing':
      return 'Processing';
    case FileStatus.PROCESSING_FAILED:
    case 'ProcessingFailed':
      return 'Processing Failed';
    case FileStatus.DELETING:
    case 'Deleting':
      return 'Deleting';
    case FileStatus.DELETED:
    case 'Deleted':
      return 'Deleted';
    default:
      return typeof statusStr === 'string' ? statusStr : 'Unknown';
  }
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleDateString();
  } catch {
    return 'Unknown date';
  }
}

export default function FileItem({ file }: FileItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDownload = async () => {
    if (!file.id) return;
    
    // Use server-side proxy to download file (handles fresh signed URLs and expiration)
    const link = document.createElement('a');
    link.href = `/api/files/${file.id}/download-file`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isAvailable = file.status === FileStatus.AVAILABLE || file.status === 'Available';
  const hasSignedUrl = !!file.signed_url;

  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Tooltip title={file.name} placement="left">
          <Typography noWrap sx={styles.name}>
            {file.name}
          </Typography>
        </Tooltip>
        <IconButton size="small" onClick={handleMenuClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      {isAvailable ? (
        <Box sx={styles.fileInfo}>
          <Typography color="text.secondary" variant="body2">
            Updated {formatDate(file.updated_on)}
          </Typography>
        </Box>
      ) : (
        <Typography color="text.secondary" variant="body2">
          {getFileStatusLabel(file.status)}
        </Typography>
      )}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem 
          onClick={handleDownload} 
          disabled={!hasSignedUrl || !isAvailable}
        >
          <DownloadOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
          Download
        </MenuItem>
      </Menu>
    </Box>
  );
}

