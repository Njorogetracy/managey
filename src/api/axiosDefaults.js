import axios from "axios";

// Base Axios configurations
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
  const csrfCookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken'));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Interceptor to include CSRF token in requests
axiosReq.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    config.headers['Authorization'] = `Token ${authToken}`;
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosRes.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  const authToken = localStorage.getItem('authToken'); 

  if (authToken) {
    config.headers['Authorization'] = `Token ${authToken}`;
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
