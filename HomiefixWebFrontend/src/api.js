
import axios from "axios";
let globalNavigate = null;


export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};


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
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("username");
     
      // Redirect to login
      if (globalNavigate) {
        globalNavigate("/", { replace: true });
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);


export default api;
