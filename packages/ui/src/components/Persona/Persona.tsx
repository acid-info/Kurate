import useAdapter from "@/hooks/useAdapter";
import { ReputationOptions } from "@/types";
import { Card, CardBody, CardHeader } from "@acid-info/lsd-react";
import styled from "@emotion/styled";
import { UserMultipleIcon } from "../Icons/UserMultipleIcon";
import { ForumIcon } from "../Icons/ForumIcon";

type PersonaProps = {
  name?: string;
  pitch?: string;
  postsCount: number;
  participantsCount: number;
  picture?: string;
  minReputation: ReputationOptions;
  onClick: () => void;
};

export default function Persona({
  name,
  pitch,
  postsCount,
  participantsCount,
  picture,
  minReputation,
  onClick,
}: PersonaProps) {
  const { adapter } = useAdapter();

  return (
    <Wrapper>
      <Card onClick={onClick} size="large">
        <CardHeader>
          <Picture>
            <img
              src={picture ? adapter?.getPicture(picture) : undefined}
              alt="persona"
            />
          </Picture>
        </CardHeader>
        <CardBody>
          <Details>
            <div className="header">{name}</div>
            <div className="description">{pitch}</div>
            <div className="post-count">
              <div className="rep">REP {minReputation}+</div>
              <div>
                <UserMultipleIcon />
                {participantsCount}
              </div>
              <div>
                <ForumIcon />
                {postsCount}
              </div>
            </div>
          </Details>
        </CardBody>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .lsd-card {
    padding: var(--spacing-24);
    cursor: pointer;

    &:hover {
      background-color: var(--grey-150);
    }
  }
`;

const Picture = styled.div`
  flex: 0 0 100px;
  aspect-ratio: 1;

  @media (min-width: 398px) {
    flex-basis: 99px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  min-height: 92px;

  @media (min-width: 398px) {
    min-height: 99px;
  }

  .description {
    flex-grow: 1;
  }

  .post-count {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-12);

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
      gap: var(--spacing-3);
    }

    .rep {
      background-color: var(--grey-200);
      border-radius: 9px;
      padding-left: var(--spacing-6);
      padding-right: var(--spacing-4);
      padding-top: 1px;
    }
  }
`;
