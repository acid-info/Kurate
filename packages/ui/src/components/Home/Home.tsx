import styled from "@emotion/styled";
import { NextPage } from "next";
import { useRouter } from "next/router";
import HeaderTop from "../HeaderTop/Header.Top";
import Divider from "../Divider/Divider";
import { useProfileContext } from "@/context/ProfileContext";

const Home: NextPage = () => {
  const router = useRouter();
  const showChat: boolean = router.pathname.includes("/chat");
  const { profile, updateProfile } = useProfileContext();

  return (
    <div>
      <HeaderTop address={profile.address} />
      <div>
        {profile.signer && (
          <NavWrapper>
            <Nav className={showChat ? "chats" : ""}>
              <div
                className={showChat ? "" : "active"}
                onClick={() => router.push("/")}
              >
                Personas
              </div>
              <div
                className={showChat ? "active" : ""}
                onClick={() => router.push("/chat")}
              >
                Chats
                {/*#if $chats.unread > 0*/}
                <div className="unread">{/*$chats.unread*/}chats</div>
                {/*if*/}
              </div>
            </Nav>
          </NavWrapper>
        )}

        <Divider visible="mobile" />

        <slot />
      </div>
    </div>
  );
};

const NavWrapper = styled.div`
  padding: 0 var(--spacing-24) var(--spacing-24);

  @media (min-width: 688px) {
    padding: 0 var(--spacing-48) var(--spacing-48);
  }
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 450px;
  height: 50px;
  margin: auto;
  border-radius: 25px;
  display: flex;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0 50% 0 0;
    padding: 10px;
    border-radius: 25px;
    z-index: 0;
    transition: inset 0.3s;
  }

  &.chats::before {
    inset: 0 0 0 50%;
    transition: inset 0.3s;
  }

  div {
    padding: 10px;
    width: 50%;
    border-radius: 25px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }

  .unread {
    width: fit-content;
    height: 20px;
    padding: 0 7px;
    margin-left: var(--spacing-6);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-sb);
    line-height: 20px;
  }
`;

export default Home;
