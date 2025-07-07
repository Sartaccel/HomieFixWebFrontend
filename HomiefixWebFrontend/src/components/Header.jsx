import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/addWorker.jpg";
import Notifications from "./Notifications";
import { createPortal } from "react-dom";
import api from "../api";
import SearchBar from "./SearchBar";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profile);
  const popupRef = useRef(null);
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUsername, setCurrentUsername] = useState("");

  const getHeading = () => {
    if (location.pathname.startsWith("/booking-details")) return "Booking Details";
    if (location.pathname.startsWith("/worker-details")) return "Worker Details";
    if (location.pathname.startsWith("/user-details")) return "User Details";
    if (location.pathname.startsWith("/services")) return "Services";
    if (location.pathname.startsWith("/reviews")) return "Reviews";
    if (location.pathname.startsWith("/profile")) return "Profile";

    return "Dashboard";
  };

  const toggleNotifications = async (e) => {
    e.stopPropagation();
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

  const fetchProfilePhoto = async (username) => {
    try {
      if (username) {
        const response = await api.get(`/admin/${username}`);
        if (response.data.profilePicUrl) {
          sessionStorage.setItem(`profilePhoto_${username}`, response.data.profilePicUrl);
          setProfilePhoto(response.data.profilePicUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching profile photo:", error);
      setProfilePhoto(profile);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    setCurrentUsername(username);

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications/unread-count");
        setUnreadCount(response.data);
      } catch (error) {
        console.error("Error fetching unread notification count:", error);
      }
    };

    fetchUnreadCount();

    if (username) {
      const cachedPhoto = sessionStorage.getItem(`profilePhoto_${username}`);
      if (cachedPhoto) {
        setProfilePhoto(cachedPhoto);
      } else {
        fetchProfilePhoto(username);
      }
    }

    const handleProfileUpdate = (e) => {
      if (e.detail.username === username) {
        fetchProfilePhoto(username);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const popup = popupRef.current;
      const notiContainer = notificationRef.current;
  
      if (
        popup &&
        !popup.contains(event.target) &&
        notiContainer &&
        !notiContainer.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
  
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);
  

  return (
    <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
      <h2 className="heading align-items-center mb-0" style={{ marginLeft: "30px" }}>
        {getHeading()}
      </h2>
      <div className="header-right d-flex align-items-center gap-3" style={{ marginRight: "250px" }}>
        <SearchBar />
        
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
                ref={notificationRef}
                className="position-fixed rounded p-3"
                style={{
                  zIndex: 1050,
                  right: "50px",
                  top: "53px",
                  width: "400px",
                  maxHeight: "500px",
                  position: "fixed",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Notifications />
              </div>,
              document.body
            )}
        </div>
        <img
          src={profilePhoto}
          alt="Profile"
          width="40"
          height="40"
          className="cursor-pointer rounded-circle"
          onClick={() => navigate(`/profile/${currentUsername}`)}
          style={{ cursor: "pointer" }}
          onError={(e) => {
            e.target.src = profile;
          }}
        />
      </div>
    </header>
  );
};

export default Header;