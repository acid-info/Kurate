import { NextPage } from "next";
import HomeLayout from "@/layouts/HomeLayout/HomeLayout";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import Loading from "../Loading/Loading";

const Home: NextPage = () => {
  const { profile } = useProfileContext();
  const { personaData } = usePersonaContext();

  const renderDraftPersonas = () => {
    if (personaData.draft.length !== 0 && profile.signer) {
      return <div>DRAFT PERSONAS</div>;
    }
    return null;
  };

  const renderFavorites = () => {
    if (personaData.favorite.length !== 0 && profile.signer) {
      return <div>FAVORITES</div>;
    }
  };

  return (
    <HomeLayout>
      {personaData.loading ? (
        <Loading fullPage>
          {{
            title: <p>Loading Kurate homepage</p>,
          }}
        </Loading>
      ) : (
        (renderDraftPersonas(), renderFavorites())
      )}
    </HomeLayout>
  );
};
export default Home;
