import { Adapter, AdapterName, initAdapter } from "@/adapters";
import { useEffect, useState } from "react";

export default function useAdapter() {
  const [adapter, setAdapter] = useState<Adapter>();
  const [adapterName, setAdapterName] = useState<AdapterName>();

  useEffect(() => {
    const { adapter, adapterName } = initAdapter();
    setAdapter(adapter);
    setAdapterName(adapterName);
  }, []);

  return { adapter, adapterName };
}
