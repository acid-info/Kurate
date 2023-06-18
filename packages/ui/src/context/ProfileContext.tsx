import { Profile } from "@/interfaces/Profile";
import { createContext, useContext, useState } from "react";

type ProfileContext = {
  profile: Profile;
  updateProfile: (newProfile: Profile) => void;
};

const ProfileContext = createContext<ProfileContext>({
  profile: {},
  updateProfile: () => {},
});

export const ProfileProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<Profile>({});

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;

export const useProfileContext = () =>
  useContext<ProfileContext>(ProfileContext);
