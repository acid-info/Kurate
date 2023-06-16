import { useState } from "react";

export default function useIsDarkState() {
  const [isDarkState, setIsDarkState] = useState<boolean>(false);
  return { isDarkState, setIsDarkState };
}
