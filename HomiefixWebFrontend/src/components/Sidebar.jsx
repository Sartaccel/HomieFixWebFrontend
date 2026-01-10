// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";
import logo from "../assets/HomiefixLogo.png";
import dashboardIcon from "../assets/Dashboard.svg";
import workersIcon from "../assets/WorkerDetails.svg";
import reviewsIcon from "../assets/Reviews.svg";
import enquiryIcon from "../assets/enquiryIcon.svg";
import transactionIcon from "../assets/transaction.svg";
import servicesIcon from "../assets/Service.svg";
import mailIcon from "../assets/mail.svg";
import logoutIcon from "../assets/Logout.svg";
import bookingDetails from "../assets/BookingDetails.png";
import ConfirmationDialog from "./ConfirmationDialog";
import couponIcon from "../assets/coupon.svg";
import bannerIcon from "../assets/banner.svg";
import supportIcon from "../assets/support.svg";
import marketingIcon from "../assets/marketing.svg";
import userdetailsIcon from "../assets/userdetails.svg";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [marketingDropdown, setMarketingDropdown] = useState(false);

  const [supportDropdown, setSupportDropdown] = useState(false);

  // Support active state
  const isSupportActive =
    location.pathname.startsWith("/reviews") ||
    location.pathname.startsWith("/enquiry");

  // coupon / banner active state
  const isMarketingActive =
    location.pathname.startsWith("/coupon") ||
    location.pathname.startsWith("/banner");

  // 🔹 Auto open Marketing dropdown when on /coupon or /banner
  useEffect(() => {
    if (isMarketingActive) {
      setMarketingDropdown(true);
    } else {
      setMarketingDropdown(false);
    }
  }, [isMarketingActive]);

  // Auto open Support dropdown
  useEffect(() => {
    setSupportDropdown(isSupportActive);
  }, [isSupportActive]);

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

  const toggleMarketingDropdown = () => {
    setMarketingDropdown((prev) => !prev);
  };

  const toggleSupportDropdown = () => {
    setSupportDropdown((prev) => !prev);
  };
  return (
    <>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i
          className={`bi ${isOpen ? "bi-x" : "bi-list"}`}
          style={{ fontSize: "30px" }}
        ></i>
      </button>

      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <nav className="menu-container">
          <Link
            to="/dashboard"
            className={`menu-item ${location.pathname === "/dashboard" ? "active" : ""
              }`}
          >
            <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
            Dashboard
          </Link>

          <Link
            to="/booking-details"
            className={`menu-item ${location.pathname.startsWith("/booking-details") ? "active" : ""
              }`}
          >
            <img src={bookingDetails} alt="Booking Details" className="menu-icon" />
            Booking Details
          </Link>

          <Link
            to="/worker-details"
            className={`menu-item ${location.pathname.startsWith("/worker-details") ? "active" : ""
              }`}
          >
            <img src={workersIcon} alt="Workers" className="menu-icon" />
            Workers Details
          </Link>

          <Link
            to="/customer-details"
            className={`menu-item ${location.pathname.startsWith("/customer-details") ? "active" : ""
              }`}
          >
            <img src={userdetailsIcon} alt="Customers" className="menu-icon" />
            Customer Details
          </Link>

          {/* <Link
            to="/reviews"
            className={`menu-item ${location.pathname.startsWith("/reviews") ? "active" : ""
              }`}
          >
            <img src={reviewsIcon} alt="Reviews" className="menu-icon" />
            Reviews
          </Link> */}

          <Link
            to="/services"
            className={`menu-item ${location.pathname.startsWith("/services") ? "active" : ""
              }`}
          >
            <img src={servicesIcon} alt="Services" className="menu-icon" />
            Service Details
          </Link>

          <Link
            to="/transaction-details"
            className={`menu-item ${location.pathname.startsWith("/transaction-details") ? "active" : ""
              }`}
          >
            <img src={transactionIcon} alt="transaction" className="menu-icon" />
            Transaction Details
          </Link>

          <div className={`dropdown-menu-item ${isSupportActive ? "active" : ""}`}>
            <button onClick={toggleSupportDropdown} className="dropdown-toggle menu-item">
               <img src={supportIcon} alt="Support" className="menu-icon" />
              Support
            </button>


            {supportDropdown && (
              <div className="dropdown-content" style={{ marginLeft: "-12px" }}>
                <Link to="/reviews" className={`dropdown-link ${location.pathname.startsWith("/reviews") ? "active" : ""}`}>
                  <img src={reviewsIcon} className="menu-icon" />
                  Reviews
                </Link>

                <Link to="/enquiry" className={`dropdown-link ${location.pathname.startsWith("/enquiry") ? "active" : ""}`}>
                  <img src={enquiryIcon} className="menu-icon" />
                  Enquiry
                </Link>
              </div>
            )}
          </div>
          {/* 
          <Link
            to="/mail"
            className={`menu-item ${location.pathname.startsWith("/mail") ? "active" : ""
              }`}
          >
            <img src={mailIcon} alt="mail" className="menu-icon" />
            Email
          </Link> */}

          {/* <Link
            to="/enquiry"
            className={`menu-item ${location.pathname.startsWith("/enquiry") ? "active" : ""
              }`}
          >
            <img src={enquiryIcon} alt="enquiry" className="menu-icon" />
            Enquiry
          </Link> */}


          {/* Marketing Dropdown */}
          <div
            className={`dropdown-menu-item ${isMarketingActive ? "active" : ""}`}
          >
            <button
              onClick={toggleMarketingDropdown}
              className="dropdown-toggle menu-item"
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img src={marketingIcon} alt="marketing" className="menu-icon" style={{ marginLeft: "-5px" }} />
              <span style={{ marginLeft: "-2px" }}>Marketing</span>
              {/* <i
      className={`bi ${
        marketingDropdown ? "bi-chevron-up" : "bi-chevron-down"
      }`}
      style={{ marginLeft: "auto", fontSize: "12px" }}
    ></i> */}
            </button>

            {marketingDropdown && (
              <div
                className="dropdown-content"
                style={{ marginLeft: "-12px" }}   // SHIFT ENTIRE BOX LEFT
              >
                <Link
                  to="/coupon"
                  className={`dropdown-link ${location.pathname.startsWith("/coupon") ? "active" : ""
                    }`}
                  style={{ paddingLeft: "0.95rem" }}   // SHIFT TEXT LEFT
                >
                  <img
                    src={couponIcon}
                    alt="coupon"
                    className="menu-icon"
                    style={{ marginRight: "6px" }}    // FIX ICON GAP
                  />
                  <span>Coupon</span>
                </Link>

                <Link
                  to="/banner"
                  className={`dropdown-link ${location.pathname.startsWith("/banner") ? "active" : ""
                    }`}
                  style={{ paddingLeft: "0.95rem" }}   // SHIFT TEXT LEFT
                >
                  <img
                    src={bannerIcon}
                    alt="banner"
                    className="menu-icon"
                    style={{ marginRight: "6px" }}    // FIX ICON GAP
                  />
                  <span>Banner</span>
                </Link>
                <Link
                  to="/mail"
                  className={`dropdown-link  ${location.pathname.startsWith("/mail") ? "active" : ""
                    }`}
                  style={{ paddingLeft: "0.95rem" }}
                >
                  <img src={mailIcon} alt="mail" className="menu-icon" />
                  Email
                </Link>

              </div>


            )}


          </div>

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
