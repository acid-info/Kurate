import { PersonaData } from "@/interfaces/Persona";
import { createContext, useContext, useState } from "react";

type PersonaContext = {
  personaData: PersonaData;
  updatePersonaData: (newPersonaData: PersonaData) => void;
};

const PersonaContext = createContext<PersonaContext>({
  personaData: { all: new Map(), draft: [], favorite: [], loading: true },
  updatePersonaData: () => {},
});

export const PersonaProvider = ({ children }: any) => {
  const [personaData, setPersonaData] = useState<PersonaData>({
    draft: [],
    favorite: [],
    all: new Map(),
    loading: true,
  });

  const updatePersonaData = (newPersonaData: PersonaData) => {
    setPersonaData(newPersonaData);
  };

  return (
    <PersonaContext.Provider value={{ personaData, updatePersonaData }}>
      {children}
    </PersonaContext.Provider>
  );
};

export default PersonaContext;

export const usePersonaContext = () =>
  useContext<PersonaContext>(PersonaContext);
