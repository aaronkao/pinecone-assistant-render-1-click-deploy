'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect, useRef } from 'react';
import { useThemeMode } from '@/lib/ThemeContext';

// SVG icon components matching marketing site exactly
const LightModeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M6.5625 1.0625V2.5625V3.125H5.4375V2.5625V1.0625V0.5H6.5625V1.0625ZM10.2422 3.05469L9.16406 4.13281L8.76562 4.53125L7.96875 3.73438L8.36719 3.33594L9.44531 2.25781L9.84375 1.85938L10.6406 2.65625L10.2422 3.05469ZM2.53125 2.25781L3.60938 3.33594L4.00781 3.73438L3.21094 4.53125L2.8125 4.13281L1.75781 3.05469L1.35938 2.65625L2.15625 1.85938L2.55469 2.25781H2.53125ZM0.5625 5.9375H2.0625H2.625V7.0625H2.0625H0.5625H0V5.9375H0.5625ZM9.9375 5.9375H11.4375H12V7.0625H11.4375H9.9375H9.375V5.9375H9.9375ZM3.60938 9.6875L2.53125 10.7422L2.15625 11.1406L1.35938 10.3438L1.75781 9.94531L2.8125 8.89062L3.21094 8.49219L4.00781 9.28906L3.60938 9.6875ZM9.16406 8.89062L10.2422 9.96875L10.6406 10.3672L9.84375 11.1406L9.44531 10.7422L8.36719 9.6875L7.96875 9.28906L8.76562 8.49219L9.16406 8.89062ZM6.5625 10.4375V11.9375V12.5H5.4375V11.9375V10.4375V9.875H6.5625V10.4375ZM7.5 6.5C7.5 5.98438 7.19531 5.49219 6.75 5.21094C6.28125 4.95312 5.69531 4.95312 5.25 5.21094C4.78125 5.49219 4.5 5.98438 4.5 6.5C4.5 7.03906 4.78125 7.53125 5.25 7.8125C5.69531 8.07031 6.28125 8.07031 6.75 7.8125C7.19531 7.53125 7.5 7.03906 7.5 6.5ZM3.375 6.5C3.375 5.5625 3.86719 4.71875 4.6875 4.25C5.48438 3.75781 6.49219 3.75781 7.3125 4.25C8.10938 4.71875 8.625 5.5625 8.625 6.5C8.625 7.46094 8.10938 8.30469 7.3125 8.77344C6.49219 9.26562 5.48438 9.26562 4.6875 8.77344C3.86719 8.30469 3.375 7.46094 3.375 6.5Z" 
      fill="currentColor"
    />
  </svg>
);

const DarkModeIcon = () => (
  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M8.09766 0.898438V0.871094C7.46875 1.03516 6.89453 1.33594 6.375 1.69141C6.23828 1.77344 6.12891 1.85547 6.01953 1.96484C4.89844 2.92188 4.16016 4.37109 4.16016 5.98438C4.16016 8.52734 5.99219 10.6602 8.39844 11.125C8.72656 11.1797 9.05469 11.2344 9.41016 11.2344C9.875 11.2344 10.3125 11.1523 10.7227 11.043C10.3398 11.4531 9.90234 11.8086 9.41016 12.082C9.13672 12.2461 8.83594 12.3828 8.5625 12.4922C7.87891 12.7383 7.14062 12.875 6.375 12.875C2.98438 12.875 0.25 10.1406 0.25 6.75C0.25 3.66016 2.51953 1.11719 5.5 0.707031C5.80078 0.652344 6.07422 0.625 6.375 0.625C6.97656 0.625 7.55078 0.734375 8.09766 0.898438ZM3.69531 2.75781C2.41016 3.63281 1.5625 5.08203 1.5625 6.75C1.5625 9.29297 3.47656 11.3438 5.96484 11.5625C4.10547 10.4141 2.84766 8.33594 2.84766 5.98438C2.84766 4.80859 3.14844 3.71484 3.69531 2.75781Z" 
      fill="currentColor"
    />
  </svg>
);

const styles = {
  root: {
    position: 'relative' as const,
  },
  button: {
    width: '39px',
    height: '39px',
    border: 1,
    borderColor: 'divider',
    borderRight: 0, // Remove right border to share with Sign Up button
    borderRadius: 0, // Make it square
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.primary',
    backgroundColor: 'background.paper',
    '&:hover': {
      borderColor: 'text.primary',
    },
    '& svg': {
      fill: 'currentColor',
    },
  },
  dropdown: {
    position: 'absolute' as const,
    right: 0,
    top: '100%',
    zIndex: 1300,
    width: '39px',
    height: '39px',
    border: 1,
    borderColor: 'divider',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  dropdownItem: {
    width: '39px',
    height: '39px',
    border: 1,
    borderColor: 'divider',
    borderRadius: 0, // Make it square
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.secondary',
    backgroundColor: 'background.paper',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'text.primary',
      backgroundColor: 'action.hover',
      color: 'text.primary',
    },
    '& svg': {
      fill: 'currentColor',
    },
  },
};

export default function ThemeDropdown() {
  const { mode, toggleMode } = useThemeMode();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [show]);

  const handleBlur = (e: React.FocusEvent) => {
    const target = e.relatedTarget as Node | null;
    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setShow(false);
    }
  };

  const getCurrentThemeIcon = () => {
    return mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />;
  };

  const getAlternateTheme = () => {
    return mode === 'light' ? 'dark' : 'light';
  };

  const getAlternateThemeIcon = () => {
    return mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />;
  };

  if (!mounted) {
    return (
      <IconButton
        sx={styles.button}
        aria-label="Theme"
        disabled
      >
        {/* Empty button preserves layout space */}
      </IconButton>
    );
  }

  return (
    <Box
      ref={dropdownRef}
      sx={styles.root}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={handleBlur}
    >
      <IconButton
        sx={styles.button}
        aria-label={`Current theme: ${mode}. Click to change.`}
        title={`Current theme: ${mode}. Click to change.`}
      >
        {getCurrentThemeIcon()}
      </IconButton>

      {show && (
        <Box sx={styles.dropdown}>
          <Box
            component="button"
            onClick={() => {
              toggleMode();
              setTimeout(() => setShow(false), 100);
            }}
            sx={styles.dropdownItem}
            aria-label={`Switch to ${getAlternateTheme()} mode`}
            title={`Switch to ${getAlternateTheme()} mode`}
          >
            {getAlternateThemeIcon()}
          </Box>
        </Box>
      )}
    </Box>
  );
}
