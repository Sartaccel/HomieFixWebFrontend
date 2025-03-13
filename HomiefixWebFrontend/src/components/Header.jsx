import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import Notifications from "./Notifications"; // Import Notifications component

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const popupRef = useRef(null);

  // Function to determine heading based on URL
  const getHeading = () => {
    if (location.pathname.startsWith("/booking-details")) return "Booking Details";
    if (location.pathname.startsWith("/worker-details")) return "Worker Details";
    if (location.pathname.startsWith("/services")) return "Services";
    if (location.pathname.startsWith("/reviews")) return "Reviews";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "Dashboard"; // Default heading
  };

  // Toggle notification popup
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
      <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>{getHeading()}</h2>
      <div className="header-right d-flex align-items-center gap-3">
        <div className="input-group" style={{ width: "300px" }}>
          <input type="text" className="form-control search-bar" placeholder="Search" />
          <span className="input-group-text">
            <img src={search} alt="Search" width="20" />
          </span>
        </div>

        {/* Notification Icon with Popup */}
        <div className="position-relative" ref={popupRef}>
          <img
            src={notification}
            alt="Notifications"
            width="40"
            className="cursor-pointer"
            onClick={toggleNotifications}
            style={{ cursor: "pointer" }}
          />
          {showNotifications && (
            <div
              className="position-absolute rounded p-3"
              style={{
                right: "0",
                // top: "120px",
                width: "400px",
                maxHeight: "500px",
                zIndex:1000,
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                ×
              </button>

              <Notifications />
            </div>
          )}
        </div>

        {/* Profile Icon */}
        <img
          src={profile}
          alt="Profile"
          width="40"
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
};

export default Header;
