import React from "react";
import "../styles/Sidebar.css";
import logo from "../assets/HomiefixLogo.png";
import dashboardIcon from "../assets/Dashboard.svg";
import workersIcon from "../assets/WorkerDetails.svg";
import reviewsIcon from "../assets/Reviews.svg";
import servicesIcon from "../assets/Service.svg";
import logoutIcon from "../assets/Logout.svg";
import { useLocation, Link } from "react-router-dom"; // Import Link

const Sidebar = () => {
  const location = useLocation(); // Get the current route location

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <nav className="menu-container">
        <Link
          to="/dashboard"
          className={`menu-item dashboard ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <img src={dashboardIcon} alt="Dashboard" className="menu-icon" />
          Dashboard
        </Link>

        {/* Booking Details with Inline SVG */}
        <Link
          to="/booking-details"
          className={`menu-item booking-details ${location.pathname === '/booking-details' ? 'active' : ''}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 20 21"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
            className="menu-icon"
          >
            <path
              d="M14.0909 13.5297V15.2629L15.0727 16.3027M18.4545 7.16216V5.10811C18.4545 3.97369 17.4777 3.05405 16.2727 3.05405H13M6.45455 19.4865H3.18182C1.97683 19.4865 1 18.5669 1 17.4324V9.21622M13 1V3.05405M13 5.10811V3.05405M6.45455 1V3.05405M6.45455 5.10811V3.05405M13 3.05405H6.45455M6.45455 3.05405H3.18182C1.97683 3.05405 1 3.97369 1 5.10811V9.21622M6.45455 9.21622H1M19 15.3784C19 17.9308 16.8021 20 14.0909 20C11.3797 20 9.18182 17.9308 9.18182 15.3784C9.18182 12.8259 11.3797 10.7568 14.0909 10.7568C16.8021 10.7568 19 12.8259 19 15.3784Z"
              stroke="black"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Booking Details
        </Link>

        <Link to="#" className="menu-item">
          <img src={workersIcon} alt="Workers" className="menu-icon" />
          Workers Details
        </Link>
        <Link to="#" className="menu-item">
          <img src={reviewsIcon} alt="Reviews" className="menu-icon" />
          Reviews
        </Link>
        <Link to="#" className="menu-item">
          <img src={servicesIcon} alt="Services" className="menu-icon" />
          Services
        </Link>
      </nav>

      <div className="logout-container">
        <Link to="#" className="logout-button">
          <img src={logoutIcon} alt="Logout" className="menu-icon" />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
