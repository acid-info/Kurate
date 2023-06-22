import { IconButton, Typography } from "@acid-info/lsd-react";
import { useRouter } from "next/router";
import { WalletIcon } from "../Icons/WalletIcon";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { canConnectWallet } from "@/services";
import { formatAddress } from "@/utils/format";
import useAdapter from "@/hooks/useAdapter";
import { useProfileContext } from "@/context/ProfileContext";
import useWindow from "@/hooks/useWindow";
import { ROUTES } from "@/routes";

type HeaderTopProps = {
  address?: string;
};

export default function HeaderTop({ address }: HeaderTopProps) {
  const router = useRouter();
  const { profile, updateProfile } = useProfileContext();
  const { adapter } = useAdapter();
  const { innerWidth, scrollValue } = useWindow();

  const [padding, setPadding] = useState(0);

  const spacerElementRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState<number>(0);

  const contentElementRef = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState(0);

  const [paddingMax, setPaddingMax] = useState(0);
  const PADDING_MIN = 12;

  useEffect(() => {
    setPaddingMax(innerWidth > 688 ? 48 : 24);
    const newOffset =
      spacerElementRef.current?.getBoundingClientRect().top ?? 0;
    setTopOffset(newOffset < 0 ? 0 : newOffset);

    const calculatedPadding =
      Math.max(paddingMax - PADDING_MIN - scrollValue / 2, 0) + PADDING_MIN;
    setPadding(calculatedPadding);

    const newClientHeight = contentElementRef.current?.clientHeight ?? 0;
    setClientHeight(newClientHeight);
  }, [scrollValue, innerWidth]);

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
                onClick={() => router.push(ROUTES.PROFILE)}
              >
                <WalletIcon color="primary" />
                <Typography variant="label1">
                  <p>{formatAddress(address)}</p>
                </Typography>
              </IconButton>
            ) : (
              <IconButton
                className="button"
                size="large"
                onClick={() => adapter?.signIn(profile, updateProfile)}
                disabled={!canConnectWallet()}
              >
                <WalletIcon color="primary" />
                <Typography variant="label1">
                  <p>{scrollValue === 0 ? "Connect" : ""}</p>
                </Typography>
              </IconButton>
            )}
          </div>
        </div>
      </Header>
      <div
        ref={spacerElementRef}
        style={{ height: `${clientHeight + paddingMax * 2}px` }}
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
  background-color: rgba(var(--color-body-bg-rgb), 0.93);
  backdrop-filter: blur(var(--blur));

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

    p {
      cursor: pointer;
    }
  }

  &.scrolled {
    box-shadow: 0 1px 5px 0 rgba(var(--color-body-text-rgb), 0.25);
    transition: box-shadow 0.2s;

    .header-content {
      transition: padding 0.2s;
    }
  }
`;
