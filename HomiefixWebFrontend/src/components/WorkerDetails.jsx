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
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:2222/workers/view");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
          throw new Error("Empty response from server");
        }

        const data = JSON.parse(text);
        setWorkers(data);
      } catch (error) {
        console.error("Error fetching worker data:", error);
        setWorkers([]);
      }
    };
    fetchWorkers();
  }, []);

  const specifications = {
    "Home Appliances": ["AC", "Geyser", "Microwave", "Inverter & Stabilizers", "Water Purifier", "TV", "Fridge", "Washing Machine", "Fan"],
    Electrician: ["Switch & Socket", "Wiring", "Doorbell", "Appliance", "MCB & Submeter", "Light and Wall light", "CCTV"],
    Carpentry: ["Bed", "Cupboard & Drawer", "Door", "Windows", "Drill & Hang", "Furniture Repair"],
    Plumbing: ["Washbasin Installation", "Blockage Removal", "Shower", "Toilet", "Tap, Pipe works", "Water tank & Motor"],
    "Vehicle service": ["Batteries", "Health checkup", "Wash & Cleaning", "Denting & Painting", "Wheel car", "Vehicle AC"],
  };

  const handleFilterChange = (spec) => {
    setSelectedSpecifications((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const filteredWorkers = workers.filter((worker) =>
    selectedSpecifications.length === 0 ||
    selectedSpecifications.some((spec) =>
      worker.role.split(",").map((role) => role.trim()).includes(spec)
    )
  );

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
          <div>
            <button className="btn text-light me-2" onClick={() => navigate("/worker-details/add-worker")} style={{ backgroundColor: "#0076CE" }}>Add Worker</button>
            <button className="btn border text-black" onClick={() => setShowFilter(true)} style={{}}>Filter <i className="bi bi-funnel"></i></button>

          </div>
        </div>
        {/* Filter Modal */}
        {showFilter && (
          <div className="modal d-block" style={{ zIndex: 12111, position: "fixed", top: "150px", left: "250px" }}>
            <div className="modal-lg-dialog" style={{ width: "81%" }}>
              <div className="modal-content">
                <div className="modal-body">
                  <div className="row flex-nowrap">
                    {Object.entries(specifications).map(([category, specs]) => (
                      <div key={category} className="col" style={{ minWidth: "200px" }}>
                        <div className="card h-100">
                          <div className="card-header">
                            <h6 className="mb-0">{category}</h6>
                          </div>
                          <div className="card-body">
                            {specs.map((spec) => (
                              <div key={spec} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={spec}
                                  checked={selectedSpecifications.includes(spec)}
                                  onChange={() => handleFilterChange(spec)}
                                />
                                <label className="form-check-label" htmlFor={spec}>{spec}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" modal-footer">
                  <button className="btn btn-danger" onClick={() => setShowFilter(false)}>Cancel</button>
                  <button className="btn" style={{ backgroundColor: "#0076CE", color: "white" }} onClick={() => setShowFilter(false)}>Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div style={{ overflow: "hidden", padding: "10px 15px" }}>
          <div style={{ maxHeight: "77vh", overflowY: "auto", border: "1px solid #dee2e6" }}>
            <table className="table table-hover" style={{ width: "100%", marginBottom: "0", tableLayout: "fixed" }}>
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                <tr>
                  <th style={{ width: "15%", padding: "12px", verticalAlign: "middle" }}>Name</th>
                  <th style={{ width: "28%", padding: "12px", verticalAlign: "middle" }}>Service</th>
                  <th style={{ width: "11%", padding: "12px", verticalAlign: "middle" }}>Contact</th>
                  <th style={{ width: "7%", padding: "12px", verticalAlign: "middle" }}>Rating</th>
                  <th style={{ width: "30%", padding: "12px", verticalAlign: "middle" }}>Address</th>
                  <th style={{ width: "12%", padding: "12px", verticalAlign: "middle" }}>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.workerId || worker.contactNumber} onClick={() => navigate(`/worker-details/worker/${worker.id}`)} style={{ cursor: "pointer" }}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src={worker.profilePicUrl || alenSamImg} alt={worker.name} className="square-circle me-2" width="40" height="40" />
                          {worker.name}
                        </div>
                      </td>
                      <td>{worker.role.replace(/,/g, ", ")}</td>
                      <td>{worker.contactNumber}</td>
                      <td><i className="bi bi-star-fill text-warning me-1"></i>{worker.averageRating || "N/A"}</td>
                      <td>{`${worker.houseNumber}, ${worker.town}, ${worker.nearbyLandmark}, ${worker.district}, ${worker.state}, ${worker.pincode}`}</td>
                      <td>{worker.joiningDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No workers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetails;