import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/HomiefixLogo.png";
import usernameIcon from "../assets/Username.png";
import passwordIcon from "../assets/Password.png";
import "../styles/Login.css";
import api from "../api";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
    setToken("");
  }, [setToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setIsInvalid(false);

    try {
      const response = await api.post("/admin/login", {
        username,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
        setToken(response.data.token);
        navigate("/booking-details");
      } else {
        throw new Error("No token in response");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsInvalid(true);
      setErrorMessage(
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100" style={{ background: "linear-gradient(to right, #f8f9fa 50%, rgba(0, 117, 206, 0.25) 50%)" }}>
      <div className="w-100 d-flex justify-content-center align-items-center position-relative">
        <div className="position-absolute top-0 start-0 m-3">
          <img src={logo} alt="Logo" className="img-fluid" style={{ marginTop: "-40px", width: "200px", height: "200px", objectFit: "contain" }} />
        </div>
        <div className="card p-4 rounded" style={{ width: "400px", backgroundColor: "#ffffff", zIndex: 10, boxShadow: "-18px 18px 56px 0px #0000001A, -72px 72px 101px 0px #00000017, -161px 161px 137px 0px #0000000D, -286px 286px 162px 0px #00000003, -447px 447px 177px 0px #00000000" }}>
          <h3 className="text-center mb-3">Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group" style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", overflow: "hidden", border: `2px solid ${isInvalid ? "#B8141A" : focusedField === "username" ? "#0076CE" : "transparent"}`, display: "flex", alignItems: "center", transition: "border 0.3s" }}>
                <span className="input-group-text border-0 bg-transparent" style={{ width: "auto", padding: "0 12px" }}>
                  <img src={usernameIcon} alt="User Icon" width="18" height="18" />
                </span>
                <input type="text" className="form-control border-0 bg-transparent" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); setIsInvalid(false); }} onFocus={() => setFocusedField("username")} onBlur={() => setFocusedField(null)} required style={{ height: "50px", flex: "1", outline: "none", boxShadow: "none" }} />
              </div>
            </div>

            <div className="mb-2">
              <div className="input-group" style={{ backgroundColor: "#F5F5F5", borderRadius: "6px", overflow: "hidden", border: `2px solid ${isInvalid ? "#B8141A" : focusedField === "password" ? "#0076CE" : "transparent"}`, display: "flex", alignItems: "center", transition: "border 0.3s" }}>
                <span className="input-group-text border-0 bg-transparent" style={{ width: "auto", padding: "0 12px" }}>
                  <img src={passwordIcon} alt="Password Icon" width="18" height="18" />
                </span>
                <input type="password" className="form-control border-0 bg-transparent" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setIsInvalid(false); }} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} required style={{ height: "50px", flex: "1", outline: "none", boxShadow: "none" }} />
              </div>
            </div>

            {isInvalid && (
              <div className="mb-3 text-start" style={{ color: "#B8141A", fontSize: "14px", marginLeft: "12px" }}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn w-100"
              disabled={loading}
              style={{ 
                height: "50px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                backgroundColor: loading ? "#015899" : "#0076CE",
                color: "white", 
                border: "none", 
                borderRadius: "6px", 
                transition: "background-color 0.3s" 
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </>
              ) : (
                "Login"
              )}
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