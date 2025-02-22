import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import "../styles/Sidebar.css";

import logo from "../assets/HomiefixLogo.png";
import dashboardIcon from "../assets/Dashboard.svg";
import workersIcon from "../assets/WorkerDetails.svg";
import reviewsIcon from "../assets/Reviews.svg";
import servicesIcon from "../assets/Service.svg";
import logoutIcon from "../assets/Logout.svg";
import bookingDetails from "../assets/BookingDetails.png";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Updated Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    sessionStorage.clear(); // Clear session storage (optional)
    
    setTimeout(() => {
      navigate("/", { replace: true });
      window.location.reload(); // Force redirect to login page
    }, 500); // Small delay to ensure token is removed
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`} style={{ fontSize: "30px" }}></i>
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <nav className="menu-container d-flex flex-column">
          <Link to="/dashboard" className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
            Dashboard
          </Link>

          <Link to="/booking-details" className={`menu-item ${location.pathname.startsWith("/assign-bookings") ||  location.pathname === "/booking-details" ||
          location.pathname.startsWith("/view-booking") ? "active" : ""}`}>
            <img src={bookingDetails} alt="Booking Details" className="menu-icon" />
            Booking Details
          </Link>

         
          <Link to="#" className="menu-item">
            <img src={workersIcon} alt="Workers" className="menu-icon" />
            Workers Details
          </Link>

          <Link to="/reviews" className={`menu-item ${location.pathname.startsWith("/reviews") ? "active" : ""}`}>
            <img src={reviewsIcon} alt="Reviews" className="menu-icon" />
            Reviews
          </Link>

          <Link to="services" className={`menu-item ${location.pathname.startsWith("/serviceDetail")|| location.pathname === "/services" ? "active" : ""}`}>
            <img src={servicesIcon} alt="Services" className="menu-icon" />
            Services
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="logout-container mt-auto">
          <button onClick={handleLogout} className="logout-button" style={{ height: "54px", background: "transparent", border: "none" }}>
            <img src={logoutIcon} alt="Logout" className="menu-icon" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
