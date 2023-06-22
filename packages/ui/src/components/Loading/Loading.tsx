import useWindow from "@/hooks/useWindow";
import styled from "@emotion/styled";
import React from "react";
import Header from "../Header/Header";

type LoadingProps = {
  title?: string;
  fullPage?: boolean;
  onBack?: () => unknown;
  onClose?: () => unknown;
  children: any;
};

export default function Loading({
  title,
  fullPage,
  onBack,
  onClose,
  children,
}: LoadingProps) {
  const { scrollValue } = useWindow();

  const Title = ({ children }: any) => <div className="title">{children}</div>;
  const Description = ({ children }: any) => (
    <div className="description">{children}</div>
  );
  const ButtonGroup = ({ children }: any) => (
    <div className="btns">{children}</div>
  );

  return (
    <LoadingScreen
      className={`${scrollValue > 0 ? "scrolled" : ""} ${
        fullPage ? "full-page" : ""
      }`}
    >
      {title && <Header title={title} onBack={onBack} onClose={onClose} />}

      <div className="loading">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
      </div>

      <Title>{children.title}</Title>
      <Description>{children.description}</Description>
      <ButtonGroup>{children.buttons}</ButtonGroup>
    </LoadingScreen>
  );
}

const LoadingScreen = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  gap: var(--spacing-6);
  max-width: 498px;
  margin-inline: auto;
  padding: var(--spacing-24);
  text-align: center;

  &.full-page {
    min-height: calc(100dvh - 100px);
    min-height: calc(100vh - 100px);

    @media (min-width: 688px) {
      min-height: calc(100vh - 148px);
    }
    &.scrolled {
      min-height: calc(100vh - 68px);
    }
  }

  .loading {
    display: flex;
    gap: var(--spacing-6);
    justify-content: center;
    align-items: center;
    height: 32px;
    margin-bottom: var(--spacing-12);

    @keyframes loading-circle {
      0% {
        width: var(--spacing-6);
        height: var(--spacing-6);
        background-color: rgb(var(--lsd-icon-primary));
      }
      50% {
        width: var(--spacing-3);
        height: var(--spacing-3);
        background-color: transparent;
      }
      100% {
        width: var(--spacing-6);
        height: var(--spacing-6);
        background-color: rgb(var(--lsd-icon-primary));
      }
    }

    .circle {
      position: relative;
      width: var(--spacing-6);

      &::before {
        position: absolute;
        inset: 50%;
        transform: translate(-50%, -50%);
        content: "";
        border-radius: 50%;
        animation-duration: 2.1s;
        animation-name: loading-circle;
        animation-iteration-count: infinite;
      }

      &:nth-of-type(2)::before {
        animation-delay: 0.7s;
      }

      &:nth-of-type(3)::before {
        animation-delay: 1.4s;
      }
    }
  }

  .title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-sb);
  }

  .btns {
    margin-top: var(--spacing-48);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-12);
  }

  :global(.small) {
    font-size: var(--font-size-sm);
  }
`;
