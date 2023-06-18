import { Persona } from "./Persona";
import { Post } from "./Post";

export interface Message {
  timestamp: number;
  text: string;
  address?: string;
  messageId?: string;
}

export interface DraftChat {
  persona: Persona;
  post: Post;
  messages: Message[];
  closed?: boolean;
}

export interface Chat extends DraftChat {
  users: string[];
  chatId: string;
}

export interface ChatData {
  loading: boolean;
  unread: number;
  chats: Map<string, Chat>;
  error?: Error;
}
