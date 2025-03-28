import React, { createContext, useState, useEffect } from "react";
import api from "../api"; // Your Axios instance
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      validateToken(storedToken);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
    validateToken(token);
  }, [token]);

  const validateToken = async (tokenToCheck) => {
    if (!tokenToCheck) {
      setIsAuthenticated(false);
      return;
    }
    try {
      await api.get('/admin/validateToken');
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setToken("");
      navigate("/");
    }
  };

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken("");
    setIsAuthenticated(false);
    navigate("/");
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};