import { IconButton, Typography } from "@acid-info/lsd-react";
import { useRouter } from "next/router";
import { WalletIcon } from "../Icons/WalletIcon";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

type HeaderTopProps = {
  address?: string;
};

export default function HeaderTop({ address }: HeaderTopProps) {
  const router = useRouter();

  const [innerWidth, setInnerWidth] = useState(0);
  const [scrollValue, setScrollValue] = useState<number>(0);
  const [padding, setPadding] = useState(0);

  const spacerElementRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState<number>(0);

  const contentElementRef = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState(0);

  const PADDING_MIN = 12;
  let PADDING_MAX = 48;

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    PADDING_MAX = innerWidth > 688 ? 48 : 24;

    setTopOffset(spacerElementRef.current?.getBoundingClientRect().top ?? 0);

    const calculatedPadding =
      Math.max(PADDING_MAX - PADDING_MIN - scrollValue / 2, 0) + PADDING_MIN;
    setPadding(calculatedPadding);

    const newClientHeight = contentElementRef.current?.clientHeight ?? 0;
    setClientHeight(newClientHeight);
  }, [scrollValue, innerWidth]);

  const handleScroll = () => {
    setScrollValue(window.scrollY);
  };

  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };

  return (
    <>
      <Header
        className={`${scrollValue > 0 ? "scrolled" : ""}`}
        style={{ marginTop: `${topOffset}px`, padding: `${padding}px` }}
      >
        <div className="content" ref={contentElementRef}>
          <h1>Kurate</h1>

          <div>
            {address ? (
              <IconButton
                className="button"
                size="large"
                onClick={() => router.push("/ROUTES.PROFILE")}
              >
                <WalletIcon color="primary" />
                <Typography variant="label1">Formatted Address</Typography>
              </IconButton>
            ) : (
              <IconButton
                className="button"
                size="large"
                onClick={() => console.log("adapter.signIn")}
                disabled={/*!canConnectWallet()*/ false}
              >
                <WalletIcon color="primary" />
                <Typography variant="label1">
                  {scrollValue === 0 ? "Connect" : ""}
                </Typography>
              </IconButton>
            )}
          </div>
        </div>
      </Header>
      <div
        ref={spacerElementRef}
        style={{ height: `${clientHeight + PADDING_MAX * 2}px` }}
      />
    </>
  );
}

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: box-shadow 0.2s;
  z-index: 100;

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: padding 0.2s;

    @media (min-width: 688px) {
      transition: padding 0.2s;
    }
  }

  .button {
    width: unset;
    padding: 6px;
  }

  &.scrolled {
    box-shadow: 0 1px 5px 0 rgba(var(--color-body-text-rgb), 0.25);
    transition: box-shadow 0.2s;

    .header-content {
      transition: padding 0.2s;
    }
  }
`;
