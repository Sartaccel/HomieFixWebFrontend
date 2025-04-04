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

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();
    
    // Trigger the loading screen through parent component
    if (typeof onLogout === "function") {
      onLogout();
    }
    
    // Navigate to login after a small delay
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`} style={{ fontSize: "30px" }}></i>
      </button>

      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <nav className="menu-container d-flex flex-column">
          <Link to="/dashboard" className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
            Dashboard
          </Link>

          <Link to="/booking-details" className={`menu-item ${location.pathname.startsWith("/booking-details") ? "active" : ""}`}>
            <img src={bookingDetails} alt="Booking Details" className="menu-icon" />
            Booking Details
          </Link>

          <Link to="/worker-details" className={`menu-item ${location.pathname.startsWith("/worker-details") ? "active" : ""}`}>
            <img src={workersIcon} alt="Workers" className="menu-icon" />
            Workers Details
          </Link>

          <Link to="/reviews" className={`menu-item ${location.pathname.startsWith("/reviews") ? "active" : ""}`}>
            <img src={reviewsIcon} alt="Reviews" className="menu-icon" />
            Reviews
          </Link>

          <Link to="/services" className={`menu-item ${location.pathname.startsWith("/services") ? "active" : ""}`}>
            <img src={servicesIcon} alt="Services" className="menu-icon" />
            Services
          </Link>
        </nav>

        <div className="logout-container" style={{ marginTop: "200px" }}>
          <button onClick={handleLogout} className="logout-button" style={{ height: "54px", border: "none" }}>
            <img src={logoutIcon} alt="Logout" className="menu-icon" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;