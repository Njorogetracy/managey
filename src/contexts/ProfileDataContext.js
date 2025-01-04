import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";
import { toast } from "react-toastify";

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
          if (currentUser) {
            try {
              const { data } = await axiosReq.get("/profiles/?ordering=tasks_count");
              console.log("Profiles fetched:", data.results);
              setProfileData((prevState) => ({
                ...prevState,
                listProfiles: data,
              }));
            } catch (error) {
              if (error.response?.status === 403) {
                console.warn("403 Forbidden: You may not be authorized to access profiles.");
                toast.error("You are not authorized to access this resource.");
              } else {
                console.error("Error fetching profile data", error);
              }
            }
          }
        };
      
        handleMount();
      }, [currentUser]);
      
      
    // useEffect(() => {
    //     const handleMount = async () => {
    //         try {
    //             const { data } = await axiosReq.get(
    //                 "/profiles/?ordering=tasks_count"
    //             );
    //             setProfileData((prevState) => ({
    //                 ...prevState,
    //                 listProfiles: data,
    //             }));
    //         } catch (error) {
    //             // console.log(error);
    //         }
    //     };

    //     handleMount();
    // }, [currentUser]);


    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={setProfileData}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
}