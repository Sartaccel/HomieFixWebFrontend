import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const ViewBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Fixed missing import

  const booking = location.state?.booking || {};
  const [activeTab, setActiveTab] = useState("serviceDetails");
  const [workers, setWorkers] = useState([]);
  


  // Fetch workers from the API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:2222/workers/view");
        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, [id]); // Added id in dependencies

 

  
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
          <div className="d-flex gap-3 align-items-center">
              <button className="btn btn-light p-2" style={{ marginBottom: "-20px" }} onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem", fontWeight: "bold" }}></i>
              </button>
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

                <div className="p-0 m-0 mt-4">
                  <h6>Customer Details</h6>
                  <p className="mb-1"><i className="bi bi-person-fill me-2"></i> {booking.name}</p>
                  <p className="mb-1"><i className="bi bi-telephone-fill me-2"></i> {booking.contact}</p>
                  <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {booking.address}</p>
                  <p className="mb-1"><i className="bi bi-calendar-event-fill me-2"></i> {booking.date}</p>
                </div>

                {/* Comment Field (Notes) */}
                <div className="mt-3 position-relative" style={{ width: "500px" }}>
                  <span 
                    className="position-absolute" 
                    style={{ top: "5px", right: "10px", fontSize: "14px", color: "#0076CE", cursor: "pointer" }}
                  >
                    Edit
                  </span>
                  <textarea id="notes" className="form-control" placeholder="Notes" rows="4" style={{ resize: "none", height: "150px" }}></textarea>
                </div>
               
                {/* Worker Details */}
                 <div className="mt-4">
                  <h6>Worker Details</h6>
                  {workers.length > 0 ? (
              workers.map((worker) => (
                     
                     <div key={worker.id} className="d-flex align-items-center mb-3">
                     <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-secondary"
                              style={{
                                width: "40px",
                                height: "40px",
                                flexShrink: 0,
                                backgroundImage: `url(${worker.profilePicUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            ></div>
                            </div>
              <div className="ms-3">
              <p className="mb-1"><i className="bi bi-person-fill me-2"></i>{worker.name}</p>
<p className="mb-1"><i className="bi bi-telephone-fill me-2"></i> {worker.contactNumber}</p>
<p className="mb-1"><i className="bi bi-house-fill me-2"></i> {worker.houseNumber}</p>
<p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {worker.pincode}</p>
<p className="mb-1"><i className="bi bi-signpost-fill me-2"></i> {worker.nearbyLandmark}</p>
<p className="mb-1"><i className="bi bi-map-fill me-2"></i> {worker.district}</p>
<p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {worker.state}</p>
Explanation of Icon Choices:
        </div>
      </div>
  ))
     ) : (
    <p>No workers assigned</p>
  )}
</div>
</div>

              {/* Right Card - Service Details */}
              <div className="col-md-6">
                <div className="card rounded p-4 shadow-sm" style={{ marginTop: "60px", minHeight: "400px", maxWidth: "550px", border: "1px solid #ddd", borderRadius: "12px" }}>
                  <h5>Status update</h5>
                  <div className="p-3 mt-3 rounded" style={{ height: "400px", border: "1px solid #ccc", borderRadius: "10px" }}>
                  <table className="table" style={{ borderSpacing: "0 10px" }}>
                  <tbody>
    <tr>
      
        {new Date(booking.successDate || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })} - {new Date(booking.successDate || Date.now()).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      
    </tr>
    <tr style={{ height: "40px" }}>
      <td>Booking Successful</td>
      <td className="text-end">{booking.status === "Successful" ? "Yes" : "No"}</td>
    </tr>

    <tr style={{marginTop:"20px"}}>
      
        {new Date(booking.assignDate || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })} - {new Date(booking.assignDate || Date.now()).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      
    </tr>
    <tr style={{ height: "50px"}}>
      <td >Worker Assigned</td>
      <td className="text-end" >{workers.length > 0 ? "Yes" : "No"}</td>
    </tr>

    <tr>
     
        {new Date(booking.startDate || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })} - {new Date(booking.startDate || Date.now()).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
     
    </tr>
    <tr style={{ height: "60px" }}>
      <td>Service Started</td>
      <td className="text-end">{booking.status === "Started" ? "Yes" : "No"}</td>
    </tr>

    <tr>
     
        {new Date(booking.completeDate || Date.now()).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })} - {new Date(booking.completeDate || Date.now()).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      
    </tr>
    <tr style={{ height: "70px" }}>
      <td>Service Completed</td>
      <td className="text-end">{booking.status === "Completed" ? "Yes" : "No"}</td>
    </tr>
  </tbody>
      </table>
                    <button className="btn btn-primary w-100">Update</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewBookings;
