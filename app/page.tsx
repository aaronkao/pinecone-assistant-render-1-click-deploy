'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import AssistantChat from '@/components/AssistantChat/AssistantChat';
import AssistantDrawer from '@/components/AssistantDrawer/AssistantDrawer';
import type { DrawerControls } from '@/components/AssistantDrawer/DrawerPanel';
import type { AssistantFile } from '@/lib/types';
import Logo from '@/components/Logo';
import ThemeDropdown from '@/components/ThemeDropdown/ThemeDropdown';
import {
  DRAWER_WIDE_WIDTH,
  DRAWER_NARROW_WIDTH,
  WIDE_PAGE_WIDTH,
  MOBILE_BREAKPOINT,
} from '@/lib/constants';

async function fetchFiles(): Promise<{ files: AssistantFile[] }> {
  const response = await fetch('/api/files');
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return response.json();
}

async function fetchAssistantName(): Promise<{ assistantName: string }> {
  const response = await fetch('/api/assistant-name');
  if (!response.ok) {
    throw new Error('Failed to fetch assistant name');
  }
  return response.json();
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: 'background.paper',
  },
  header: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: 'space-between',
    gap: { xs: 1, md: 1 },
    borderBottom: 1,
    borderColor: 'divider',
    minHeight: { xs: 'auto', md: 70 },
    px: 3,
    py: { xs: 1, md: 0 },
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    mr: { xs: 0, md: 2 },
    '& svg': {
      height: { xs: '17px', md: '21px' },
      width: 'auto',
    },
  },
  assistantNameRow: {
    display: { xs: 'flex', md: 'none' },
    justifyContent: 'flex-start',
    width: '100%',
  },
  assistantNameDesktop: {
    display: { xs: 'none', md: 'block' },
  },
  main: {
    position: 'relative' as const,
    flex: 1,
    overflow: { xs: 'auto', md: 'hidden' },
    display: 'flex',
    width: '100%',
    flexDirection: { xs: 'column' as const, md: 'row' as const },
  },
  chatContainer: (drawerOpen: boolean, drawerWidth: number, isMobile: boolean, hideFiles: boolean) => ({
    width: isMobile ? '100%' : (drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%'),
    height: isMobile ? (hideFiles ? '100%' : '80vh') : '100%',
    minWidth: 0,
    minHeight: isMobile ? '400px' : 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    transition: isMobile ? 'none' : 'width 0.3s ease-out',
    position: 'relative' as const,
    flex: isMobile ? (hideFiles ? '1 1 100%' : '0 0 80vh') : undefined,
    flexShrink: 0,
    flexGrow: isMobile ? (hideFiles ? 1 : 0) : undefined,
    flexBasis: isMobile ? (hideFiles ? '100%' : '80vh') : undefined,
  }),
  expandButton: {
    position: 'absolute' as const,
    right: 16,
    top: 16,
    zIndex: 101,
    backgroundColor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    display: { xs: 'none', md: 'flex' },
    '&:hover': {
      borderColor: 'text.primary',
    },
  },
  drawerWrapper: (drawerOpen: boolean, drawerWidth: number, isMobile: boolean) => ({
    position: isMobile ? ('relative' as const) : ('absolute' as const),
    top: isMobile ? 'auto' : 0,
    right: isMobile ? 'auto' : 0,
    height: isMobile ? 'auto' : '100%',
    width: isMobile ? '100%' : (drawerOpen ? drawerWidth : 0),
    borderLeft: isMobile ? 0 : 1,
    borderTop: isMobile ? 1 : 0,
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    flexShrink: 0,
    transition: isMobile ? 'none' : 'width 0.3s ease-out',
    overflow: 'hidden',
    zIndex: 1,
    display: isMobile ? (drawerOpen ? 'block' : 'none') : 'block',
  }),
  themeToggle: {
    ml: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
};

export default function Home() {
  const { data: assistantData } = useQuery({
    queryKey: ['assistant-name'],
    queryFn: fetchAssistantName,
  });

  const { data: filesData } = useQuery({
    queryKey: ['files'],
    queryFn: fetchFiles,
    staleTime: 0, // Always consider data stale to ensure fresh signed URLs on page refresh
    refetchOnMount: true, // Always refetch when component mounts (e.g., on page refresh)
  });

  const assistantName = assistantData?.assistantName || '';
  const hideFiles = process.env.NEXT_PUBLIC_HIDE_FILES === 'true';
  const [showDrawer, setShowDrawer] = useState(!hideFiles);
  const drawerWidth = useMediaQuery(`(max-width:${WIDE_PAGE_WIDTH}px)`)
    ? DRAWER_NARROW_WIDTH
    : DRAWER_WIDE_WIDTH;
  const isMobile = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT}px)`);

  const hasFiles = (filesData?.files.length ?? 0) > 0;

  // If hiding files, never show drawer
  const effectiveShowDrawer = hideFiles ? false : (isMobile ? true : showDrawer);

  const drawerControls: DrawerControls = {
    show: effectiveShowDrawer,
    onOpen: () => !hideFiles && setShowDrawer(true),
    onClose: () => !hideFiles && !isMobile && setShowDrawer(false),
  };

  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Box sx={styles.topRow}>
          <Box sx={styles.title}>
            <Link
              href="https://www.pinecone.io/"
              target="_blank"
              rel="noopener noreferrer"
              sx={styles.logo}
            >
              <Logo />
            </Link>
            {assistantName && (
              <Typography 
                variant="h6" 
                component="h1" 
                noWrap 
                sx={{ color: 'text.primary', ...styles.assistantNameDesktop }}
              >
                {assistantName}
              </Typography>
            )}
          </Box>
          <Box sx={styles.themeToggle}>
            <ThemeDropdown />
            <Button
              component="a"
              href="https://app.pinecone.io/?sessionType=signup"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                border: 1,
                borderColor: 'primary.main',
                borderTop: 1,
                borderBottom: 1,
                borderRight: 1,
                borderLeft: 0,
                borderRadius: 0,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                px: 2,
                py: 1,
                fontSize: '0.9375rem',
                lineHeight: 1.4,
                textTransform: 'none',
                fontWeight: 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'primary.dark',
                  color: 'background.default',
                },
              }}
            >
              Sign up for Pinecone
            </Button>
          </Box>
        </Box>
        {assistantName && (
          <Box sx={styles.assistantNameRow}>
            <Typography variant="h6" component="h1" noWrap sx={{ color: 'text.primary' }}>
              {assistantName}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={styles.main}>
        <Box sx={styles.chatContainer(hideFiles ? false : showDrawer, drawerWidth, isMobile, hideFiles)}>
          {!hideFiles && !showDrawer && !isMobile && (
            <Tooltip title="Expand files panel">
              <IconButton
                onClick={() => setShowDrawer(true)}
                sx={styles.expandButton}
                size="small"
              >
                <KeyboardDoubleArrowLeftOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <AssistantChat hasFiles={hasFiles} />
        </Box>
        {!hideFiles && (
          <Box sx={styles.drawerWrapper(showDrawer, drawerWidth, isMobile)}>
            <AssistantDrawer
              assistantName={assistantName}
              controls={drawerControls}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
