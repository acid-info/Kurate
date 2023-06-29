import { TokenData } from "@/interfaces/Token";
import { createContext, useContext, useState } from "react";

type TokenContext = {
  tokenData: TokenData;
  updateTokenData: (newTokenData: TokenData) => void;
};

const epochDuration = 8 * 60 * 60 * 1000;
const TokenContext = createContext<TokenContext>({
  tokenData: {
    go: 0,
    repTotal: 0,
    repStaked: 0,
    loading: false,
    epochDuration,
    timeToEpoch: epochDuration - (Date.now() % epochDuration),
  },
  updateTokenData: () => {},
});

export const TokenProvider = ({ children }: any) => {
  const [tokenData, setTokenData] = useState<TokenData>({
    go: 0,
    repTotal: 0,
    repStaked: 0,
    loading: false,
    epochDuration,
    timeToEpoch: epochDuration - (Date.now() % epochDuration),
  });

  const updateTokenData = (newTokenData: TokenData) => {
    setTokenData(newTokenData);
  };

  return (
    <TokenContext.Provider value={{ tokenData, updateTokenData }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;

export const useTokenContext = () => useContext<TokenContext>(TokenContext);
