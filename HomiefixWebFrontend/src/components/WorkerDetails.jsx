import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import alenSamImg from "../assets/home1.png";

import { FaUser, FaPhone, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import 'bootstrap-icons/font/bootstrap-icons.css';

const FilterModal = ({ show, handleClose }) => {
  return (
    <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Filter Options</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-wrap gap-3">
              <div className="card p-2">
                <h6>Home appliances</h6>
                {['AC', 'Geyser', 'Microwave', 'Inverter', 'Water purifier', 'TV', 'Fridge', 'Washing machine', 'Fan'].map(item => (
                  <div key={item}>
                    <input type="checkbox" id={item} /> <label htmlFor={item}>{item}</label>
                  </div>
                ))}
              </div>
              <div className="card p-2">
                <h6>Electrician</h6>
                {['Switch & Socket', 'Wiring', 'Doorbell', 'Appliance', 'MCB', 'Light'].map(item => (
                  <div key={item}>
                    <input type="checkbox" id={item} /> <label htmlFor={item}>{item}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkerDetails = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [activeTab, setActiveTab] = useState('service');

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

  const handleAddWorkerClick = () => {
    navigate("/worker-details/add-worker");
  };

  return (
    <div>
      <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
        <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Worker Details</h2>
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
          <div className="d-flex gap-3">
            <button className="btn text-light" onClick={handleAddWorkerClick} style={{ backgroundColor: "#0076CE" }}>Add Worker</button>
            <button className="btn btn-light" onClick={() => setShowFilter(true)}>Filter <i className="bi bi-funnel" /></button>
          </div>
        </div>

        {!selectedWorker ? (
          <div style={{ overflow: 'hidden', padding: '10px 15px' }}>
            <div style={{ maxHeight: '80vh', overflowY: 'auto', border: '1px solid #dee2e6' }}>
              <table className="table table-hover" style={{ width: '100%', marginBottom: '0', tableLayout: 'fixed' }}>
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                  <tr>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Name</th>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Service</th>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Contact</th>
                    <th style={{ width: '10%', padding: '12px', verticalAlign: 'middle' }}>Rating</th>
                    <th style={{ width: '30%', padding: '12px', verticalAlign: 'middle' }}>Address</th>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Joining Date</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker, index) => (
                    <tr key={index} onClick={() => setSelectedWorker(worker)} style={{ cursor: 'pointer' }}>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={worker.profilePicUrl || alenSamImg} alt={worker.name} className="square-circle me-2" width="40" height="40" />
                          {worker.name}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>{worker.role}</td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>{worker.contactNumber}</td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {worker.averageRating || "N/A"}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        {`${worker.houseNumber}, ${worker.town}, ${worker.nearbyLandmark}, ${worker.district}, ${worker.state}, ${worker.pincode}`}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>{worker.joiningDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="row col-12 d-flex justify-content-between">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <div className="card shadow-sm p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-2">Role:</h6>
                        <button className="btn btn-outline-dark rounded-pill me-1" style={{ fontSize: "13px" }}>Plumber</button>
                        <button className="btn btn-outline-dark rounded-pill" style={{ fontSize: "13px" }}>Electrician</button>
                      </div>
                      <a href="#" className="text-primary fw-bold small">Edit</a>
                    </div>
                    <div className="d-flex align-items-center">
                      <img src={selectedWorker.image} alt={selectedWorker.name} className="square-circle me-3" width="70" height="70" />
                      <div>
                        <h6 className="mb-1"><FaUser className="me-1" /> {selectedWorker.name}</h6>
                        <small><FaPhone className="me-1" /> {selectedWorker.contact}</small>
                        <div className="d-flex align-items-center mt-1">
                          <span className="me-1">Rating:</span>
                          {[...Array(4)].map((_, i) => (<FaStar key={i} className="text-warning small-icon" />))}
                          <FaStar className="text-secondary small-icon" />
                          <small className="ms-1">{selectedWorker.rating}</small>
                        </div>
                      </div>
                    </div>
                    <small className="text-muted d-block mt-2"><FaMapMarkerAlt className="me-1" />{selectedWorker.address}</small>
                    <div className="mt-3">
                      <small className="text-muted d-block">Joining Date: <strong>{selectedWorker.joinDate}</strong></small>
                      <small className="text-muted d-block">Aadhaar: <strong>**** **** {selectedWorker.aadhaar?.slice(-4) || "N/A"}</strong></small>
                      <small className="text-muted d-block">Language: <strong>{selectedWorker.languages?.join(', ') || "N/A"}</strong></small>
                      <small className="text-muted d-block">Total Service: <strong>{selectedWorker.totalService || "N/A"}</strong></small>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card p-3">
                    <div className="d-flex border-bottom">
                      {["service", "inProgress", "reviews"].map((tab) => (
                        <div key={tab} className={`me-2 px-4 py-2 ${activeTab === tab ? "btn-primary" : "btn-light"}`} onClick={() => setActiveTab(tab)} style={{ cursor: "pointer", borderBottom: activeTab === tab ? "3px solid black" : "none" }}>
                          {tab === "service" && "Service Details"}
                          {tab === "inProgress" && "In Progress"}
                          {tab === "reviews" && "Reviews"}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      {activeTab === "service" && (
                        <div>
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>S.no</th>
                                <th>Service</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Rating</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workers.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.service}<div className="text-primary">ID:{item.ID}</div></td>
                                  <td>{item.name}<div className="text-muted">{item.contact}</div></td>
                                  <td>{item.Date}<span className="text-success">{item.status}</span></td>
                                  <td><FaStar color="gold" /> {item.rating}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {activeTab === "inProgress" && <h5 className="text-center text-muted">In Progress Content Here</h5>}
                      {activeTab === "reviews" && <h5 className="text-center text-muted">Reviews Content Here</h5>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <FilterModal show={showFilter} handleClose={() => setShowFilter(false)} />
      </div>
    </div>
  );
};

export default WorkerDetails;