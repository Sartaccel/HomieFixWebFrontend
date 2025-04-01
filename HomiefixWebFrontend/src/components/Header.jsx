import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/addWorker.png";
import search from "../assets/Search.png";
import Notifications from "./Notifications";
import { createPortal } from "react-dom";
import api from "../api";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profile);
  const popupRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const getHeading = () => {
    if (location.pathname.startsWith("/booking-details"))
      return "Booking Details";
    if (location.pathname.startsWith("/worker-details"))
      return "Worker Details";
    if (location.pathname.startsWith("/services")) return "Services";
    if (location.pathname.startsWith("/reviews")) return "Reviews";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "Dashboard";
  };

  const toggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      try {
        await api.post("/notifications/mark-read");
        setUnreadCount(0);
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  // Fetch current user's profile photo
  const fetchProfilePhoto = async () => {
    try {
      const username = localStorage.getItem("username");
      if (username) {
        const response = await api.get(`/admin/${username}`);
        if (response.data.profilePicUrl) {
          setProfilePhoto(response.data.profilePicUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching profile photo:", error);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications/unread-count");
        setUnreadCount(response.data);
      } catch (error) {
        console.error("Error fetching unread notification count:", error);
      }
    };

    fetchUnreadCount();
    fetchProfilePhoto(); // Fetch profile photo on mount

    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchProfilePhoto(); // Periodically check for updates
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

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

  const username = localStorage.getItem("username");

  return (
    <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
      <h2
        className="heading align-items-center mb-0"
        style={{ marginLeft: "31px" }}
      >
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
        <div className="position-relative" ref={popupRef}>
          <img
            src={notification}
            alt="Notifications"
            width="40"
            className="cursor-pointer"
            onClick={toggleNotifications}
            style={{ cursor: "pointer" }}
          />
          {unreadCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
              style={{ fontSize: "0.7rem" }}
            >
              {unreadCount}
            </span>
          )}
          {showNotifications &&
            createPortal(
              <div
                className="position-fixed rounded p-3 "
                style={{
                  zIndex: 1050,
                  right: "50px",
                  top: "53px",
                  width: "400px",
                  maxHeight: "500px",
                  position: "fixed",
                }}
              >
                <Notifications />
              </div>,
              document.body
            )}
        </div>
        <img
          src={profilePhoto || profile}
          alt="Profile"
          width="40"
          height="35"
          className="cursor-pointer rounded-circle"
          onClick={() => navigate(`/profile/${username}`)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
};

export default Header;