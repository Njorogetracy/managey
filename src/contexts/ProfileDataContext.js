import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        pageProfile: { results: [] },
        listProfiles: { results: [] },
    });

    const currentUser = useCurrentUser();

    /*
    Makes API request to the /profiles/ endpoint
    gets profile information
    updates profile page and lists profiles data
  */
    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(
                    "/profiles/?ordering=tasks_count"
                );
                setProfileData((prevState) => ({
                    ...prevState,
                    listProfiles: data,
                }));
            } catch (error) {
                console.log(error);
            }
        };

        handleMount();
    }, [currentUser]);


    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={setProfileData}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
}