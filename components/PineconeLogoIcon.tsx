'use client';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function PineconeLogoIcon({ size = 20 }: { size?: number }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const logoSrc = isDarkMode 
    ? '/icons/pinecone_logo_small_light.svg'
    : '/icons/pinecone_logo_small_dark.svg';

  return (
    <Box
      component="img"
      src={logoSrc}
      alt="Pinecone"
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
      }}
    />
  );
}
