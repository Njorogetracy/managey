import axios from "axios";

axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));
  return csrfToken ? csrfToken.split("=")[1] : null;
};

export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Add request interceptors to include `X-CSRFToken` and `Authorization` in headers
axiosReq.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    const authToken = localStorage.getItem("authToken");

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    if (authToken) {
      config.headers["Authorization"] = `Token ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
