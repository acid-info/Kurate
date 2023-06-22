import { NextPage } from "next";
import HomeLayout from "@/layouts/HomeLayout/HomeLayout";
import { usePersonaContext } from "@/context/PersonaContext";
import Loading from "../Loading/Loading";
import DraftPersonas from "../Persona/DraftPersonas/DraftPersonas";
import Favorites from "../Persona/Favorites/Favorites";
import AllPersonas from "../Persona/AllPersonas/AllPersonas";

const Home: NextPage = () => {
  const { personaData } = usePersonaContext();

  return (
    <HomeLayout>
      {personaData.loading ? (
        <Loading fullPage>
          {{
            title: <p>Loading Kurate homepage</p>,
          }}
        </Loading>
      ) : (
        <>
          <DraftPersonas />
          <Favorites />
          <AllPersonas />
        </>
      )}
    </HomeLayout>
  );
};
export default Home;
