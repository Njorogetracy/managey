import axios from "axios";

axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.xsrfCookieName = "csrftoken"; 
axios.defaults.xsrfHeaderName = "X-CSRFToken"; 
axios.defaults.withCredentials = true; 


// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const name = "csrftoken"; 
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
};

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Add request interceptors to include CSRF and Authorization headers
axiosReq.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    const authToken = localStorage.getItem("authToken"); 

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
      console.log("X-CSRFToken added to request:", csrfToken);
    }

    if (authToken) {
      config.headers["Authorization"] = `Token ${authToken}`;
      console.log("Authorization token added to request:", authToken);
    }

    return config;
  },
  (error) => Promise.reject(error)
);
