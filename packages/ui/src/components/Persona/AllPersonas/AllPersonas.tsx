import { Grid } from "@/components/Grid/Grid";
import { SortAscendingIcon } from "@/components/Icons/SortAscendingIcon";
import { SortDescendingIcon } from "@/components/Icons/SortDescendingIcon";
import SectionTitle from "@/components/Section/SectionTitle";
import { usePersonaContext } from "@/context/PersonaContext";
import { useProfileContext } from "@/context/ProfileContext";
import { ROUTES } from "@/routes";
import { SortBy } from "@/types";
import {
  AddIcon,
  Dropdown,
  IconButton,
  Typography,
} from "@acid-info/lsd-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Persona from "../Persona";
import styled from "@emotion/styled";
import Searchbar from "@/components/Searchbar/Searchbar";
import { useSearchContext } from "@/context/SearchContext";

interface SortByOption {
  value: SortBy;
  name: string;
}

export default function AllPersonas() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const { personaData } = usePersonaContext();
  const { query } = useSearchContext();

  const sortByOptions: SortByOption[] = [
    { value: "date", name: "Sort by date of creation" },
    { value: "participantsCount", name: "Sort by number of participants" },
    { value: "postsCount", name: "Sort by number of posts" },
    { value: "alphabetical", name: "Sort by name (alphabetical)" },
    { value: "rep", name: "Sort by reputation" },
  ];

  const [sortBy, setSortBy] = useState<string>("date");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredSortedPersonas = useMemo(() => {
    const filteredPersonas = [...personaData.all].filter(([, persona]) =>
      persona.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredPersonas.sort(([, a], [, b]) => {
      switch (sortBy) {
        case "date":
          return sortAsc
            ? a.timestamp - b.timestamp
            : b.timestamp - a.timestamp;
        case "participantsCount":
          return sortAsc
            ? a.participantsCount - b.participantsCount
            : b.participantsCount - a.participantsCount;
        case "postsCount":
          return sortAsc
            ? a.postsCount - b.postsCount
            : b.postsCount - a.postsCount;
        case "alphabetical":
          return sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "rep":
          return sortAsc
            ? a.minReputation - b.minReputation
            : b.minReputation - a.minReputation;
        default:
          return 0;
      }
    });
  }, [personaData.all, query, sortBy, sortAsc]);

  return (
    <Wrapper>
      <SectionTitle>
        {{
          title: "All Personas",
          buttons: (
            <>
              {profile.signer && (
                <IconButton
                  className="button"
                  size="large"
                  onClick={() => router.push(ROUTES.PERSONA_NEW)}
                >
                  <AddIcon color="primary" />
                  <Typography variant="label1">Create persona</Typography>
                </IconButton>
              )}

              <Dropdown
                options={sortByOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value.toString())}
              />

              <IconButton size="large" onClick={() => setSortAsc(!sortAsc)}>
                {sortAsc ? <SortAscendingIcon /> : <SortDescendingIcon />}
              </IconButton>
            </>
          ),
          searchbar: <Searchbar />,
        }}
      </SectionTitle>

      <Grid>
        {filteredSortedPersonas.length > 0 ? (
          filteredSortedPersonas.map(([groupId, data]) => (
            <Persona
              key={groupId}
              name={data.name}
              pitch={data.pitch}
              postsCount={data.postsCount}
              participantsCount={data.participantsCount}
              picture={data.picture}
              minReputation={data.minReputation}
              onClick={() => router.push(ROUTES.PERSONA(groupId))}
            />
          ))
        ) : (
          <Typography variant="body1">There are no personas yet</Typography>
        )}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .button {
    width: unset;
    padding: 6px;

    label {
      cursor: pointer;
    }
  }
`;
