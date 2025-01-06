import axios from "axios";

axios.defaults.baseURL = "https://manageydrf-8a469d59154b.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.xsrfCookieName = "csrftoken"; 
axios.defaults.xsrfHeaderName = "X-CSRFToken"; 
axios.defaults.withCredentials = true; 


const getAccessToken = () => localStorage.getItem("accessToken");

axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token when expired
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config && !error.config._retry) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const { data } = await axios.post("/dj-rest-auth/token/refresh/", { refresh: refreshToken });
        localStorage.setItem("accessToken", data.access);
        error.config.headers["Authorization"] = `Bearer ${data.access}`;
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

