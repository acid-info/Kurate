import { Adapter, AdapterName, initAdapter } from "@/adapters";
import { useChatContext } from "@/context/ChatContext";
import { useHistoryContext } from "@/context/HistoryContext";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import { useTokenContext } from "@/context/TokenContext";
import { useEffect, useState } from "react";

export default function useAdapter() {
  const [adapter, setAdapter] = useState<Adapter>();
  const [adapterName, setAdapterName] = useState<AdapterName>();

  const { personaData, updatePersonaData } = usePersonaContext();
  const { profile } = useProfileContext();
  const { tokenData, updateTokenData } = useTokenContext();
  const { updateHistoryData } = useHistoryContext();
  const { chatData, updateChatData } = useChatContext();

  useEffect(() => {
    //Init the correct adapter based on env
    const { adapter, adapterName } = initAdapter();

    //Start the adapter
    adapter.start({
      personaData,
      profile,
      tokenData,
      chatData,
      updatePersonaData,
      updateTokenData,
      updateHistoryData,
      updateChatData,
    });

    setAdapter(adapter);
    setAdapterName(adapterName);
  }, []);

  return { adapter, adapterName };
}
