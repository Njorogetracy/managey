import axios from "axios";

axios.defaults.baseURL = 'https://manageydrf-8a469d59154b.herokuapp.com/'
axios.defaults.baseURL = 'https://8000-njorogetracy-manageydrf-qt48gzd5j16.ws-eu117.gitpod.io/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
