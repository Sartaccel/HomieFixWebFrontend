import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  
  // Additional check if you want to verify token validity
  const isValidToken = token && token !== "";
  // Note: For complete validation, you might need to call a validate-token endpoint

  if (!isValidToken) {
    // Clear any residual tokens
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;