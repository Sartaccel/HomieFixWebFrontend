import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ViewBooking.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import Reschedule from "./Reschedule"; // Import the Reschedule component
import CancelBooking from "./CancelBooking"; // Import the CancelBooking component
import { motion, AnimatePresence } from "framer-motion";

const ViewBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Fixed missing import
  const booking = location.state?.booking || {};
  const [bookings, setBookings] = useState(booking);
  const [bookingDate, setBookingDate] = useState("");
  const [bookedDate, setBookedDate] = useState("");
  const [activeTab, setActiveTab] = useState("serviceDetails");
  const [worker, setWorker] = useState([]);
  const [serviceStarted, setServiceStarted] = useState("No");
  const [serviceCompleted, setServiceCompleted] = useState("No");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRescheduleSlider, setShowRescheduleSlider] = useState(false); // State to control Reschedule visibility
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false); // State to control CancelBooking visibility
 
 
  const handleRescheduleSuccess = (updatedDetails) => {
    setBookings((prev) => ({
      ...prev,
      status: "Rescheduled",
      reschedule: {
        selectedDate: updatedDetails.date || prev.reschedule?.selectedDate || "N/A",
        selectedtimeSlot: updatedDetails.time || prev.reschedule?.selectedtimeSlot || "N/A",
        rescheduleReason: updatedDetails.reason || prev.reschedule?.rescheduleReason || "N/A",
      },
    }));
  };
  const handleReschedule = async () => {
    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
  
      const updatedDetails = {
        date: formattedDate,
        time: selectedTimeSlot,
        reason: rescheduleReason === "other" ? otherReason : rescheduleReason,
      };
  
      console.log("Sending update:", updatedDetails);
  
      const response = await fetch(`http://localhost:2222/booking/reschedule/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedDetails),
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        alert("Booking rescheduled successfully");
  
        // Log the callback function to check if it runs
        console.log("Calling onRescheduleSuccess with:", updatedDetails);
        onRescheduleSuccess(updatedDetails);
        onClose();
      } else {
        alert("Failed to reschedule booking");
      }
    } catch (error) {
      console.error("Reschedule error:", error);
      alert("An error occurred during reschedule.");
    }
  };
    
  const [showReschedule, setShowReschedule] = useState(false);

  
  
  // Fetch workers from the API
  useEffect(() => {
    if (!id) return;

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:2222/booking/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }
        const data = await response.json();
        console.log("Fetched Booking Data:", data);

        setBookings((prev) => ({
          ...prev,
          ...data,
          reschedule: data.reschedule || prev.reschedule, // ✅ Preserve old reschedule details
        }));

        setBookingDate(data.bookingDate || "N/A");
        setBookedDate(data.bookedDate || "N/A");
        setTimeSlot(data.timeSlot || "N/A");
        setNotes(data.notes || "");

        // Set worker details
        if (data.worker) {
          setWorker(data.worker);
        } else if (data.workerId) {
          const workerResponse = await fetch(
            `http://localhost:2222/workers/view/${data.workerId}`
          );
          if (!workerResponse.ok) {
            throw new Error("Failed to fetch worker details");
          }
          const workerData = await workerResponse.json();
          console.log("Worker Data:", workerData);
          setWorker(workerData);
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);
  useEffect(() => {
    console.log("Worker Data:", worker);
  }, [worker]);

  const SetBookedDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      " - " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const updateBooking = async () => {
    if (!id) {
      alert("Error: Booking ID is missing.");
      return;
    }

    console.log("Debug: Type of serviceStarted =", typeof serviceStarted);
    console.log("Debug: Type of serviceCompleted =", typeof serviceCompleted);

    // Determine status dynamically
    let status = "";
    if (serviceCompleted !== "No") {
      status = "COMPLETED";
    } else if (serviceStarted !== "No") {
      status = "STARTED";
    } else {
      alert("Invalid status update!");
      return;
    }

    console.log("Final status being sent:", status);

    if (!status) {
      alert("Invalid status change!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:2222/booking/update-status/${id}?status=${status}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }), // ✅ Send JSON
        }
      );

      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);

      if (response.ok) {
        alert(`Booking successfully updated! Status: ${status}`);
      } else {
        alert(`Failed to update booking. Server response: ${textResponse}`);
      }
    } catch (error) {
      console.error("Network or API Error:", error);
      alert("Network error while updating booking.");
    }
  };

  const getLinePosition = () => {
    let position = 72; // Initial position for "Booking Successful"

    if (bookedDate !== "No") position = 140; // Move down when "Worker Assigned"
    if (serviceStarted !== "No") position = 217; // Move down when "Service Started"
    if (serviceCompleted !== "No") position = 290; // Move down when "Service Completed"

    return `${position}px`;
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
          <div className="navigation-bar d-flex justify-content-between align-items-center py-2 px-3 bg-white border-bottom w-100">
            <div className="d-flex gap-3 align-items-center">
              <button
                className="btn btn- p-2"
                style={{ marginBottom: "-20px" }}
                onClick={() => navigate(-1)}
              >
                <i
                  className="bi bi-arrow-left"
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                ></i>
              </button>
              <div
                className={`section ${
                  activeTab === "serviceDetails" ? "active" : ""
                }`}
                onClick={() => setActiveTab("serviceDetails")}
              >
                Service Details
              </div>
            </div>
            {/* Right side buttons */}
            <div className="d-flex gap-3 p-2" style={{ marginRight: "300px" }}>
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowRescheduleSlider(true)}
              >
                Reschedule
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => setShowCancelBookingModal(true)}
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
                    <p className="mb-0">
                      {booking.service} - ₹{bookings?.totalPrice ?? "N/A"}
                    </p>

                    <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                  </div>
                </div>

                <div className="p-0 m-0 mt-4">
                  <h6 style={{ fontWeight: "bold" }}> Customer Details</h6>

                  <p className="mb-1">
                    <i className="bi bi-person-fill me-2"></i>{" "}
                    {booking?.name ?? "N/A"}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone-fill me-2"></i>{" "}
                    {booking?.contact ?? "N/A"}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-geo-alt-fill me-2"></i>{" "}
                    {booking?.address ?? "N/A"}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-calendar-event-fill me-2"></i>{" "}
                    {booking?.date ?? "N/A"}
                  </p>
                </div>

                {/* Comment Field (Notes) */}
                <div
                  className="mt-3 position-relative"
                  style={{ width: "560px" }}
                >
                  <span
                    className="position-absolute"
                    style={{
                      top: "5px",
                      right: "15px",
                      fontSize: "14px",
                      color: "#0076CE",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </span>
                  <textarea
                    id="notes"
                    className="form-control"
                    placeholder="Notes not Available"
                    rows="3"
                    style={{
                      resize: "none",
                      height: "140px",
                      backgroundColor: "white",
                    }}
                    value={notes} // Display fetched notes
                  ></textarea>
                </div>

                {/* Worker Details */}
                <div className="mt-4">
                  <h6 style={{ fontWeight: "bold" }}>Worker Details</h6>
                  {worker ? (
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-secondary"
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundImage: worker.profilePicUrl
                            ? `url(${worker.profilePicUrl})`
                            : `url("/default-avatar.png")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div className=" d-flex flex-column mb-1">
                        <p className="mb-1">
                          <i className="bi bi-person-fill me-2"></i>{" "}
                          {worker.name}{" "}
                          <span className="ms-2" style={{ fontSize: "16px" }}>
                            <i
                              className="bi bi-star-fill"
                              style={{ color: "#FFD700" }}
                            ></i>
                            {worker.rating ? worker.rating.toFixed(1) : "4.5"}{" "}
                          </span>
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-telephone-fill me-2"></i>{" "}
                          {worker.contactNumber}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt-fill me-2"></i>{" "}
                          {worker.houseNumber},{worker.nearbyLandmark},
                          {worker.town},{worker.pincode},{worker.state},
                          {worker.district}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>No worker selected or loading...</p>
                  )}
                  <a
                    href={`/workers/view/${worker.id}`}
                    style={{
                      color: "#007bff",
                      marginLeft: "120px",
                      textDecoration: "none",
                    }}
                  >
                    View full Profile →
                  </a>
                </div>
              </div>
              {/* Right Card - Service Details */}
              <div className="col-md-6">
                <div
                  className="card rounded p-4 shadow-sm"
                  style={{
                    marginTop: "40px",
                    minHeight: "480px",
                    maxWidth: "550px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                  }}
                >
                  <h5>Status update</h5>
                  <div
                    className="p-3 mt-3 rounded"
                    style={{
                      height: "370px",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className="position-absolute"
                      style={{
                        top: getLinePosition(), // Dynamic height
                        left: "25px",
                        width: "4px",
                        backgroundColor: "black",
                        height: "75px",
                        transition: "height 0.5s ease-in-out",
                      }}
                    ></div>
                    <table className="table w-100" style={{ width: "100%" }}>
                      <tbody>
                        <tr style={{ height: "40px" }}>
                          <td className="text-start border-right">
                            <tr style={{ color: "grey" }}>
                              {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })}{" "}
                              |{" "}
                              {new Date().toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </tr>
                            Booking Successful on{" "}
                            {new Date(bookingDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                            {bookings.timeSlot ? ` | ${bookings.timeSlot}` : ""}
                          </td>
                          <td
                            className="text-end"
                            style={{ backgroundColor: "#f0f0f0" }}
                          ></td>
                        </tr>

                        <tr style={{ height: "70px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {bookedDate !== "No"
                                ? new Date(bookedDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : "Not Assigned"}
                            </span>
                            <br />
                            Worker Assigned
                          </td>

                          <td
                            className="text-end"
                            style={{ backgroundColor: "#f0f0f0" }}
                          >
                            <div className="custom-dropdown">
                              <select
                                className="no-border"
                                onChange={(e) => {
                                  setBookedDate(
                                    e.target.value === "Yes"
                                      ? new Date().toISOString()
                                      : "No"
                                  );
                                }}
                                value={bookedDate !== "No" ? "Yes" : "No"}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>
                          </td>
                        </tr>

                        <tr style={{ height: "80px" }}>
                          <td colSpan="4" className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {bookedDate !== "No"
                                ? new Date(bookedDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : "N/A"}
                            </span>
                            <br />
                            {bookings.status === "Rescheduled" &&
                            bookings.reschedule?.selectedDate ? (
                              <div>
                                <strong style={{ color: "red" }}>
                                  Rescheduled
                                </strong>
                                <div
                                  style={{ fontSize: "14px", color: "#555" }}
                                >
                                  <p>
                                    Date:{" "}
                                    {bookings.reschedule.selectedDate || "N/A"}
                                  </p>
                                  <p>
                                    Time:{" "}
                                    {bookings.reschedule.selectedtimeSlot ||
                                      "N/A"}
                                  </p>
                                  <p>
                                    Reason:{" "}
                                    {bookings.reschedule.rescheduleReason ||
                                      "N/A"}
                                  </p>
                                </div>
                              </div>
                            ) : null}{" "}
                            {/* Removes "Scheduled" if not Rescheduled */}
                          </td>
                        </tr>

                        <tr style={{ height: "70px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {serviceStarted !== "No"
                                ? new Date(serviceStarted).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : new Date().toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                            </span>
                            <br />
                            Service Started
                          </td>

                          <td
                            className="text-end "
                            style={{ backgroundColor: "#f0f0f0" }}
                          >
                            <span className="custom-dropdown">
                              <select
                                className="no-border"
                                onChange={(e) => {
                                  setServiceStarted(
                                    e.target.value === "Yes"
                                      ? new Date().toISOString()
                                      : "No"
                                  );
                                  if (e.target.value === "Yes") {
                                    setServiceCompleted("No");
                                  }
                                }}
                                value={serviceStarted !== "No" ? "Yes" : "No"}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </span>
                            {/* Display Service Started Time */}
                          </td>
                        </tr>

                        <tr style={{ height: "80px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {serviceCompleted !== "No"
                                ? new Date(serviceCompleted).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : new Date().toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                            </span>
                            <br />
                            Service Completed
                          </td>
                          <td
                            className="text-end"
                            style={{ backgroundColor: "#f0f0f0" }}
                          >
                            <span className="custom-dropdown">
                              <select
                                className="no-border"
                                onChange={(e) => {
                                  if (e.target.value === "Yes") {
                                    const completedTime =
                                      new Date().toISOString(); // Get current timestamp
                                    setServiceCompleted(completedTime); // Save it to state
                                  } else {
                                    setServiceCompleted("No");
                                  }
                                }}
                                value={serviceCompleted !== "No" ? "Yes" : "No"}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                      className="btn btn-primary w-100"
                      onClick={updateBooking}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Animate Reschedule Slider */}
          <AnimatePresence>
            {showRescheduleSlider && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowRescheduleSlider(false)}
                />

                {/* Sliding Panel */}
                <motion.div
                  className="reschedule-slider"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    type: "tween",
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Reschedule
                    id={id}
                    booking={bookings}
                    onClose={() => setShowRescheduleSlider(false)}
                    onRescheduleSuccess={handleRescheduleSuccess}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Animate Cancel Booking Modal */}
          <AnimatePresence>
            {showCancelBookingModal && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: -3 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setShowCancelBookingModal(false)}
                />

                {/* Modal */}
                <motion.div
                  className="cancel-booking-modal"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                >
                  <CancelBooking
                    id={id}
                    booking={bookings}
                    onClose={() => setShowCancelBookingModal(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ViewBookings;
