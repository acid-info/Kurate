import { ChatData, type Chat } from "@/interfaces/Chat";
import { PersonaData } from "@/interfaces/Persona";
import { Profile } from "@/interfaces/Profile";
import { TokenData } from "@/interfaces/Token";
import { HistoryData } from "@/interfaces/Transaction";
import type { providers } from "ethers";

type WindowWithEthereum = Window &
  typeof globalThis & {
    ethereum: providers.ExternalProvider & {
      on: (name: string, handler: () => unknown) => void;
      removeListener: (name: string, handler: () => unknown) => void;
    };
  };

type ContextProps = {
  personaData: PersonaData;
  tokenData: TokenData;
  updateProfile: (newProfile: Profile) => void;
  updatePersonaData: (newPersonaData: PersonaData) => void;
  updateTokenData: (newTokenData: TokenData) => void;
  updateChatData: (newChatData: ChatData) => void;
  updateHistoryData: (newHistoryData: HistoryData) => void;
};

function onAccountChanged({
  personaData,
  tokenData,
  updateProfile,
  updatePersonaData,
  updateTokenData,
  updateChatData,
  updateHistoryData,
}: ContextProps) {
  // Clear profile
  updateProfile({});

  // Clear personas
  updatePersonaData({ ...personaData, draft: [] });

  // Clear tokens
  updateTokenData({
    ...tokenData,
    go: 0,
    repStaked: 0,
    repTotal: 0,
    loading: true,
  });

  // Clear chats
  updateChatData({ chats: new Map<string, Chat>(), loading: true, unread: 0 });

  // Clear transactions
  updateHistoryData({ transactions: [] });
}

export function subscribeAccountChanged({
  personaData,
  tokenData,
  updateProfile,
  updatePersonaData,
  updateTokenData,
  updateChatData,
  updateHistoryData,
}: ContextProps): () => unknown {
  const windowWithEthereum = window && (window as WindowWithEthereum);

  if (
    windowWithEthereum &&
    windowWithEthereum.ethereum &&
    typeof windowWithEthereum.ethereum.on === "function"
  ) {
    windowWithEthereum.ethereum.on("accountsChanged", () =>
      onAccountChanged({
        personaData,
        tokenData,
        updateProfile,
        updatePersonaData,
        updateTokenData,
        updateChatData,
        updateHistoryData,
      })
    );
    return () => {
      windowWithEthereum &&
        windowWithEthereum.ethereum.removeListener("accountsChanged", () =>
          onAccountChanged({
            personaData,
            tokenData,
            updateProfile,
            updatePersonaData,
            updateTokenData,
            updateChatData,
            updateHistoryData,
          })
        );
    };
  }
  return () => console.error("No ethereum provider");
}

function onChainChanged() {
  window && window.location.reload();
}

export function subscribeChainChanged() {
  const windowWithEthereum = window && (window as WindowWithEthereum);

  if (
    windowWithEthereum &&
    windowWithEthereum.ethereum &&
    typeof windowWithEthereum.ethereum.on === "function"
  ) {
    windowWithEthereum.ethereum.on("chainChanged", onChainChanged);

    return () => {
      windowWithEthereum &&
        windowWithEthereum &&
        windowWithEthereum.ethereum.removeListener(
          "chainChanged",
          onChainChanged
        );
    };
  }
  return () => console.error("No ethereum provider");
}
