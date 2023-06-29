import { Identity } from "@semaphore-protocol/identity";
import { DraftPost } from "./Post";
import { ReputationOptions } from "@/types";

export interface Persona {
  personaId: string;
  identity?: Identity;
  picture: string;
  cover: string;
  name: string;
  pitch: string;
  description: string;
  participantsCount: number;
  postsCount: number;
  minReputation: ReputationOptions;
  timestamp: number;
}

export interface DraftPersona
  extends Omit<Persona, "postsCount" | "participantsCount" | "personaId"> {
  posts: DraftPost[];
}

export interface PersonaData {
  draft: DraftPersona[];
  favorite: string[];
  all: Map<string, Persona>;
  loading: boolean;
  error?: Error;
}
