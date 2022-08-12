import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/index.scss';
import { ModalProvider } from '@/contexts/useModal';
import { ThemeProvider } from '@/contexts/useTheme';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </ModalProvider>
    </SessionProvider>
  );
}

export default MyApp;
