import InitialLoad from "@/components/Layout/InitialLoad";
import type { AppProps } from "next/app";
import { lazy, Suspense } from "react";

const Layout = lazy(() => import("../components/Layout/Layout"));

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback={<InitialLoad />}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Suspense>
  );
}