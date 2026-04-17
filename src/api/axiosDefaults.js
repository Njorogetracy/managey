import axios from "axios";

// API URL is read from environment variable so we can switch backends
// without changing code. Set REACT_APP_API_URL in .env file.
// Falls back to localhost for local development.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();


