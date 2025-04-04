import axios from "axios";

let globalNavigate = null;

export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};

const api = axios.create({
  baseURL: "http://localhost:2222",
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
// api.js
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
      console.error("403 Forbidden - Possible reasons:", {
        endpoint: error.config.url,
        method: error.config.method,
        token: localStorage.getItem("token"),
        user: localStorage.getItem("username")
      });
      // You can redirect or show a specific message
    }
    return Promise.reject(error);
  }
);

export default api;