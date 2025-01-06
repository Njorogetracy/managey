import axios from "axios";

axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const name = "csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  const token = parts.length === 2 ? parts.pop().split(";").shift() : null;
  console.log("CSRF Token:", token);
  return token;
};

export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Add request interceptors to include `X-CSRFToken` and `Authorization` in headers
axiosReq.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    } else {
      console.warn("CSRF token missing.");
    }

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers["Authorization"] = `Token ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
