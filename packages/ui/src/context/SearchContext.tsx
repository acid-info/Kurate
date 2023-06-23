import { createContext, useContext, useState } from "react";

type SearchContext = {
  query: string;
  updateQuery: (newQuery: string) => void;
};

const SearchContext = createContext<SearchContext>({
  query: "",
  updateQuery: () => {},
});

export const SearchProvider = ({ children }: any) => {
  const [query, setQuery] = useState<string>("");

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <SearchContext.Provider value={{ query, updateQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;

export const useSearchContext = () => useContext<SearchContext>(SearchContext);
