import { Chat, ChatData } from "@/interfaces/Chat";
import { createContext, useContext, useState } from "react";

type ChatContext = {
  chatData: ChatData;
  updateChatData: (newChatData: ChatData) => void;
};

const ChatContext = createContext<ChatContext>({
  chatData: { loading: true, unread: 0, chats: new Map<string, Chat>() },
  updateChatData: () => {},
});

export const ChatProvider = ({ children }: any) => {
  const [chatData, setChatData] = useState<ChatData>({
    loading: true,
    unread: 0,
    chats: new Map<string, Chat>(),
  });

  const updateChatData = (newChatData: ChatData) => {
    setChatData(newChatData);
  };

  return (
    <ChatContext.Provider value={{ chatData, updateChatData }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

export const useChatContext = () => useContext<ChatContext>(ChatContext);
