import axios from "axios";
const apiURL = import.meta.env.VITE_API_URL;
const serverURL = import.meta.env.VITE_SERVER_URL;

export const axiosInstance = axios.create({
  baseURL: apiURL,
});

export const axiosServer = axios.create({
  baseURL: serverURL,
});

export const axiosLocal = axios.create({
  baseURL: "http://localhost:3000/api",
});
