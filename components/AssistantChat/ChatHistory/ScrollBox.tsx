'use client';

import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface ScrollBoxProps {
  loading: boolean;
  children: React.ReactNode;
}

const styles = {
  scrollBox: {
    position: 'absolute' as const,
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    scrollbarGutter: 'stable' as const,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    px: 2, // Match ChatHistory root padding
    py: 1, // Match ChatHistory root padding
  },
  anchor: {
    height: '1px',
    width: '1px',
    visibility: 'hidden' as const,
  },
};

export default function ScrollBox({ loading, children }: ScrollBoxProps) {
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const { ref: scrollAnchorRef, inView } = useInView({
    threshold: 1,
  });

  // When loading starts, scroll to the bottom
  useEffect(() => {
    if (loading) {
      scrollBoxRef.current?.scrollTo({
        top: scrollBoxRef.current?.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [loading]);

  // When children update, scroll to the bottom if the user is already at the bottom
  useEffect(() => {
    if (inView && scrollBoxRef.current) {
      scrollBoxRef.current.scrollTo({
        top: scrollBoxRef.current.scrollHeight,
      });
    }
  }, [children, inView]);

  return (
    <Box ref={scrollBoxRef} sx={styles.scrollBox}>
      {children}
      <Box ref={scrollAnchorRef} sx={styles.anchor}>
        Anchor
      </Box>
    </Box>
  );
}

