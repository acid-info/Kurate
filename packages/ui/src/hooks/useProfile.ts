import { useState } from "react";
import { Profile } from "@/interfaces/Profile";

export default function useProfile() {
  const [profile, setProfile] = useState<Profile>({});
  return { profile, setProfile };
}
