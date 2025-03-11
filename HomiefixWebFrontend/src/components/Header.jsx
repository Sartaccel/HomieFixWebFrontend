import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  // Function to determine heading based on URL
  const getHeading = () => {
    if (location.pathname.startsWith("/booking-details")) return "Booking Details";
    if (location.pathname.startsWith("/worker-details")) return "Worker Details";
    if (location.pathname.startsWith("/services")) return "Services";
    if (location.pathname.startsWith("/reviews")) return "Reviews";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "Dashboard"; // Default heading
  };

  // Retrieve username from local storage
  const username = localStorage.getItem("username");

  return (
    <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
      <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>{getHeading()}</h2>
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
        <img src={notification} alt="Notifications" width="40" className="cursor-pointer" />
        <img
          src={profile}
          alt="Profile"
          width="40"
          className="cursor-pointer"
          onClick={() => navigate(`/profile/${username}`)} // Dynamically insert username
          style={{ cursor: "pointer" }} // Ensure it's clickable
        />
      </div>
    </header>
  );
};

export default Header;