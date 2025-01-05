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

axiosReq.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosRes.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
