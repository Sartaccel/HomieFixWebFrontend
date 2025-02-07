import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const AssignBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const booking = location.state?.booking || {};
  const [activeTab, setActiveTab] = useState("serviceDetails");

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          
          {/* Header */}
          <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
            <h2 className="heading align-items-center mb-0">Booking Details</h2>
            <div className="header-right d-flex align-items-center gap-3">
              <div className="input-group" style={{ width: "300px" }}>
                <input type="text" className="form-control search-bar" placeholder="Search" />
                <span className="input-group-text">
                  <img src={search} alt="Search" width="20" />
                </span>
              </div>
              <img src={notification} alt="Notifications" width="40" className="cursor-pointer" />
              <img src={profile} alt="Profile" width="40" className="cursor-pointer" />
            </div>
          </header>

          {/* Navigation Bar */}
          <div className="navigation-bar d-flex justify-content-between align-items-center py-3 px-3 bg-white border-bottom w-100">
            <div className="d-flex gap-3">
              <div 
                className={`section ${activeTab === "serviceDetails" ? "active" : ""}`} 
                onClick={() => setActiveTab("serviceDetails")}
              >
                Service Details
              </div>
            </div>
            {/* Right side buttons */}
            <div className="d-flex gap-3 p-2" style={{ marginRight: "300px" }}>
              <button className="btn btn-outline-primary">Reschedule</button>
              <button className="btn btn-outline-danger">Cancel Service</button>
            </div>
          </div>

          {/* Content */}
          <div className="container mt-5 pt-4">
            {/* Two Cards in the Same Row */}
            <div className="row justify-content-between" style={{ marginTop: "60px", marginLeft: "30px" }}>
              {/* Left Card - Booking Information */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2" style={{ marginTop: "50px" }}>
                    <div className="rounded-circle bg-secondary" style={{ width: "40px", height: "40px" }}></div>
                    <div>
                    <p className="mb-0">{booking.service}</p>
                    <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                    </div>
                </div>

                <div className="p-0 m-0">
                    <div className="mt-4">
                    <h6>Customer Details</h6>
                    </div>
                    <p className="mb-1">
                    <i className="bi bi-person-fill me-2"></i> {booking.name}
                    </p>
                    <p className="mb-1">
                    <i className="bi bi-telephone-fill me-2"></i> {booking.contact}
                    </p>
                    <p className="mb-1">
                    <i className="bi bi-geo-alt-fill me-2"></i> {booking.address}
                    </p>
                    <p className="mb-1">
                    <i className="bi bi-calendar-event-fill me-2"></i> {booking.date}
                    </p>
                </div>

                {/* Comment Field (Notes) */}
                <div className="mt-3 border border-2 rounded " style={{width:"550px"}}>
                    <textarea 
                    id="notes" 
                    className="form-control" 
                    placeholder="Notes"
                    rows="9"
                    ></textarea>
                </div>
                </div>


              {/* Right Card - Service Details */}
              <div className="col-md-6">
                <div className="card rounded p-3" style={{ height: "400px" }}>
                  <h5>Service Details</h5>
                  <p><strong>Date:</strong> {booking.date || "12th Feb 2025"}</p>
                  <p><strong>Time:</strong> {booking.time || "3:00 PM"}</p>
                  <p><strong>Status:</strong> {booking.status || "Confirmed"}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignBookings;
