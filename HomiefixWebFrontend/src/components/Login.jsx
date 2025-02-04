import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../styles/Login.css";
import logo from "../assets/HomiefixLogo.png"; 

const Login = () => {
  const navigate = useNavigate(); // Hook to navigate

  return (
    <div className="login-container-main">
      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="login-form">
        <div className="form-title-container">
          <h1 className="form-title">Login</h1>
        </div>
        <div className="input-fields">
          <div className="input-field-container">
            <span className="username-icon"></span>
            <input type="text" placeholder="Username" className="input-field" />
          </div>

          <div className="input-field-container">
            <span className="password-icon"></span>
            <input type="password" placeholder="Password" className="input-field" />
          </div>
          <button className="login-button">Login</button>

          {/* Visit Homiefix Link */}
          <a href="https://homiefix.in" className="visit-homiefix">
            Visit homiefix.in
          </a>
        </div>

        {/* Demo Login Button */}
        <button className="btn btn-primary mt-3" onClick={() => navigate("/booking-details")}>
          Demo Login
        </button>
      </div>
    </div>
  );
};

export default Login;
