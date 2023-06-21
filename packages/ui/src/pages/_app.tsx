import type { AppProps } from "next/app";
import { lazy, Suspense } from "react";
import "../styles/globals.css";
import InitialLoad from "@/layouts/DefaultLayout/InitialLoad";

const DefaultLayout = lazy(
  () => import("../layouts/DefaultLayout/DefaultLayout")
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback={<InitialLoad />}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </Suspense>
  );
}
