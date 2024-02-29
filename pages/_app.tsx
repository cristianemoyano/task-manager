import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import nProgress from 'nprogress';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import '../styles/index.scss';
import { ModalProvider } from '@/contexts/useModal';
import { ThemeProvider } from '@/contexts/useTheme';

Router.events.on('routeChangeStart', nProgress.start);

Router.events.on('routeChangeError', nProgress.done);

Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
    <SessionProvider session={session}>
      <ModalProvider>
        <ThemeProvider>
          <DndProvider backend={HTML5Backend}>
            <Component {...pageProps} />
          </DndProvider>
        </ThemeProvider>
      </ModalProvider>
    </SessionProvider>
    </>
  );
}

export default MyApp;
