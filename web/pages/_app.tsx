
import type { AppProps } from 'next/app'
import MagicProvider from '@/components/magic/MagicProvider'

import '@/styles/globals.css'
// import "@rainbow-me/rainbowkit/styles.css"
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'

import { QueryClient, QueryClientProvider } from 'react-query';
import FormModal from '@/components/ui/FormModal'
import { ModalProvider } from '@/components/ModalProvider';


const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return ( 
 
      <MagicProvider>
        <QueryClientProvider client={queryClient}>

          <ModalProvider>
            <FormModal />
            <AppHeader />
            <Component {...pageProps} />
            {/* <AppFooter /> */}
          </ModalProvider>

        </QueryClientProvider>
      </MagicProvider>

  )
}
