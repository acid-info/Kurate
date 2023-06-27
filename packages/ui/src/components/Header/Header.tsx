import useWindow from "@/hooks/useWindow";
import { CloseIcon, IconButton, Typography } from "@acid-info/lsd-react";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { UndoIcon } from "../Icons/UndoIcon";

type HeaderProps = {
  title?: string;
  onlyScrolled?: boolean;
  onBack?: () => unknown;
  onClose?: () => unknown;
};

export default function Header({
  onBack,
  onClose,
  title = "",
  onlyScrolled = false,
}: HeaderProps) {
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
      <HeaderWrapper
        className={`${onlyScrolled ? "initially-hidden" : ""} ${
          scrollValue > 0 ? "scrolled" : ""
        }`}
        style={{ marginTop: `${topOffset}px`, padding: `${padding}px` }}
      >
        <div className="content" ref={contentElementRef}>
          {typeof onBack === "function" && (
            <div>
              <IconButton className="button" size="large" onClick={onBack}>
                <UndoIcon color="primary" />
              </IconButton>
            </div>
          )}

          <Typography variant="h1">{title}</Typography>

          {typeof onClose === "function" && (
            <div>
              <IconButton className="button" size="large" onClick={onClose}>
                <CloseIcon color="primary" />
              </IconButton>
            </div>
          )}
        </div>
      </HeaderWrapper>
      {!onlyScrolled && (
        <div
          ref={spacerElementRef}
          style={{ height: `${clientHeight + paddingMax * 2}px` }}
        />
      )}
    </>
  );
}

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  inset: 0 0 auto;
  background-color: rgba(var(--color-body-bg-rgb), 0.93);
  backdrop-filter: blur(var(--blur));
  z-index: 100;
  padding-inline: var(--spacing-24);
  padding-block: var(--spacing-24);
  transition: box-shadow 0.2s, padding 0.2s;

  @media (min-width: 688px) {
    padding-block: var(--spacing-48);
    padding-inline: var(--spacing-48);
    transition: padding 0.2s;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-12);

    > * {
      flex-basis: 65%;
      &.title:not(:empty) {
        flex-basis: 100%;
        text-align: center;
      }
      &:last-child {
        display: flex;
        justify-content: flex-end;
      }
    }

    .btns:not(:empty) {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: row;
      gap: var(--spacing-12);
    }
  }

  // Hide header when not scrolled
  &.initially-hidden {
    display: none;
  }

  &.scrolled {
    transition: box-shadow 0.2s, padding 0.2s;
    box-shadow: 0 1px 5px 0 rgba(var(--color-body-text-rgb), 0.25);
    display: initial;
  }
`;
