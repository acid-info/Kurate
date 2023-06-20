import { useChatContext } from "@/context/ChatContext";
import { useHistoryContext } from "@/context/HistoryContext";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import { useTokenContext } from "@/context/TokenContext";
import { type Chat } from "@/interfaces/Chat";
import type { providers } from "ethers";

type WindowWithEthereum = Window &
  typeof globalThis & {
    ethereum: providers.ExternalProvider & {
      on: (name: string, handler: () => unknown) => void;
      removeListener: (name: string, handler: () => unknown) => void;
    };
  };

const windowWithEthereum = window && (window as WindowWithEthereum);

function onAccountChanged() {
  const { updateProfile } = useProfileContext();
  const { personaData, updatePersonaData } = usePersonaContext();
  const { tokenData, updateTokenData } = useTokenContext();
  const { updateChatData } = useChatContext();
  const { updateHistoryData } = useHistoryContext();

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

export function subscribeAccountChanged(): () => unknown {
  if (
    windowWithEthereum &&
    windowWithEthereum.ethereum &&
    typeof windowWithEthereum.ethereum.on === "function"
  ) {
    windowWithEthereum.ethereum.on("accountsChanged", onAccountChanged);
    return () => {
      windowWithEthereum &&
        windowWithEthereum.ethereum.removeListener(
          "accountsChanged",
          onAccountChanged
        );
    };
  }
  return () => console.error("No ethereum provider");
}

function onChainChanged() {
  window && window.location.reload();
}

export function subscribeChainChanged() {
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
