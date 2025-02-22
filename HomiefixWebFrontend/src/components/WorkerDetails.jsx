import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import alenSamImg from "../assets/home1.png";

import 'bootstrap/dist/css/bootstrap.min.css';
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
  const [workers, setWorkers] = useState([]); // State to store worker data
  const [showFilter, setShowFilter] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [activeTab, setActiveTab] = useState('service');

  // Fetch worker data from the API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:2222/workers/view");
        const data = await response.json();
        setWorkers(data); // Set the worker data
      } catch (error) {
        console.error("Error fetching worker data:", error);
      }
    };

    fetchWorkers();
  }, []);

  const handleAddWorkerClick = () => {
    navigate("/worker-details/add-worker"); // Navigate to the add-worker route
  };

  return (
    <div>
      {/* Navbar */}
      <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
        <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>WorkerDetails</h2>
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

      {/* Main Content */}
      <div className="container pt-5" style={{ paddingTop: "80px" }}>
        {/* Header with Filter Button */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5" style={{marginRight:"25px"}}>
          <h5 className=" px-3 pb-2 text-black mx-3" style={{ borderBottom: "4px solid #000" }}>
            Worker Details
          </h5>

          <div className="d-flex gap-3">
            <button
              className="btn text-light"
              onClick={handleAddWorkerClick}
              style={{ backgroundColor: "#0076CE" }}
            >
              Add Worker
            </button>
            <button className="btn btn-light" onClick={() => setShowFilter(true)}>
              Filter <i className="bi bi-funnel" />
            </button>
          </div>
        </div>

        {/* Worker Table */}

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
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>
                        <img
                          src={worker.profilePicUrl || alenSamImg}
                          alt={worker.name}
                          className="square-circle me-2"
                          width="40"
                          height="40"
                        />
                        {worker.name}
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
          // Worker Details Section
          <div className="card mt-4">
            <div className="card-body">
              <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={() => setSelectedWorker(null)}
              >
                ← Back
              </button>

              {/* Layout with Flexbox */}
              <div className="d-flex">
                {/* Left: Worker Profile */}
                <div className="w-50 pe-3">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={selectedWorker.profilePicUrl || alenSamImg}
                      alt={selectedWorker.name}
                      className="square-circle me-3"
                      width="100"
                      height="100"
                    />
                    <div>
                      <h5>{selectedWorker.name}</h5>
                      <p><strong>Role:</strong> {selectedWorker.role}</p>
                      <p><strong>Contact:</strong> {selectedWorker.contactNumber}</p>
                      <p><strong>Address:</strong> {`${selectedWorker.houseNumber}, ${selectedWorker.town}, ${selectedWorker.nearbyLandmark}, ${selectedWorker.district}, ${selectedWorker.state}, ${selectedWorker.pincode}`}</p>
                      <p><strong>Joining Date:</strong> {selectedWorker.joiningDate}</p>
                      <p>
                        <strong>Rating:</strong>
                        <i className="bi bi-star-fill text-warning mx-1"></i>
                        {selectedWorker.averageRating || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Tabs Section */}
                <div className="w-50 p-3 card">
                  {/* Section Tabs */}
                  <div className="d-flex mb-3 ">
                    <div
                      className={`me-2 px-3 py-2 ${activeTab === 'service' ? 'btn-primary' : 'btn-light'}`}
                      onClick={() => setActiveTab('service')}
                      style={{ cursor: 'pointer', borderBottom: activeTab === 'service' ? '2px solid black' : 'none', }}
                    >
                      Service Details
                    </div>
                    <div
                      className={`me-2 px-3 py-2 ${activeTab === 'inProgress' ? 'btn-primary' : 'btn-light'}`}
                      onClick={() => setActiveTab('inProgress')}
                      style={{ cursor: 'pointer', borderBottom: activeTab === 'inProgress' ? '2px solid black' : 'none' }}
                    >
                      In Progress
                    </div>
                    <div
                      className={`px-3 py-2 ${activeTab === 'reviews' ? 'btn-primary' : 'btn-light'}`}
                      onClick={() => setActiveTab('reviews')}
                      style={{ cursor: 'pointer', borderBottom: activeTab === 'reviews' ? '2px solid black' : 'none' }}
                    >
                      Reviews
                    </div>
                  </div>
                  <div>
                    {/* Section Content */}
                    <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                      {/* Service Tab: Table + Details */}
                      {activeTab === 'service' && (
                        <div>
                          <table className="table table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>S.No</th>
                                <th>Service</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Rating</th>
                              </tr>
                              <tr>
                                <td>1</td>
                                <td>plumber</td>
                                <td>vino</td>
                                <td>05-04-1999</td>
                                <td>4</td>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedWorker.services?.length > 0 ? (
                                selectedWorker.services.map((service, idx) => (
                                  <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{service}</td>
                                    <td>{selectedWorker.name}</td>
                                    <td>
                                      <i className="bi bi-star-fill text-warning me-1"></i>
                                      {selectedWorker.averageRating || "N/A"}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* In Progress Tab */}
                      {activeTab === 'inProgress' && (
                        <div>
                          {selectedWorker.inProgress?.length > 0 ? (
                            selectedWorker.inProgress.map((task, idx) => (
                              <li key={idx}>{task}</li>
                            ))
                          ) : (
                            <table className="table table-bordered">
                              <thead className='table-light'>
                                <tr>
                                  <th>S.No</th>
                                  <th>Service</th>
                                  <th>Name</th>
                                  <th>Date</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                            </table>
                          )}
                        </div>
                      )}

                      {/* Reviews Tab */}
                      {activeTab === 'reviews' && (
                        <ul>
                          {selectedWorker.reviews?.length > 0 ? (
                            selectedWorker.reviews.map((review, idx) => (
                              <li key={idx}>{review}</li>
                            ))
                          ) : (
                            <p>No reviews available.</p>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Filter Modal */}
        <FilterModal show={showFilter} handleClose={() => setShowFilter(false)} />
      </div>
    </div>
  );
};

export default WorkerDetails;