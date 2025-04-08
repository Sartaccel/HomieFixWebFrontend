import React, { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const isValidToken = !!token;

  const navigate = useNavigate();
  const location = useLocation();

  const [showDialog, setShowDialog] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const cameFromLoginRef = useRef(false);
  const historyDepth = useRef(0);

  useEffect(() => {
    // When landing at /booking-details for the first time
    if (initialLoad && location.pathname === "/booking-details") {
      cameFromLoginRef.current = true;
      setInitialLoad(false);
      window.history.pushState({ protected: true }, "");
      historyDepth.current++;
    } else if (location.pathname !== "/booking-details") {
      // Reset flag when navigating elsewhere
      cameFromLoginRef.current = false;
    }
  }, [location.pathname, initialLoad]);

  useEffect(() => {
    const handlePopState = () => {
      // Show logout confirmation if user came directly from login
      if (location.pathname === "/booking-details" && cameFromLoginRef.current) {
        setShowDialog(true);
        window.history.pushState({ protected: true }, "");
        return;
      }

      // Block back to "/" (login) if user moved around and came back
      if (window.location.pathname === "/") {
        window.history.pushState({ protected: true }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname]);

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    setShowDialog(false);
    navigate("/", { replace: true });
  };

  const handleCancelLogout = () => {
    setShowDialog(false);
    window.history.pushState({ protected: true }, "");
  };

  if (!isValidToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
      <ConfirmationDialog
        show={showDialog}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

export default ProtectedRoute;
