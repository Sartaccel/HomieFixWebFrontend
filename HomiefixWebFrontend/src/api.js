import axios from "axios";

let globalNavigate = null;

export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};

// https://admin.homiefix.in/api
// http://localhost:1212
const api = axios.create({
  baseURL: "https://admin.homiefix.in/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (token expired/invalid)
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      if (globalNavigate) {
        globalNavigate("/", { replace: true });
      } else {
        window.location.href = "/";
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden (permission denied)
      // You can redirect or show a specific message
    }
    return Promise.reject(error);
  }
);

export default api;
