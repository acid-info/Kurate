import { ReactNode } from "react";
import HomeLayout from "@/layouts/HomeLayout/HomeLayout";
import { usePersonaContext } from "@/context/PersonaContext";
import Loading from "../Loading/Loading";
import DraftPersonas from "../Persona/DraftPersonas/DraftPersonas";
import Favorites from "../Persona/Favorites/Favorites";
import AllPersonas from "../Persona/AllPersonas/AllPersonas";

const Home = () => {
  const { personaData } = usePersonaContext();

  return (
    <>
      {personaData.loading ? (
        <Loading fullPage>
          {{
            title: "Loading Kurate homepage",
          }}
        </Loading>
      ) : (
        <>
          <DraftPersonas />
          <Favorites />
          <AllPersonas />
        </>
      )}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactNode) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
