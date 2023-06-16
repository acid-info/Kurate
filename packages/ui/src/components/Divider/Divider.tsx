import styled from "@emotion/styled";

type DividerProps = {
  visible?: "always" | "desktop" | "mobile";
};

export default function Divider({ visible = "always" }: DividerProps) {
  return <HR className={visible} />;
}

const HR = styled.hr`
  hr {
    border: none;
    width: 100%;
    height: 1px;
    background-color: var(--grey-200);

    &.desktop {
      @media (max-width: 687.98px) {
        display: none;
      }
    }
    &.mobile {
      @media (min-width: 688px) {
        display: none;
      }
    }
  }
`;
