import axios from "axios";

axios.defaults.baseURL = 'https://manageydrf-8a469d59154b.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;

// Check if access token is stored in localStorage and set it in headers
const token = localStorage.getItem("access_token");
if (token) {
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export const axiosReq = axios.create();
export const axiosRes = axios.create();
