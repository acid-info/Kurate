import Divider from "@/components/Divider/Divider";
import HeaderTop from "@/components/HeaderTop/HeaderTop";
import { useChatContext } from "@/context/ChatContext";
import { useProfileContext } from "@/context/ProfileContext";
import { TabItem, Tabs } from "@acid-info/lsd-react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function HomeLayout({ children }: LayoutProps) {
  const router = useRouter();
  const showChat: boolean = router.pathname.includes("/chat");
  const { profile } = useProfileContext();
  const { chatData } = useChatContext();

  return (
    <div>
      <HeaderTop address={profile.address} />
      <div>
        {profile.signer && (
          <NavWrapper>
            <Tabs activeTab={"Personas"} size="large">
              <TabItem
                name="Personas"
                inactive={showChat}
                onClick={() => router.push("/")}
              >
                Personas
              </TabItem>

              <TabItem
                name="Chats"
                inactive={!showChat}
                onClick={() => router.push("/chat")}
              >
                Chats
                {chatData.unread > 0 && <p>{chatData.unread}</p>}
              </TabItem>
            </Tabs>
          </NavWrapper>
        )}

        <Divider visible="mobile" />

        <slot />

        <main>{children}</main>
      </div>
    </div>
  );
}

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 var(--spacing-24) var(--spacing-24);

  @media (min-width: 688px) {
    padding: 0 var(--spacing-48) var(--spacing-48);
  }
`;
