import axios from "axios";

// Set up default base URL and credentials
axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.withCredentials = true;

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const name = "csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;  // Return null if not found
};

// Axios Request Interceptors for CSRF and Authorization
axios.interceptors.request.use(
  (config) => {
    // Add CSRF token
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    // Add Authorization token
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers["Authorization"] = `Token ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosReq = axios.create();
export const axiosRes = axios.create();
