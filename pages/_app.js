import '../styles/globals.css'
import {
  appReducers,
  AppStateProvider,
  initialState
} from "../store";
import Head from 'next/head';
import { config } from '@fortawesome/fontawesome-svg-core'

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <AppStateProvider reducer={appReducers} initialState={initialState}>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </AppStateProvider>
  )
}

export default MyApp
