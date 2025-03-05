import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import closeDate from "../assets/close date.png"; // Import the close date icon
import Reschedule from "./Reschedule"; // Import the Reschedule component
import CancelBooking from "./CancelBooking"; // Import the CancelBooking component
import "../styles/AssignBookings.css";
import bookingDetails from "../assets/BookingDetails.png";

const AssignBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const booking = location.state?.booking || {};
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null);
  const [notes, setNotes] = useState(booking.notes || "");
  const [showRescheduleSlider, setShowRescheduleSlider] = useState(false);
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [isRescheduleHovered, setIsRescheduleHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [rescheduledDate, setRescheduledDate] = useState(booking.date);
  const [rescheduledTimeslot, setRescheduledTimeslot] = useState(
    booking.timeslot
  );
  const navigate = useNavigate();

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  useEffect(() => {
    const savedDate = localStorage.getItem("rescheduledDate");
    const savedTimeslot = localStorage.getItem("rescheduledTimeslot");

    if (savedDate && savedTimeslot) {
      setRescheduledDate(savedDate);
      setRescheduledTimeslot(savedTimeslot);
    }
  }, []);

  // Handle worker selection and deselection
  const handleWorkerSelection = (workerId) => {
    if (selectedWorkerId === workerId) {
      setSelectedWorkerId(null);
      setSelectedWorkerDetails(null);
    } else {
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
        `http://localhost:2222/booking/assign-worker/${id}?workerId=${selectedWorkerId}&notes=${encodeURIComponent(
          notes
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Worker assigned successfully");
        navigate(-1);
      } else {
        alert("Failed to assign worker");
      }
    } catch (error) {
      console.error("Error assigning worker:", error);
    }
  };

  // Save notes to the booking
  const saveNotes = async () => {
    try {
      const response = await fetch(
        `http://localhost:2222/booking/update-notes/${id}?notes=${encodeURIComponent(
          notes
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Notes saved successfully");
      } else {
        alert("Failed to save notes");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handleReschedule = (newDate, newTimeslot) => {
    setRescheduledDate(newDate);
    setRescheduledTimeslot(newTimeslot);
    localStorage.setItem("rescheduledDate", newDate);
    localStorage.setItem("rescheduledTimeslot", newTimeslot);
    setShowRescheduleSlider(false);
  };

  const undoReschedule = async () => {
    try {
      const formattedDate = encodeURIComponent(booking.date);
      const encodedTimeSlot = encodeURIComponent(booking.timeslot);
      const encodedReason = encodeURIComponent("Undo rescheduling");

      const response = await fetch(
        `http://localhost:2222/booking/reschedule/${id}?selectedDate=${formattedDate}&selectedTimeSlot=${encodedTimeSlot}&rescheduleReason=${encodedReason}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setRescheduledDate(booking.date);
        setRescheduledTimeslot(booking.timeslot);
        localStorage.removeItem("rescheduledDate");
        localStorage.removeItem("rescheduledTimeslot");
        alert("Rescheduling undone successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to undo rescheduling:", errorText);
        alert(`Failed to undo rescheduling: ${errorText}`);
      }
    } catch (error) {
      console.error("Error undoing rescheduling:", error);
      alert("An error occurred while undoing rescheduling.");
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("rescheduledDate");
      localStorage.removeItem("rescheduledTimeslot");
    };
  }, []);

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          {/* Header */}
          <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
            <h2 className="heading align-items-center mb-0">Booking Details</h2>
            <div className="header-right d-flex align-items-center gap-3">
              <div className="input-group" style={{ width: "300px" }}>
                <input
                  type="text"
                  className="form-control search-bar"
                  placeholder="Search"
                />
                <span className="input-group-text">
                  <img src={search} alt="Search" width="20" />
                </span>
              </div>
              <img
                src={notification}
                alt="Notifications"
                width="40"
                className="cursor-pointer"
              />
              <img
                src={profile}
                alt="Profile"
                width="40"
                className="cursor-pointer"
              />
            </div>
          </header>

          {/* Navigation Bar */}
          <div className="navigation-bar d-flex justify-content-between align-items-center py-3 px-3 bg-white border-bottom w-100">
            <div className="d-flex gap-3 align-items-center">
              <button
                className="btn btn-light p-2"
                style={{ marginBottom: "-20px" }}
                onClick={() => navigate(-1)}
              >
                <i
                  className="bi bi-arrow-left"
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                ></i>
              </button>
              <div className="section active">Service Details</div>
            </div>

            <div className="d-flex gap-3 p-2" style={{ marginRight: "300px" }}>
              <button
                className="btn"
                onClick={() => setShowRescheduleSlider(true)}
                onMouseEnter={() => setIsRescheduleHovered(true)}
                onMouseLeave={() => setIsRescheduleHovered(false)}
                style={{
                  border: "1px solid #0076CE",
                  backgroundColor: isRescheduleHovered
                    ? "#0076CE"
                    : "transparent",
                  color: isRescheduleHovered ? "white" : "#0076CE",
                }}
              >
                Reschedule
              </button>

              <button
                className="btn"
                onClick={() => setShowCancelBookingModal(true)}
                onMouseEnter={() => setIsCancelHovered(true)}
                onMouseLeave={() => setIsCancelHovered(false)}
                style={{
                  border: "1px solid #B8141A",
                  backgroundColor: isCancelHovered ? "#B8141A" : "transparent",
                  color: isCancelHovered ? "white" : "#B8141A",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Cancel Service
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="container mt-5 pt-4">
            <div
              className="row justify-content-between"
              style={{ marginTop: "60px", marginLeft: "30px" }}
            >
              {/* Left Card - Booking Information */}
              <div className="col-md-6">
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ marginTop: "50px" }}
                >
                  <div
                    className="rounded-circle bg-secondary"
                    style={{ width: "40px", height: "40px" }}
                  ></div>
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
                    <i className="bi bi-person fw-bold me-2"></i> {booking.name}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone fw-bold me-2"></i> {booking.contact}
                  </p>
                  <p
                    className="mb-1"
                    style={{
                      backgroundColor:
                        rescheduledDate !== booking.date
                          ? "#EDF3F7"
                          : "transparent",
                      borderRadius: "5px",
                      display: "inline-block",  
                      padding: rescheduledDate !== booking.date ? "0px 10px 0px 0px" : "0",
                     }}
                  >
                    {rescheduledDate !== booking.date ? (
                      <img
                        src={closeDate}
                        alt="Close"
                        width="25"
                        style={{
                          cursor: "pointer",
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }}
                        onClick={undoReschedule}
                      />
                    ) : (
                      <img
                        src={bookingDetails}
                        alt="Booking Details"
                        className="menu-icon" // Removed `me-2` to prevent right spacing
                        style={{
                          width: "17px",
                          height: "17px",
                        }}
                      />
                    )}
                    {formatDate(rescheduledDate)} |{" "}
                    {rescheduledTimeslot || "Not Available"}
                  </p>

                  <p className="mb-1">
                    <i className="bi bi-geo-alt fw-bold me-2"></i> {booking.address}
                  </p>
                </div>

                {/* Comment Field (Notes) */}
                <div
                  className="mt-3 position-relative"
                  style={{ width: "550px" }}
                >
                  <textarea
                    id="notes"
                    className="form-control"
                    placeholder="Notes"
                    rows="8"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      height: "237px", // Fixed height
                      resize: "none", // Prevents resizing
                      padding: "10px", // Ensures proper spacing
                      width: "100%", // Ensures it fills the container
                      boxSizing: "border-box", // Prevents overflow issues
                    }}
                  ></textarea>
                  <button
                    className="btn position-absolute"
                    onClick={saveNotes}
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}
                    style={{
                      bottom: "10px",
                      right: "10px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      color: isSaveHovered ? "white" : "#0076CE",
                      backgroundColor: isSaveHovered
                        ? "#0076CE"
                        : "transparent",
                      border: "1px solid #0076CE",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Right Card - Service Details */}
              <div
                className="col-md-6"
                style={{ borderRadius: "8px", position: "relative" }}
              >
                <div
                  className="card p-3"
                  style={{
                    width: "550px",
                    border: "1px solid #D9D9D9",
                    height: "480px",
                    marginTop: "30px",
                    borderRadius: "8px",
                  }}
                >
                  {/* Heading */}
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ height: "94px" }}
                  >
                    <h5 className="mb-0" style={{ marginTop: "-50px" }}>
                      Workers
                    </h5>
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
                    <div
                      className="row d-flex flex-wrap"
                      style={{ gap: "8px" }}
                    >
                      {workers.map((worker, index) => (
                        <div
                          key={index}
                          className="col-6"
                          style={{
                            width: "48%",
                            border:
                              selectedWorkerId === worker.id
                                ? "2px solid #0076CE"
                                : "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "8px",
                            background:
                              selectedWorkerId === worker.id
                                ? "#e6f3ff"
                                : "#f9f9f9",
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
                          <div className="d-flex align-items-center gap-2">
                            <p className="mb-0">
                              <i className="bi bi-person-fill me-2"></i>
                              {selectedWorkerDetails.name}
                            </p>
                            <span
                              style={{
                                backgroundColor: "#f0f0f0",
                                color: "#333",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "14px",
                              }}
                            >
                              <i
                                className="fas fa-star"
                                style={{ color: "#FFD700", marginRight: "4px" }}
                              ></i>
                              {selectedWorkerDetails.averageRating || "N/A"}
                            </span>
                          </div>
                          <p className="mb-0">
                            <i className="bi bi-telephone-fill me-2"></i>{" "}
                            {selectedWorkerDetails.contactNumber}
                          </p>
                          <p className="mb-0">
                            <i className="bi bi-geo-alt-fill me-2"></i>{" "}
                            {selectedWorkerDetails.houseNumber},{" "}
                            {selectedWorkerDetails.town},{" "}
                            {selectedWorkerDetails.pincode},{" "}
                            {selectedWorkerDetails.state}
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
                      <p className="mb-2">
                        First, select a worker listed above
                      </p>
                      <hr
                        style={{
                          width: "80%",
                          margin: "2px 0",
                          borderColor: "#ddd",
                        }}
                      />
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
              onReschedule={handleReschedule}
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
