import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/HomiefixLogo.png";
import usernameIcon from "../assets/Username.png";
import passwordIcon from "../assets/Password.png";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:2222/auth/login", { username, password });

      console.log("Login Response:", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);  // ✅ No more error
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid response. Token missing.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };
  

  return (
    <div
      className="d-flex vh-100"
      style={{
        background: "linear-gradient(to right, #f8f9fa 50%, rgba(0, 117, 206, 0.25) 50%)",
      }}
    >
      <div className="w-100 d-flex justify-content-center align-items-center position-relative">
        <div className="position-absolute top-0 start-0 m-3">
          <img src={logo} alt="Logo" className="img-fluid" style={{ marginTop: "-40px", width: "200px", height: "200px", objectFit: "contain" }} />
        </div>

        <div className="card shadow-lg p-4 rounded" style={{ width: "400px", backgroundColor: "#ffffff", zIndex: 10 }}>
          <h2 className="text-center mb-3">Login</h2>
          {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group" style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", overflow: "hidden", border: "1px solid transparent", display: "flex", alignItems: "center" }}>
                <span className="input-group-text border-0 bg-transparent" style={{ width: "auto", padding: "0 12px" }}>
                  <img src={usernameIcon} alt="User Icon" width="18" height="18" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ height: "50px", flex: "1", outline: "none", boxShadow: "none" }}
                  onFocus={(e) => (e.target.parentElement.style.border = "2px solid #0076CE")}
                  onBlur={(e) => (e.target.parentElement.style.border = "1px solid transparent")}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group" style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", overflow: "hidden", border: "1px solid transparent", display: "flex", alignItems: "center" }}>
                <span className="input-group-text border-0 bg-transparent" style={{ width: "auto", padding: "0 12px" }}>
                  <img src={passwordIcon} alt="Password Icon" width="18" height="18" />
                </span>
                <input
                  type="password"
                  className="form-control border-0 bg-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ height: "50px", flex: "1", outline: "none", boxShadow: "none" }}
                  onFocus={(e) => (e.target.parentElement.style.border = "2px solid #0076CE")}
                  onBlur={(e) => (e.target.parentElement.style.border = "1px solid transparent")}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" style={{ height: "50px", background: "#0076CE" }}>
              Login
            </button>
          </form>

          <a href="https://homiefix.in" className="d-block text-center mt-3 text-decoration-underline text-dark">
            Visit homiefix.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
