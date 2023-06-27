import { Grid } from "@/components/Grid/Grid";
import SectionTitle from "@/components/Section/SectionTitle";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import { ROUTES } from "@/routes";
import { AddIcon, IconButton, Typography } from "@acid-info/lsd-react";
import { useRouter } from "next/router";
import Persona from "../Persona";

export default function DraftPersonas() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const { personaData } = usePersonaContext();

  return personaData.draft.length !== 0 && profile.signer ? (
    <>
      <SectionTitle>
        {{
          title: "Draft Personas",
          buttons: (
            <IconButton
              size="large"
              onClick={() => router.push(ROUTES.PERSONA_NEW)}
            >
              <AddIcon color="primary" />
              <Typography variant="label1">Create persona</Typography>
            </IconButton>
          ),
        }}
      </SectionTitle>
      <Grid>
        {personaData.draft.map((dp, index) => (
          <Persona
            name={dp.name}
            pitch={dp.pitch}
            postsCount={dp.posts.length}
            participantsCount={1}
            picture={dp.picture}
            minReputation={dp.minReputation}
            onClick={() => router.push(ROUTES.PERSONA_DRAFT(index))}
          />
        ))}
      </Grid>
    </>
  ) : null;
}
