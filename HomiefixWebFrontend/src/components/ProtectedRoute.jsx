import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ token }) => {
  const isAuthenticated = token && token !== "";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;