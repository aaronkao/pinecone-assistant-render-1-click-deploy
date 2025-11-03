'use client';

import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MOBILE_BREAKPOINT, DRAWER_PANEL_HEADER_HEIGHT } from '@/lib/constants';

export { DRAWER_PANEL_HEADER_HEIGHT };

interface DrawerPanelProps {
  controls: DrawerControls;
  children: React.ReactNode;
}

export interface DrawerControls {
  show: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    minHeight: DRAWER_PANEL_HEADER_HEIGHT,
    position: 'relative' as const,
    pl: { xs: 3, md: 5 },
  },
  closeButton: (show: boolean, isMobile: boolean) => ({
    position: 'absolute' as const,
    left: -6, 
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 200,
    opacity: show && !isMobile ? 1 : 0,
    pointerEvents: show && !isMobile ? 'auto' as const : 'none' as const,
    backgroundColor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    display: { xs: 'none', md: 'flex' },
    '&:hover': {
      borderColor: 'text.primary',
    },
  }),
};

export default function DrawerPanel({ controls, children }: DrawerPanelProps) {
  const isMobile = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT}px)`);
  
  return (
    <>
      <Box sx={styles.header} data-testid="files-drawer-panel-header">
        <Tooltip title={controls.show && !isMobile ? 'Collapse' : ''}>
          <IconButton
            onClick={controls.onClose}
            disabled={!controls.show || isMobile}
            id="close-drawer-button"
            sx={styles.closeButton(controls.show, isMobile)}
            size="small"
          >
            <KeyboardDoubleArrowRightOutlinedIcon fontSize="small" color="secondary" />
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1 }}>
          <Box component="span" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Files
          </Box>
        </Box>
      </Box>
      {children}
    </>
  );
}

