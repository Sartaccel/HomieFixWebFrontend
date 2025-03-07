import React from "react";
import { useNavigate } from "react-router-dom";

import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

import "../styles/AssignBookings.css";
import Header from "./Header";

const Profile = () => {
  const navigate = useNavigate(); // Fix: Define navigate function

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          {/* Header */}
          <Header/>

          {/* Navigation Bar */}
          <div className="navigation-bar d-flex justify-content-between align-items-center py-3 px-3 bg-white border-bottom w-100">
            <div className="d-flex gap-3 align-items-center">
              <button
                className="btn btn-light p-2"
                style={{ marginBottom: "-20px" }}
                onClick={() => navigate(-1)} // Fix: Use navigate function
              >
                <i
                  className="bi bi-arrow-left"
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                ></i>
              </button>
              <div className="section active">Profile Details</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
