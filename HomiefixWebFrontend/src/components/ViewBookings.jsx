import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ViewBooking.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import Reschedule from "./Reschedule"; // Import the Reschedule component
import CancelBooking from "./CancelBooking"; // Import the CancelBooking component
import axios from "axios"; // Import axios
import api from "../api";

const ViewBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking || {};
  const [bookings, setBookings] = useState({});

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
  const [lineColor, setLineColor] = useState("black");
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showRescheduledRow, setShowRescheduledRow] = useState(false);
  const [rescheduledBooking, setRescheduledBooking] = useState(bookings);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBookingIdForCancellation, setSelectedBookingIdForCancellation] = useState("");
  const [isCancellationConfirmed, setIsCancellationConfirmed] = useState(false);
  const [isRescheduledConfirmed, setIsRescheduledConfirmed] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [feedback, setFeedback] = useState([]);

  // Fetch feedback for a specific booking using axios
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/feedback/byBooking/${id}`);
        console.log("Fetched Feedback Data:", response.data);

        if (Array.isArray(response.data)) {
          setFeedback(response.data);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id]);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Fetch booking details using axios
  useEffect(() => {
    if (!id) return;

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/booking/${id}`);
        console.log("Fetched Booking Data:", response.data);

        setBookings(response.data);

        setBookingDate(response.data.bookingDate || "N/A");
        setBookedDate(response.data.bookedDate || "N/A");
        setTimeSlot(response.data.timeSlot || "N/A");
        setNotes(response.data.notes || "");

        // Set worker details
        if (response.data.worker) {
          setWorker(response.data.worker);
        } else if (response.data.workerId) {
          try {
            const workerResponse = await api.get(
              `/workers/view/${response.data.workerId}`
            );
            console.log("Worker Data:", workerResponse.data);
            setWorker(workerResponse.data);
          } catch (workerErr) {
            console.error("Error fetching worker details:", workerErr);
            setWorker(null);
          }
        } else {
          setWorker(null);
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

  // Update booking status using axios
  const updateBooking = async () => {
    if (!id) {
      alert("Error: Booking ID is missing.");
      return;
    }

    console.log("Debug: Type of serviceStarted =", typeof serviceStarted);
    console.log("Debug: Type of serviceCompleted =", typeof serviceCompleted);

    let status = "";

    if (serviceStarted === "No" && serviceCompleted !== "No") {
      alert("Error: Service cannot be completed without starting first!");
      return;
    }
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
      const response = await api.put(
        `/booking/update-status/${id}?status=${status}`,
        { status }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        alert(`Booking successfully updated! Status: ${status}`);
        setIsUpdated(true);
      } else {
        alert(`Failed to update booking. Server response: ${response.data}`);
      }
    } catch (error) {
      console.error("Network or API Error:", error);
      alert("Network error while updating booking.");
    }
  };

  useEffect(() => {
    const savedServiceStarted = localStorage.getItem("serviceStarted");
    const savedServiceCompleted = localStorage.getItem("serviceCompleted");

    if (savedServiceStarted) {
      setServiceStarted(savedServiceStarted);
    }

    if (savedServiceCompleted) {
      setServiceCompleted(savedServiceCompleted);
    }
  }, []);

  const handleServiceStartedChange = (e) => {
    const value = e.target.value === "Yes" ? new Date().toISOString() : "No";
    setServiceStarted(value);
    localStorage.setItem("serviceStarted", value);

    if (value === "Yes") {
      setServiceCompleted("No");
      localStorage.setItem("serviceCompleted", "No");
    }
  };

  const handleServiceCompletedChange = (e) => {
    const value = e.target.value === "Yes" ? new Date().toISOString() : "No";
    setServiceCompleted(value);
    localStorage.setItem("serviceCompleted", value);
  };

  const getLinePosition = () => {
    let position = 72;
    let color = "black";

    if (bookedDate !== "No") {
      position = 70;
      color = "black";
    }
    if (selectedBookingId && isRescheduledConfirmed) {
      position = 150;
      color = "red";
    }

    if (serviceStarted !== "No") {
      position = 137;
      color = "black";
    }
    if (serviceCompleted !== "No") {
      position = 212;
      color = "green";
    }
    if (selectedBookingIdForCancellation && isCancellationConfirmed) {
      position = 80;
      color = "red";
    }

    return { position: `${position}px`, color };
  };

  const { position, color } = getLinePosition();

  const handleCancelBookingSuccess = (reason) => {
    setCancellationReason(reason);
    setIsCancellationConfirmed(true);
    setShowCancelBookingModal(false);
  };

  const handleCancelBookingButtonClick = (id) => {
    setSelectedBookingIdForCancellation(id);
    setShowCancelBookingModal(true);
  };

  const openRescheduleModal = () => {
    setIsRescheduleModalOpen(true);
  };

  const closeRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
  };

  const handleRescheduleSuccess = (newDate, newTime, reason) => {
    console.log("Reschedule Successful", newDate, newTime, reason);
    setIsRescheduledConfirmed(true);
    setBookings((prevBookings) =>
      selectedBookingId
        ? {
            ...booking,
            bookedDate: newDate,
            bookedTimeSlot: newTime,
            rescheduleReason: reason,
          }
        : booking
    );

    setShowRescheduledRow(true);
    closeRescheduleModal();
  };

  const handleRescheduleButtonClick = (id) => {
    setSelectedBookingId(id);
    openRescheduleModal();
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
                onClick={() => handleRescheduleButtonClick(id)}
              >
                Reschedule
              </button>

              <button
                className="btn btn-outline-danger"
                onClick={() => handleCancelBookingButtonClick(id)}
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
                      {booking.service} - ₹{bookings.totalPrice}
                    </p>

                    <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                  </div>
                </div>

                <div className="p-0 m-0 mt-2">
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
                  style={{ width: "500px" }}
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
                      height: "100px",
                      backgroundColor: "white",
                    }}
                    value={notes} // Display fetched notes
                  ></textarea>
                </div>

                {/* Worker Details */}
                <div className="mt-2">
                  <h6 style={{ fontWeight: "bold" }}>Worker Details</h6>
                  {worker ? (
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-secondary"
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundImage: worker.profilePicUrl
                            ? `url('${worker.profilePicUrl}')`
                            : `url('/default-avatar.png')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>

                      <div className=" d-flex flex-column mb-1">
                        <p className="mb-1">
                          <i className="bi bi-person-fill me-1"></i>{" "}
                          {worker.name}{" "}
                          <span
                            className="ms-1"
                            style={{
                              fontSize: "16px",
                              backgroundColor: "#d3d3d3",
                              width: "50px",
                            }}
                          >
                            <i
                              className="bi bi-star-fill"
                              style={{ color: "#FFD700" }}
                            ></i>
                            {worker.rating !== undefined &&
                            worker.rating !== null
                              ? worker.rating.toFixed(1)
                              : "4.5"}
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
                    <p>No worker assigned</p>
                  )}
                  <a
                    href={`/worker-details/worker/${worker.id}`}
                    style={{
                      color: "#007bff",
                      marginLeft: "120px",
                      textDecoration: "none",
                      marginTop: "-20px",
                    }}
                  >
                    View full Profile →
                  </a>
                </div>
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Customer Review</h6>

                  {loading ? (
                    <p>Loading...</p> // Display loading text when fetching
                  ) : error ? (
                    <p style={{ color: "red" }}>{error}</p> // Show error message if fetch fails
                  ) : feedback.length > 0 ? (
                    feedback.map((review, index) => (
                      <div key={index}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          {review.rating === 4 && (
                            <span
                              style={{
                                color: "gold",
                                fontSize: "15px",
                                backgroundColor: "#d3d3d3",
                                width: "40px",
                              }}
                            >
                              <i className="bi bi-star-fill"></i>
                            </span>
                          )}
                          <p
                            style={{
                              fontSize: "16px",
                              marginLeft: "20px",
                              marginTop: "-22px",
                              display: "inline-block",
                            }}
                          >
                            {review.rating} {/* Display the rating */}
                          </p>

                          <p
                            style={{
                              fontSize: "14px",
                              color: "#888",
                              marginTop: "-40px",
                              marginLeft: "44px",
                            }}
                          >
                            {getCurrentDate()}
                          </p>

                          {/* Display Review Comment */}
                          <p style={{ fontSize: "16px", marginTop: "-15px" }}>
                            {review.comment}
                          </p>

                          {/* Display Current Date */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No feedback available.</p> // Show message if no feedback available
                  )}
                </div>
              </div>

              {/* Right Card - Service Details */}
              <div className="col-md-6">
                <div
                  className="card rounded p-4 shadow-sm"
                  style={{
                    marginTop: "47px",
                    minHeight: "300px",
                    maxWidth: "670px",
                    marginLeft: "-20px",
                    bottom: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                  }}
                >
                  <h5>Status update</h5>
                  <div
                    className="p-3 mt-3 rounded"
                    style={{
                      height: "380px",
                      width: "600",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      position: "relative",
                    }}
                  >
                    <div
                      className="position-absolute"
                      style={{
                        top: position, // Dynamic height from the function
                        left: "0px",
                        width: "4px",
                        backgroundColor: color, // Dynamic color
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
                        {selectedBookingIdForCancellation &&
                          cancellationReason && (
                            <tr style={{ height: "40px" }}>
                              <td className="text-start border-right">
                                {/* Display booked date only if this booking is selected */}
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

                                <div
                                  className="booking-details"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <span style={{ color: "red" }}>
                                      Service Cancelled
                                    </span>
                                  </div>

                                  {/* Display the cancellation reason below the Service Canceled text */}
                                  <div style={{ fontSize: "14px" }}>
                                    {cancellationReason
                                      ? cancellationReason
                                      : "No reason provided"}
                                  </div>
                                </div>
                              </td>
                              <td
                                className="text-end"
                                style={{ backgroundColor: "#f0f0f0" }}
                              ></td>
                            </tr>
                          )}

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
                          ></td>
                        </tr>

                        {selectedBookingId && showRescheduledRow && (
                          <tr style={{ height: "40px" }}>
                            <td className="text-start border-right">
                              {console.log(bookings)}
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

                              <div
                                className="booking-details"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                  fontSize: "14px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontWeight: "bold",
                                    gap: "5px",
                                  }}
                                >
                                  <span style={{ color: "red" }}>
                                    Reschedule Service On
                                    {new Date(
                                      bookings.bookedDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                    {" | "}
                                    {bookings.bookedTimeSlot}
                                    {/* Assuming bookedTimeSlot is in the correct format */}
                                  </span>
                                </div>

                                {/* Display the cancellation reason below the Service Canceled text */}
                                <div style={{ fontSize: "14px" }}>
                                  <td>{bookings.rescheduleReason}</td>
                                </div>
                              </div>
                            </td>
                            <td
                              className="text-end"
                              style={{ backgroundColor: "#f0f0f0" }}
                            ></td>
                          </tr>
                        )}

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
                            {!isUpdated &&
                              !(
                                selectedBookingIdForCancellation &&
                                cancellationReason
                              ) && (
                                <span className="custom-dropdown">
                                  <select
                                    className="no-border"
                                    onChange={handleServiceStartedChange}
                                    value={
                                      serviceStarted !== "No" ? "Yes" : "No"
                                    }
                                  >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                  </select>
                                </span>
                              )}
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
                            {!isUpdated &&
                              !(
                                selectedBookingIdForCancellation &&
                                cancellationReason
                              ) && (
                                <span className="custom-dropdown">
                                  <select
                                    className="no-border"
                                    onChange={handleServiceCompletedChange}
                                    value={
                                      serviceCompleted !== "No" ? "Yes" : "No"
                                    }
                                  >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                  </select>
                                </span>
                              )}
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
          {/* Reschedule Slider */}
          {isRescheduleModalOpen && selectedBookingId && (
            <Reschedule
              id={selectedBookingId}
              booking={bookings}
              onClose={closeRescheduleModal}
              onRescheduleSuccess={handleRescheduleSuccess}
            />
          )}

          {/* Cancel Booking Modal */}
          {showCancelBookingModal && selectedBookingIdForCancellation && (
            <CancelBooking
              id={selectedBookingIdForCancellation}
              booking={bookings}
              onClose={() => setShowCancelBookingModal(false)}
              onCancelSuccess={handleCancelBookingSuccess}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewBookings;
