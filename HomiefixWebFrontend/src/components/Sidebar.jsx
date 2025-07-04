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
import ConfirmationDialog from "./ConfirmationDialog";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();
    
    if (typeof onLogout === "function") {
      onLogout();
    }
    
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirmation(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
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

        <nav className="menu-container">
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

          {/* <Link to="/user-details" className={`menu-item ${location.pathname.startsWith("/user-details") ? "active" : ""}`}>
            <img src={workersIcon} alt="Users" className="menu-icon" />
            User Details
          </Link> */}

          <Link to="/reviews" className={`menu-item ${location.pathname.startsWith("/reviews") ? "active" : ""}`}>
            <img src={reviewsIcon} alt="Reviews" className="menu-icon" />
            Reviews
          </Link>

          <Link to="/services" className={`menu-item ${location.pathname.startsWith("/services") ? "active" : ""}`}>
            <img src={servicesIcon} alt="Services" className="menu-icon" />
            Services
          </Link>
        </nav>

        <div className="logout-container">
          <button onClick={handleLogoutClick} className="logout-button">
            <img src={logoutIcon} alt="Logout" className="menu-icon" />
            Logout
          </button>
        </div>
      </div>

      <ConfirmationDialog
        show={showLogoutConfirmation}
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

export default Sidebar;