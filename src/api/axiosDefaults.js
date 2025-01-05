import axios from "axios";

axios.defaults.baseURL = 'https://manageydrf-8a469d59154b.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

export const axiosReq = axios.create({
  baseURL: 'https://manageydrf-8a469d59154b.herokuapp.com/',
  withCredentials: true,
});

export const axiosRes = axios.create({
  baseURL: 'https://manageydrf-8a469d59154b.herokuapp.com/',
  withCredentials: true,
});

// Function to get CSRF token from cookies
const getCSRFToken = () => {
  const csrfToken = document.cookie.split("; ")
    .find(row => row.startsWith("csrftoken"))
    ?.split("=")[1];
  return csrfToken;
};

// Add CSRF token to request headers if available
axiosReq.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const csrfToken = getCSRFToken();
  
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosRes.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const csrfToken = getCSRFToken();
  
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
