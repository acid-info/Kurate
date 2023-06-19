import { HistoryData } from "@/interfaces/Transaction";
import { createContext, useContext, useState } from "react";

type HistoryContext = {
  historyData: HistoryData;
  updateHistoryData: (newHistoryData: HistoryData) => void;
};

const HistoryContext = createContext<HistoryContext>({
  historyData: { transactions: [] },
  updateHistoryData: () => {},
});

export const HistoryProvider = ({ children }: any) => {
  const [historyData, setHistoryData] = useState<HistoryData>({
    transactions: [],
  });

  const updateHistoryData = (newHistoryData: HistoryData) => {
    setHistoryData(newHistoryData);
  };

  return (
    <HistoryContext.Provider value={{ historyData, updateHistoryData }}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryContext;

export const useHistoryContext = () =>
  useContext<HistoryContext>(HistoryContext);
