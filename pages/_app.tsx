import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

import '../styles/index.scss';
import { ModalProvider } from '@/contexts/useModal';
import { ThemeProvider } from '@/contexts/useTheme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </ModalProvider>
  );
}

export default MyApp;
