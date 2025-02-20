import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // ✅ Import Bootstrap Icons
import "../styles/Sidebar.css";

// Import assets
import logo from "../assets/HomiefixLogo.png";
import dashboardIcon from "../assets/Dashboard.svg";
import workersIcon from "../assets/WorkerDetails.svg";
import reviewsIcon from "../assets/Reviews.svg";
import servicesIcon from "../assets/Service.svg";
import logoutIcon from "../assets/Logout.svg";
import bookingDetails from "../assets/BookingDetails.png";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ✅ Toggle Button with Dynamic Icon */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`} style={{ fontSize: "30px" }}></i>
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <nav className="menu-container d-flex flex-column">
          <Link to="/dashboard" className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
            Dashboard
          </Link>

          <Link 
            to="/booking-details" 
            className={`menu-item ${location.pathname.startsWith("/assign-bookings") || location.pathname === "/booking-details" ? "active" : ""}`}
          >
            <img src={bookingDetails} alt="Booking Details" className="menu-icon" />
            Booking Details
          </Link>

          <Link to="/worker-details" className={`menu-item ${location.pathname.startsWith("/worker-details") ? "active" : ""}`}>
            <img src={workersIcon} alt="Workers" className="menu-icon" />
            Workers Details
          </Link>

          {/* ✅ Fixed className syntax error */}
          <Link to="/reviews" className={`menu-item ${location.pathname.startsWith("/reviews") ? "active" : ""}`}>
            <img src={reviewsIcon} alt="Reviews" className="menu-icon" />
            Reviews
          </Link>

          <Link to="#" className="menu-item">
            <img src={servicesIcon} alt="Services" className="menu-icon" />
            Services
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="logout-container mt-auto">
          <Link to="/" className="logout-button" style={{ height: "54px" }}>
            <img src={logoutIcon} alt="Logout" className="menu-icon" />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
