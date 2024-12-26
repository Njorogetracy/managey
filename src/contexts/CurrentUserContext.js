import { useNavigate } from 'react-router-dom';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';
import { useState, useMemo } from 'react';

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);


export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get('dj-rest-auth/user/');
      setCurrentUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          // If there's no access token, attempt to refresh it
          await refreshToken();
        }
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
      },
      (err) => Promise.reject(err)
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401 && shouldRefreshToken()) {
          try {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
              // Retry the failed request with new token
              err.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axios(err.config);
            }
          } catch (error) {
            // If refreshing token fails, redirect to login
            setCurrentUser(null);
            removeTokenTimestamp();
            navigate('/login');
          }
        }
        return Promise.reject(err);
      }
    );
  }, [navigate]);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await axios.post(
        'https://manageydrf-8a469d59154b.herokuapp.com/dj-rest-auth/token/refresh/',
        { refresh: refreshToken },
        { withCredentials: true }
      );
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return access_token;
    } catch (error) {
      console.log('Failed to refresh token', error);
      return null;
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { axiosReq, axiosRes } from '../api/axiosDefaults';
// import { useNavigate } from 'react-router-dom';
// import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';


// export const CurrentUserContext = createContext();
// export const SetCurrentUserContext = createContext();

// export const useCurrentUser = () => useContext(CurrentUserContext);
// export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// export const CurrentUserProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const navigate = useNavigate();

//     /*
//   Make API request to get current user data
//   */ 
//     const handleMount = async () => {
//         try {
//             const { data } = await axiosRes.get("dj-rest-auth/user/")
//             setCurrentUser(data)
//         } catch (error) {
//             // console.log(error)
//         }
//     };

//     useEffect(() => {
//         handleMount()
//     }, []);

//     /* 
//     Handles access tokens
//     Redirects user to login page if refreshing of token fails
//   */
//     useMemo(() => {
//         axiosReq.interceptors.request.use(
//             async (config) => {
//                 if (shouldRefreshToken){
//                     try {
//                         await axios.post("/dj-rest-auth/token/refresh/");
//                     } catch (err) {
//                         setCurrentUser((prevCurrentUser) => {
//                             if (prevCurrentUser) {
//                                 navigate("/login");
//                             }
//                             return null;
//                         });
//                         removeTokenTimestamp()
//                         return config;
//                     }
//                 }
                
//                 return config;
//             },
//             (err) => {
//                 return Promise.reject(err);
//             }
//         )


//         axiosRes.interceptors.response.use(
//             (response) => response,
//             async (err) => {
//                 if (err.response?.status === 401){
//                     try {
//                         await axios.post("/dj-rest-auth/token/refresh/")
//                     } catch (error) {
//                         setCurrentUser((prevCurrentUser) => {
//                             if (prevCurrentUser) {
//                                 navigate("/login");
//                             }
//                             return null;
//                         });
//                         removeTokenTimestamp()
//                     }
//                     return axios(err.config);
//                 }
//                 return Promise.reject(err);
//             }
//         )
//     }, [navigate])

//     return (
//         <CurrentUserContext.Provider value={currentUser}>
//             <SetCurrentUserContext.Provider value={setCurrentUser}>
//                 {children}
//             </SetCurrentUserContext.Provider>
//         </CurrentUserContext.Provider>
//     );
// };