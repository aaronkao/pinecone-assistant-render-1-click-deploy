'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeContextProvider } from '@/lib/ThemeContext';
import './globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pinecone Assistant</title>
        <meta name="description" content="Chat with your Pinecone Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
        {children}
          </ThemeContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

