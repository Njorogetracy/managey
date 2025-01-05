import axios from "axios";

// Set up default base URL and credentials
axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.withCredentials = true;

// Create Axios instances for requests and responses
export const axiosReq = axios.create({
  baseURL: "https://manageydrf-8a469d59154b.herokuapp.com/",
  withCredentials: true,
});

export const axiosRes = axios.create({
  baseURL: "https://manageydrf-8a469d59154b.herokuapp.com/",
  withCredentials: true,
});

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const name = "csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

// Add interceptors to include CSRF token in requests
axiosReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }

    // Add CSRF token to headers
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosRes.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }

    // Add CSRF token to headers
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
