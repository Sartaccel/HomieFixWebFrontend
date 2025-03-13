import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ token }) => {

  const isAuthenticated = token && token !== "";

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;