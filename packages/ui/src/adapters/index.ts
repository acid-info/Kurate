import type { Signer } from "ethers";
import { ZkitterAdapter } from "./zkitter";
import { Firebase } from "./firebase";
import { ADAPTER } from "@/constants";
import { getFromLocalStorage } from "@/utils";
import { ZkitterAdapterGodMode } from "./zkitter-god-mode";
import { DraftPersona, Persona, PersonaData } from "@/interfaces/Persona";
import { ChatData, DraftChat } from "@/interfaces/Chat";
import { Profile } from "@/interfaces/Profile";
import { TokenData } from "@/interfaces/Token";
import { HistoryData } from "@/interfaces/Transaction";

export type StartProps = {
  personaData: PersonaData;
  profile: Profile;
  tokenData: TokenData;
  chatData: ChatData;
  updatePersonaData: (newPersonaData: PersonaData) => void;
  updateTokenData: (newTokenData: TokenData) => void;
  updateHistoryData: (newHistoryData: HistoryData) => void;
  updateChatData: (newChatData: ChatData) => void;
};

export interface Adapter {
  // This is run when the app is mounted and should start app wide subscriptions
  start?: (data: StartProps) => Promise<void> | void;
  // This is run when the app unmounts and should clear subscriptions
  stop?: () => Promise<void> | void;

  // Sign's in user (asks to login with wallet)
  signIn: (
    profile: Profile,
    updateProfile: (newProfile: Profile) => void
  ) => Promise<void>;

  addPersonaToFavorite: (groupId: string, persona?: Persona) => Promise<void>;
  removePersonaFromFavorite: (
    groupId: string,
    persona?: Persona
  ) => Promise<void>;
  addPersonaDraft: (draftPersona: DraftPersona) => Promise<number>;
  updatePersonaDraft: (
    index: number,
    draftPersona: DraftPersona
  ) => Promise<void>;
  deleteDraftPersona: (index: number) => Promise<void>;
  publishPersona(draftPersona: DraftPersona, signer: Signer): Promise<string>;

  uploadPicture(picture: string): Promise<string>;
  getPicture(cid: string): string;

  publishPost(
    groupId: string,
    text: string,
    images: string[],
    signer: Signer
  ): Promise<string>;
  subscribePersonaPosts(groupId: string): Promise<() => unknown>;
  voteOnPost(
    groupId: string,
    postId: string,
    vote: "+" | "-",
    signer: Signer
  ): Promise<void>;

  startChat(chat: DraftChat): Promise<string>;
  sendChatMessage(chatId: string, text: string): Promise<void>;
  subscribeToChat?: (chatId: string) => Promise<() => void>;
}

export const adapters = ["zkitter", "firebase", "zkitter-god-mode"] as const;
export type AdapterName = (typeof adapters)[number];

export const initAdapter = () => {
  const adapterName: AdapterName = getFromLocalStorage<AdapterName>(
    "adapter",
    ADAPTER as AdapterName
  );

  switch (adapterName) {
    /* case "zkitter":
      return { adapter: new ZkitterAdapter(), adapterName };*/
    case "firebase":
      return { adapter: new Firebase(), adapterName };
    /*case "zkitter-god-mode":
      return { adapter: new ZkitterAdapterGodMode(), adapterName };*/
    default:
      throw new Error(`Invalid adapter ${ADAPTER}`);
  }
};
