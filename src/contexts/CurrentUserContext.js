import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useNavigate } from 'react-router-dom';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';


export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    console.log("Current User:", currentUser);
    console.log("Profile ID in Current User:", currentUser?.profile_id);
    const navigate = useNavigate();

    /*
  Make API request to get current user data
  */ 
    const handleMount = async () => {
        if (localStorage.getItem('authToken')) {
            axios.defaults.headers.common['Authorization'] = 
                `Token ${localStorage.getItem('authToken')}`;
            try {
                const { data } = await axiosRes.get("/dj-rest-auth/user/")
                console.log("User API Response:", data);
                console.log("Before setCurrentUser:", currentUser);
                setCurrentUser({
                    ...data,
                    profile_id: data.profile_id || data.pk,
                  });
                console.log("After setCurrentUser:", data);  
            } catch (error) {
                // console.log(error)
            } 
        }
    };

    useEffect(() => {
        handleMount()
    }, []);

    useEffect(() => {
        console.log("CurrentUser state changed:", currentUser);
    }, [currentUser]);
      

    /* 
    Handles access tokens
    Redirects user to login page if refreshing of token fails
  */
    useMemo(() => {
        axiosReq.interceptors.request.use(
            async (config) => {
              if (shouldRefreshToken()) {
                console.log("Attempting to refresh token...");
                try {
                  const response = await axios.post("/dj-rest-auth/token/refresh/");
                  console.log("Token refreshed:", response.data);
                } catch (err) {
                  console.error("Token refresh failed", err);
                  setCurrentUser(null);
                  navigate("/login");
                }
              }
              return config;
            },
            (err) => Promise.reject(err)
          );


        axiosRes.interceptors.response.use(
            (response) => response,
            async (err) => {
                if (err.response?.status === 401){
                    try {
                        await axios.post("/dj-rest-auth/token/refresh/")
                    } catch (error) {
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                navigate("/login");
                            }
                            return null;
                        });
                        removeTokenTimestamp()
                    }
                    return axios(err.config);
                }
                return Promise.reject(err);
            }
        )
    }, [navigate])

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};