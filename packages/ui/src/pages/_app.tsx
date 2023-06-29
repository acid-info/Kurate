import type { AppProps } from "next/app";
import { lazy, ReactNode, Suspense } from "react";
import { NextComponentType, NextPageContext } from "next";
import InitialLoad from "@/layouts/DefaultLayout/InitialLoad";
import "../styles/globals.css";

const DefaultLayout = lazy(
  () => import("../layouts/DefaultLayout/DefaultLayout")
);

type NextLayoutComponentType<P = {}> = NextComponentType<
  NextPageContext,
  any,
  P
> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppLayoutProps<P = {}> = AppProps & {
  Component: NextLayoutComponentType;
};

export default function App({ Component, pageProps }: AppLayoutProps) {
  const getLayout = Component.getLayout || ((page: ReactNode) => <>{page}</>);

  return (
    <Suspense fallback={<InitialLoad />}>
      <DefaultLayout>{getLayout(<Component {...pageProps} />)}</DefaultLayout>
    </Suspense>
  );
}
