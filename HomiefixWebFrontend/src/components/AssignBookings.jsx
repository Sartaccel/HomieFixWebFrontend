import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import Reschedule from "./Reschedule"; // Import the Reschedule component
import CancelBooking from "./CancelBooking"; // Import the CancelBooking component
import "../styles/AssignBookings.css";

const AssignBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const booking = location.state?.booking || {};
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null);
  const [notes, setNotes] = useState("");
  const [showRescheduleSlider, setShowRescheduleSlider] = useState(false); // State to control Reschedule visibility
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false); // State to control CancelBooking visibility
  const navigate = useNavigate();

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
  }, []);

  // Handle worker selection and deselection
  const handleWorkerSelection = (workerId) => {
    if (selectedWorkerId === workerId) {
      // Deselect the worker if already selected
      setSelectedWorkerId(null);
      setSelectedWorkerDetails(null);
    } else {
      // Select the worker
      setSelectedWorkerId(workerId);
      const worker = workers.find((worker) => worker.id === workerId);
      setSelectedWorkerDetails(worker);
    }
  };

  // Assign worker to booking
  const assignWorker = async () => {
    if (!selectedWorkerId) {
      alert("Please select a worker");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:2222/booking/assign-worker/${id}?workerId=${selectedWorkerId}&notes=${encodeURIComponent(notes)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Worker assigned successfully");
        navigate(-1); // Navigate back after successful assignment
      } else {
        alert("Failed to assign worker");
      }
    } catch (error) {
      console.error("Error assigning worker:", error);
    }
  };

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
            {/* Left side: Back arrow + Service Details */}
            <div className="d-flex gap-3 align-items-center">
              <button className="btn btn-light p-2" style={{ marginBottom: "-20px" }} onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem", fontWeight: "bold" }}></i>
              </button>
              <div className="section active">Service Details</div>
            </div>

            {/* Right side buttons */}
            <div className="d-flex gap-3 p-2" style={{ marginRight: "300px" }}>
              <button className="btn btn-outline-primary" onClick={() => setShowRescheduleSlider(true)}>
                Reschedule
              </button>
              <button className="btn btn-outline-danger" onClick={() => setShowCancelBookingModal(true)}>
                Cancel Service
              </button>
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
                <div className="mt-3 border border-2 rounded" style={{ width: "550px" }}>
                  <textarea
                    id="notes"
                    className="form-control"
                    placeholder="Notes"
                    rows="9"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Right Card - Service Details */}
              <div className="col-md-6" style={{ borderRadius: "8px", position: "relative" }}>
                <div
                  className="card p-3"
                  style={{ width: "550px", border: "1px solid #D9D9D9", height: "480px", marginTop: "30px", borderRadius: "8px" }}
                >
                  {/* Heading */}
                  <div className="d-flex align-items-center justify-content-between" style={{ height: "94px" }}>
                    <h5 className="mb-0" style={{ marginTop: "-50px" }}>Workers</h5>
                  </div>

                  {/* Worker List (Scrollable) */}
                  <div
                    style={{
                      minHeight: "250px",
                      maxHeight: "290px",
                      overflowY: "auto",
                      overflowX: "hidden",
                      paddingRight: "10px",
                      paddingLeft: "20px",
                      marginTop: "-40px",
                    }}
                  >
                    <div className="row d-flex flex-wrap" style={{ gap: "8px" }}>
                      {workers.map((worker, index) => (
                        <div
                          key={index}
                          className="col-6"
                          style={{
                            width: "48%", // Ensure two columns fit within the parent
                            border: selectedWorkerId === worker.id ? "2px solid #0076CE" : "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "8px",
                            background: selectedWorkerId === worker.id ? "#e6f3ff" : "#f9f9f9",
                            cursor: "pointer",
                          }}
                          onClick={() => handleWorkerSelection(worker.id)}
                        >
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
                            <div>
                              <p className="mb-0">{worker.name}</p>
                              <small style={{ color: "#666666" }}>
                                {worker.town}, {worker.pincode}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Worker Details Section */}
                  {selectedWorkerDetails ? (
                    <div
                      className="mt-3 p-3 border-top"
                      style={{
                        height: "190px",
                        overflowY: "auto",
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        background: "white",
                        zIndex: 1,
                        borderRadius: "8px",
                      }}
                    >
                      <h6>Worker Details</h6>
                      <div className="d-flex gap-3 align-items-center">
                        <div
                          className="rounded-circle bg-secondary"
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundImage: `url(${selectedWorkerDetails.profilePicUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                        <div>
                          <p className="mb-0"><i className="bi bi-person-fill me-2"></i>{selectedWorkerDetails.name}</p>
                          <p className="mb-0">
                            <i className="bi bi-telephone-fill me-2"></i> {selectedWorkerDetails.contactNumber}
                          </p>
                          <p className="mb-0">
                            <i className="bi bi-geo-alt-fill me-2"></i> {selectedWorkerDetails.houseNumber}, {selectedWorkerDetails.town}, {selectedWorkerDetails.pincode}, {selectedWorkerDetails.state}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <button
                          className="btn"
                          style={{
                            background: "#0076CE",
                            color: "white",
                            width: "350px",
                            borderRadius: "14px",
                          }}
                          onClick={assignWorker}
                        >
                          Assign Worker
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center"
                      style={{ height: "120px" }}
                    >
                      <p className="mb-2">First, select a worker listed above</p>
                      <hr style={{ width: "80%", margin: "2px 0", borderColor: "#ddd" }} />
                      <button
                        className="btn"
                        style={{
                          background: selectedWorkerId ? "#0076CE" : "#999999",
                          color: "white",
                          width: "350px",
                          borderRadius: "14px",
                        }}
                        onClick={assignWorker}
                        disabled={!selectedWorkerId}
                      >
                        Assign Worker
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reschedule Slider */}
          {showRescheduleSlider && (
            <Reschedule
              id={id}
              booking={booking}
              onClose={() => setShowRescheduleSlider(false)}
            />
          )}

          {/* Cancel Booking Modal */}
          {showCancelBookingModal && (
            <CancelBooking
              id={id}
              booking={booking}
              onClose={() => setShowCancelBookingModal(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AssignBookings;