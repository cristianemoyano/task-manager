import type { AppProps } from 'next/app';

import '../styles/index.scss';
import { ModalProvider } from '@/contexts/useModal';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  );
}

export default MyApp;
