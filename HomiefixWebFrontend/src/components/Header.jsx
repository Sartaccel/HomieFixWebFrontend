import React, { useEffect, useState, useRef } from "react"; // Add useRef here
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import Notifications from "./Notifications";
import { createPortal } from "react-dom";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profile); // State for profile photo
  const popupRef = useRef(null); // useRef is now defined


  // Function to determine heading based on URL
  const getHeading = () => {
    if (location.pathname.startsWith("/booking-details")) return "Booking Details";
    if (location.pathname.startsWith("/worker-details")) return "Worker Details";
    if (location.pathname.startsWith("/services")) return "Services";
    if (location.pathname.startsWith("/reviews")) return "Reviews";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "Dashboard"; // Default heading
  };


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


  // Retrieve username from local storage
  const username = localStorage.getItem("username");


  // Read profile photo from local storage on component mount
  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem("profilePhoto");
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
    }
  }, []);


  return (
    <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
      <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>
        {getHeading()}
      </h2>
      <div className="header-right d-flex align-items-center gap-3">
        <div className="input-group" style={{ width: "300px" }}>
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Search"
          />
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
          {/* Render Notifications outside the Header using a portal */}
          {showNotifications &&
            createPortal(
              <div
                className="position-fixed rounded p-3 "
                style={{
                  zIndex: 1050, // Ensure it's above everything
                  right: "50px",
                  top: "53px",
                  width: "400px",
                  maxHeight: "500px",
                  position: "fixed",
                }}
              >
                <Notifications />
              </div>,
              document.body // Render the Notifications card in the body
            )}
        </div>
        <img
          src={profilePhoto || profile}
          alt="Profile"
          width="40"
          className="cursor-pointer rounded-circle"
          onClick={() => navigate(`/profile/${username}`)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
};


export default Header;
