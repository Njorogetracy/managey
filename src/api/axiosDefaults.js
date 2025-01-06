import axios from "axios";

axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.xsrfCookieName = "csrftoken"; 
axios.defaults.xsrfHeaderName = "X-CSRFToken"; 
axios.defaults.withCredentials = true; 


// Fetch the CSRF token when initializing axios
axiosReq.interceptors.request.use(
  async (config) => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      await axios.get("/set-csrf-token/");
      console.log("CSRF token refreshed");
    }
    config.headers["X-CSRFToken"] = getCsrfToken();
    return config;
  },
  (error) => Promise.reject(error)
);

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

