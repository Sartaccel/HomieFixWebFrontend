import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import alenSamImg from "../assets/home1.png";

const WorkerDetails = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:2222/workers/view");
        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error("Error fetching worker data:", error);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
        <h2 className="heading mb-0" style={{ marginLeft: "31px" }}>Worker Details</h2>
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

      <div className="container pt-5" style={{ paddingTop: "80px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5" style={{ marginRight: "25px" }}>
          <h5 className="px-3 pb-2 text-black mx-3" style={{ borderBottom: "4px solid #000" }}>Worker Details</h5>
          <button className="btn text-light" onClick={() => navigate("/worker-details/add-worker")} style={{ backgroundColor: "#0076CE" }}>
            Add Worker
          </button>
        </div>
        
        {/* Main Content */}
        <div style={{ overflow: "hidden", padding: "10px 15px" }}>
          <div style={{ maxHeight: "77vh", overflowY: "auto", border: "1px solid #dee2e6" }}>
            <table className="table table-hover" style={{ width: "100%", marginBottom: "0", tableLayout: "fixed" }}>
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                <tr>
                  <th style={{ width: "15%", padding: "12px", verticalAlign: "middle" }}>Name</th>
                  <th style={{ width: "15%", padding: "12px", verticalAlign: "middle" }}>Service</th>
                  <th style={{ width: "15%", padding: "12px", verticalAlign: "middle" }}>Contact</th>
                  <th style={{ width: "10%", padding: "12px", verticalAlign: "middle" }}>Rating</th>
                  <th style={{ width: "30%", padding: "12px", verticalAlign: "middle" }}>Address</th>
                  <th style={{ width: "15%", padding: "12px", verticalAlign: "middle" }}>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker.workerId} onClick={() => navigate(`/worker-details/${worker.workerId}`)} style={{ cursor: "pointer" }}>
                    <td style={{ verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={worker.profilePicUrl || alenSamImg} alt={worker.name} className="square-circle me-2" width="40" height="40" />
                        {worker.name}
                      </div>
                    </td>
                    <td style={{ verticalAlign: "middle" }}>{worker.role}</td>
                    <td style={{ verticalAlign: "middle" }}>{worker.contactNumber}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      {worker.averageRating || "N/A"}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {`${worker.houseNumber}, ${worker.town}, ${worker.nearbyLandmark}, ${worker.district}, ${worker.state}, ${worker.pincode}`}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>{worker.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetails;
