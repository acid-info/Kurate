import { ReactNode } from "react";
import { defaultThemes, ThemeProvider } from "@acid-info/lsd-react";
import { css, Global } from "@emotion/react";
import Head from "next/head";
import useIsDarkState from "@/hooks/useIsDarkState";
import { ProfileProvider } from "@/context/ProfileContext";
import { ChatProvider } from "@/context/ChatContext";
import { PostProvider } from "@/context/PostContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { TokenProvider } from "@/context/TokenContext";
import useIsMounted from "@/hooks/useIsMounted";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mounted } = useIsMounted();
  const { isDarkState } = useIsDarkState();

  if (!mounted) {
    return <></>;
  }

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
      <ProfileProvider>
        <PostProvider>
          <PersonaProvider>
            <ChatProvider>
              <HistoryProvider>
                <TokenProvider>
                  {children}
                </TokenProvider>
              </HistoryProvider>
            </ChatProvider>
          </PersonaProvider>
        </PostProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
