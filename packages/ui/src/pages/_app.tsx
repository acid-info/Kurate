import type { AppProps } from "next/app";
import { defaultThemes, ThemeProvider } from "@acid-info/lsd-react";
import { css, Global } from "@emotion/react";
import Head from "next/head";
import useIsDarkState from "@/hooks/useIsDarkState";

export default function App({ Component, pageProps }: AppProps) {
  const { isDarkState } = useIsDarkState();

  return (
    <ThemeProvider
      theme={isDarkState ? defaultThemes.dark : defaultThemes.light}
    >
      <Head>
        <title>Kurate</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <Global
        styles={css`
          :root {
            --grey-200: #ececec;
          }

          html {
            scroll-behavior: smooth;
            line-height: 1.25;
            -webkit-text-size-adjust: 100%;
            overflow-wrap: anywhere;
          }

          body {
            width: 100%;
            min-height: 100dvh;
            min-height: 100vh;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            background: rgb(var(--lsd-surface-primary));
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          * {
            margin: 0;
            padding: 0;
          }
        `}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}