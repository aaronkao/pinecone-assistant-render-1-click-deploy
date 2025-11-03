'use client';

import Box from '@mui/material/Box';
import DrawerPanel from './DrawerPanel';
import FilesPanel from './FilesPanel/FilesPanel';
import type { DrawerControls } from './DrawerPanel';

interface AssistantDrawerProps {
  assistantName: string;
  controls: DrawerControls;
}

const styles = {
  root: {
    pb: 2,
    px: 3,
    width: '100%',
    backgroundColor: 'background.paper',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
};

export default function AssistantDrawer({ assistantName, controls }: AssistantDrawerProps) {
  return (
    <Box sx={styles.root}>
      <DrawerPanel controls={controls}>
        <FilesPanel assistantName={assistantName} />
      </DrawerPanel>
    </Box>
  );
}

