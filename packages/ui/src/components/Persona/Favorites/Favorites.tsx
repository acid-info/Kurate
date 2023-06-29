import { Grid } from "@/components/Grid/Grid";
import SectionTitle from "@/components/Section/SectionTitle";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";
import Persona from "../Persona";

export default function Favorites() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const { personaData } = usePersonaContext();

  return personaData.favorite.length !== 0 && profile.signer ? (
    <>
      <SectionTitle>
        {{
          title: "Favorites",
        }}
      </SectionTitle>
      <Grid>
        {personaData.favorite.map((personaId) => {
          const persona = personaData.all.get(personaId);
          if (persona) {
            return (
              <Persona
                key={personaId}
                name={persona.name}
                pitch={persona.pitch}
                postsCount={persona.postsCount}
                participantsCount={persona.participantsCount}
                picture={persona.picture}
                minReputation={persona.minReputation}
                onClick={() => router.push(ROUTES.PERSONA(personaId))}
              />
            );
          }
          return null;
        })}
      </Grid>
    </>
  ) : null;
}
