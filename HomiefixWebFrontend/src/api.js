import axios from "axios";

let globalNavigate = null;

export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};

const api = axios.create({
  // baseURL: "http://localhost:2222",
   baseURL: "https://admin.homiefix.in/api/",
});

// Add a request interceptor to include the token in headers
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

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (globalNavigate) globalNavigate("/"); // Redirect properly
    }
    return Promise.reject(error);
  }
);

export default api;
