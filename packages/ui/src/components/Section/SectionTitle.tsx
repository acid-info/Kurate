import styled from "@emotion/styled";
import Divider from "../Divider/Divider";

type SectionTitleProps = {
  children: any;
  noDivider?: boolean;
  noPad?: boolean;
};

export default function SectionTitle({
  children,
  noDivider,
  noPad,
}: SectionTitleProps) {
  const Title = ({ children }: any) => <div className="title">{children}</div>;
  const Buttons = ({ children }: any) => (
    <div className="buttons">{children}</div>
  );
  const Searchbar = ({ children }: any) => <div>{children}</div>;

  return (
    <div>
      {!noDivider && <Divider visible="desktop" />}
      <Wrapper className={`${noPad ? "" : "pad"}`}>
        <div className="row">
          <Title>{children.title}</Title>
          <Buttons>{children.buttons}</Buttons>
        </div>

        <Searchbar>{children.searchbar}</Searchbar>
      </Wrapper>

      <Divider visible="mobile" />
    </div>
  );
}

const Wrapper = styled.div`
  padding-block: var(--spacing-24);
  transition: padding 0.2s;
  max-width: 498px;
  margin-inline: auto;

  &.pad {
    padding-inline: var(--spacing-24);
  }

  @media (min-width: 688px) {
    max-width: 996px;
    padding-bottom: var(--spacing-12);

    &.pad {
      padding-inline: var(--spacing-48);
    }
  }

  @media (min-width: 1242px) {
    max-width: 1494px;
  }

  @media (min-width: 1640px) {
    max-width: 1992px;
  }

  @media (min-width: 2038px) {
    max-width: 2490px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-12);
    gap: var(--spacing-12);

    .title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-sb);
      transition: padding 0.2s;
      max-width: 498px;
      border-bottom: none;
    }

    @media (min-width: 688px) {
      margin-bottom: var(--spacing-24);
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: var(--spacing-12);
    }
  }
`;
