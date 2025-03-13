import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ViewBooking.css";
import Reschedule from "./Reschedule";
import CancelBooking from "./CancelBooking";
import Header from "./Header";
import api from "../api";

const ViewBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookings = location.state?.booking || {};
  const [booking, setBooking] = useState("");
  const [bookedDate, setBookedDate] = useState("");
  const [activeTab, setActiveTab] = useState("serviceDetails");
  const [worker, setWorker] = useState([]);
  const [serviceStarted, setServiceStarted] = useState("No");
  const [serviceCompleted, setServiceCompleted] = useState("No");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showRescheduledRow, setShowRescheduledRow] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBookingIdForCancellation, setSelectedBookingIdForCancellation] = useState("");
  const [isCancellationConfirmed, setIsCancellationConfirmed] = useState(false);
  const [isRescheduledConfirmed, setIsRescheduledConfirmed] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [isRescheduleHovered, setIsRescheduleHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [bookingStatuses, setBookingStatuses] = useState(() => {
    const savedStatuses = localStorage.getItem("bookingStatuses");
    return savedStatuses ? JSON.parse(savedStatuses) : {};
  });
  const [statuses, setStatuses] = useState(bookingStatuses);

  // Fetch feedback for a specific booking using axios
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/feedback/byBooking/${id}`);
        if (Array.isArray(response.data)) setFeedback(response.data);
        else throw new Error("Unexpected data format");
      } catch (error) {
        setError(error.message);
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFeedback();
  }, [id]);

  // Save notes to the backend using axios
  const saveNotes = async () => {
    try {
      const response = await api.patch(`/booking/update-notes/${id}`, { notes });
      if (response.status === 200) alert("Notes saved successfully");
      else alert("Failed to save notes");
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  // Get the current date
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  // Fetch booking details using axios
  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/booking/${id}`);
        const data = response.data;
        if (data && data.bookingDate && data.bookedDate) {
          setBooking(data);
          setNotes(data.notes || "");
          setError(null);
        } else console.error("Invalid booking data", data);

        // Fetch worker details
        if (data.worker) setWorker(data.worker);
        else if (data.workerId) {
          const workerResponse = await api.get(`/workers/view/${data.workerId}`);
          setWorker(workerResponse.data);
        } else setWorker(null);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Update booking status using axios
  const updateBooking = async () => {
    const serviceStarted = bookingStatuses[id]?.serviceStarted;
    const serviceCompleted = bookingStatuses[id]?.serviceCompleted;

    if (!id) {
      alert("Error: Booking ID is missing.");
      return;
    }

    let status = "";
    if (serviceStarted === "No" && serviceCompleted !== "No") {
      alert("Error: Service cannot be completed without starting first!");
      return;
    }
    if (serviceCompleted !== "No") status = "COMPLETED";
    else if (serviceStarted !== "No") status = "STARTED";
    else {
      alert("Invalid status update!");
      return;
    }

    try {
      const response = await api.put(`/booking/update-status/${id}?status=${status}`, { status });
      if (response.status === 200) {
        alert(`Booking successfully updated! Status: ${status}`);
        setIsUpdated(true);
      } else alert(`Failed to update booking. Server response: ${response.data}`);
    } catch (error) {
      console.error("Network or API Error:", error);
      alert("Network error while updating booking.");
    }
  };

  // Handle service started change
  const handleServiceStartedChange = (e, id) => {
    const value = e.target.value === "Yes" ? new Date().toISOString() : "No";
    setBookingStatuses((prevStatuses) => {
      const updatedStatuses = { ...prevStatuses, [id]: { ...prevStatuses[id], serviceStarted: value } };
      localStorage.setItem("bookingStatuses", JSON.stringify(updatedStatuses));
      return updatedStatuses;
    });

    if (value === "Yes") {
      setBookingStatuses((prevStatuses) => {
        const updatedStatuses = { ...prevStatuses, [id]: { ...prevStatuses[id], serviceCompleted: "No" } };
        localStorage.setItem("bookingStatuses", JSON.stringify(updatedStatuses));
        return updatedStatuses;
      });
    }
  };

  // Handle service completed change
  const handleServiceCompletedChange = (e, id) => {
    const value = e.target.value === "Yes" ? new Date().toISOString() : "No";
    setBookingStatuses((prevStatuses) => {
      const updatedStatuses = { ...prevStatuses, [id]: { ...prevStatuses[id], serviceCompleted: value } };
      localStorage.setItem("bookingStatuses", JSON.stringify(updatedStatuses));
      return updatedStatuses;
    });
  };

  // Get line position for status update
  const getLinePosition = () => {
    let position = 72;
    let color = "black";

    if (bookedDate !== "No") {
      position = 70;
      color = "black";
    }
    if (selectedBookingId && showRescheduledRow) {
      position = 150;
      color = "#C14810";
    }
    if (bookingStatuses[booking.id]?.serviceStarted !== "No") {
      position = 137;
      color = "black";
    }
    if (bookingStatuses[booking.id]?.serviceCompleted !== "No") {
      position = 212;
      color = "#1F7A45";
    }
    if (selectedBookingIdForCancellation && isCancellationConfirmed) {
      position = 80;
      color = "#AE1319";
    }

    return { position: `${position}px`, color };
  };

  const { position, color } = getLinePosition();

  // Handle cancel booking success
  const handleCancelBookingSuccess = (reason) => {
    setCancellationReason(reason);
    setIsCancellationConfirmed(true);
    setShowCancelBookingModal(false);
  };

  // Handle cancel booking button click
  const handleCancelBookingButtonClick = (id) => {
    setSelectedBookingIdForCancellation(id);
    setShowCancelBookingModal(true);
  };

  // Handle reschedule success
  const handleRescheduleSuccess = (newDate, newTime, reason) => {
    setIsRescheduledConfirmed(true);
    setBooking((prevBooking) => ({
      ...prevBooking,
      bookedDate: newDate,
      bookedTimeSlot: newTime,
      rescheduleReason: reason,
    }));
    setShowRescheduledRow(true);
    setIsRescheduleModalOpen(false);
  };

  // Handle reschedule button click
  const handleRescheduleButtonClick = (id) => {
    setSelectedBookingId(id);
    setIsRescheduleModalOpen(true);
  };

  // Handle notes change
  const handleNotesChange = (e) => setNotes(e.target.value);

  // Handle update notes using axios
  const handleUpdateNotes = async () => {
    if (!id || !notes) return;
    setLoading(true);
    try {
      localStorage.setItem("notes", notes);
      const response = await api.patch(`/booking/update-notes/${id}`, { notes });
      setNotes(response.data.notes);
      localStorage.setItem("notes", response.data.notes);
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get text color for status
  const getTextColor = (status) => (status !== "No" ? "green" : "");

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />


          {/* Navigation Bar */}
          <div className="navigation-bar d-flex justify-content-between align-items-center py-2 px-3 bg-white border-bottom w-100">
            <div className="d-flex gap-3 align-items-center">
              <button className="btn btn- p-2" style={{ marginBottom: "-20px" }} onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem", fontWeight: "bold" }}></i>
              </button>
              <div className={`section ${activeTab === "serviceDetails" ? "active" : ""}`} onClick={() => setActiveTab("serviceDetails")}>
                Service Details
              </div>
            </div>
            <div className="d-flex gap-3 p-2" style={{ marginRight: "300px" }}>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleRescheduleButtonClick(id)}
                onMouseEnter={() => setIsRescheduleHovered(true)}
                onMouseLeave={() => setIsRescheduleHovered(false)}
                style={{
                  border: "1px solid #0076CE",
                  backgroundColor: isRescheduleHovered ? "#0076CE" : "transparent",
                  color: isRescheduleHovered ? "white" : "#0076CE",
                }}
              >
                Reschedule
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleCancelBookingButtonClick(id)}
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
            <div className="row justify-content-between" style={{ marginTop: "60px", marginLeft: "30px" }}>
              {/* Left Card - Booking Information */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2" style={{ marginTop: "50px" }}>
                  <div className="rounded-circle bg-secondary" style={{ width: "40px", height: "40px" }}></div>
                  <div>
                    <p className="mb-0">
                      {bookings.service} - ₹{booking.totalPrice}
                    </p>
                    <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                  </div>
                </div>


                {/* Customer Details */}
                <div className="p-0 m-0 mt-2">
                  {booking ? (
                    <>
                      <h6 style={{ fontWeight: "bold" }}>Customer Details</h6>
                      <p className="mb-1">
                        <i className="bi bi-person me-2"></i> {bookings?.name ?? "N/A"}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-telephone me-2"></i> {bookings?.contact ?? "N/A"}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-geo-alt me-2"></i> {bookings?.address ?? "N/A"}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-calendar-event me-2"></i>
                        {new Date(booking.bookingDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                        {booking.timeSlot ? ` | ${booking.timeSlot}` : ""}
                      </p>
                    </>
                  ) : (
                    <p>Loading customer details...</p>
                  )}
                </div>


                {/* Notes Section */}
                <div className="mt-3 position-relative" style={{ width: "500px" }}>
                  <span className="position-absolute" style={{ top: "5px", right: "15px", fontSize: "14px", color: "#0076CE", cursor: "pointer" }}>
                    Edit
                  </span>
                  <textarea
                    id="notes"
                    className="form-control"
                    placeholder="Notes not Available"
                    rows="3"
                    style={{ resize: "none", height: "100px", backgroundColor: "white" }}
                    value={notes}
                    onChange={handleNotesChange}
                    onBlur={handleUpdateNotes}
                  ></textarea>
                  {loading && <div>Loading...</div>}
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
                          backgroundImage: worker.profilePicUrl ? `url('${worker.profilePicUrl}')` : `url('/default-avatar.png')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div className="d-flex flex-column mb-1">
                        <p className="mb-1">
                          <i className="bi bi-person me-1"></i> {worker.name}{" "}
                          <span className="ms-1" style={{ fontSize: "16px", backgroundColor: "#d3d3d3", width: "50px" }}>
                            <i className="bi bi-star-fill" style={{ color: "#FFD700" }}></i>
                            {worker.rating !== undefined && worker.rating !== null ? worker.rating.toFixed(1) : "4.5"}
                          </span>
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-telephone me-2"></i> {worker.contactNumber}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt me-2"></i> {worker.houseNumber},{worker.nearbyLandmark},{worker.town},{worker.district},{worker.state},{worker.pincode},
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>No worker assigned</p>
                  )}
                  <a
                    href={`/workers/view/${worker?.id || ""}`}
                    style={{ color: "#007bff", marginLeft: "120px", textDecoration: "none", marginTop: "-20px" }}
                  >
                    View full Profile →
                  </a>
                </div>


                {/* Customer Review */}
                <div>
                  <h6 style={{ fontWeight: "bold" }}>Customer Review</h6>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                  ) : feedback.length > 0 ? (
                    feedback.map((review, index) => (
                      <div key={index}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          {review.rating === 4 && (
                            <span style={{ color: "gold", fontSize: "15px", backgroundColor: "#d3d3d3", width: "40px" }}>
                              <i className="bi bi-star-fill"></i>
                            </span>
                          )}
                          <p style={{ fontSize: "16px", marginLeft: "20px", marginTop: "-22px", display: "inline-block" }}>{review.rating}</p>
                          <p style={{ fontSize: "14px", color: "#888", marginTop: "-40px", marginLeft: "44px" }}>{getCurrentDate()}</p>
                          <p style={{ fontSize: "16px", marginTop: "-15px" }}>{review.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No feedback available.</p>
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
                    maxWidth: "600px",
                    marginLeft: "-40px",
                    bottom: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h5>Status update</h5>
                  <div
                    className="p-3 mt-3 rounded"
                    style={{
                      height: "300px",
                      width: "550",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      position: "relative",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      gap: "20px",
                    }}
                  >
                    <div className="position-absolute" style={{ top: position, left: "0px", width: "4px", backgroundColor: color, height: "75px", transition: "height 0.5s ease-in-out" }}></div>
                    <table className="table w-100" style={{ position: "relative", width: "100%" }}>
                      <tbody>
                        <tr style={{ height: "40px", width: "500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} | {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                            </span>
                            <br />
                            Booking Successful on {new Date(booking.bookingDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                            {booking.timeSlot ? ` | ${booking.timeSlot}` : ""}
                          </td>
                          <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}></td>
                        </tr>
                        {selectedBookingIdForCancellation && cancellationReason && (
                          <tr style={{ height: "40px" }}>
                            <td className="text-start border-right">
                              <span style={{ color: "grey" }}>
                                {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} | {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                              </span>
                              <span className="booking-details" style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "14px" }}>
                                <span style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                                  <span style={{ color: "#AE1319" }}>Service Cancelled</span>
                                </span>
                                <span style={{ fontSize: "14px" }}>{cancellationReason ? cancellationReason : "No reason provided"}</span>
                              </span>
                            </td>
                            <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}></td>
                          </tr>
                        )}
                        <tr style={{ height: "70px", width: "500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {booking.bookedDate !== "No"
                                ? new Date(booking.bookedDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
                                " | " +
                                new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                                : "Not Assigned"}
                            </span>
                            <br />
                            Worker Assigned
                          </td>
                          <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}></td>
                        </tr>
                        {selectedBookingId && showRescheduledRow && (
                          <tr style={{ height: "40px" }}>
                            <td className="text-start border-right">
                              <span style={{ color: "grey" }}>
                                {booking.bookedDate !== "No"
                                  ? new Date(booking.bookedDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
                                  " | " +
                                  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                                  : "Not Assigned"}
                              </span>
                              <span className="booking-details" style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "14px" }}>
                                <span style={{ display: "flex", alignItems: "center", fontWeight: "bold", gap: "5px" }}>
                                  <span style={{ color: "#C14810" }}>
                                    Reschedule Service On
                                    {new Date(booking.bookedDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                                    {" | "}
                                    {booking.timeSlot}
                                  </span>
                                </span>
                                <span style={{ fontSize: "14px" }}>{booking.rescheduleReason}</span>
                              </span>
                            </td>
                            <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}></td>
                          </tr>
                        )}
                        <tr key={booking.id} style={{ height: "70px", width: "500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {bookingStatuses[booking.id]?.serviceStarted !== "No"
                                ? `${new Date(bookingStatuses[booking.id]?.serviceStarted).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} | ${new Date(bookingStatuses[booking.id]?.serviceStarted).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`
                                : `${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} | ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
                            </span>
                            <br />
                            Service Started
                          </td>
                          <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}>
                            {!(selectedBookingIdForCancellation && cancellationReason) && (
                              <span className="custom-dropdown">
                                <select
                                  className="no-border"
                                  onChange={(e) => handleServiceStartedChange(e, booking.id)}
                                  value={bookingStatuses[booking.id]?.serviceStarted !== "No" ? "Yes" : "No"}
                                >
                                  <option value="No">No</option>
                                  <option value="Yes">Yes</option>
                                </select>
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr style={{ height: "80px", width: "500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {bookingStatuses[booking.id]?.serviceCompleted !== "No"
                                ? `${new Date(bookingStatuses[booking.id]?.serviceCompleted).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} | ${new Date(bookingStatuses[booking.id]?.serviceCompleted).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`
                                : `${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} | ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
                            </span>
                            <br />
                            <span style={{ color: getTextColor(statuses[booking.id]?.serviceCompleted) }}> Service Completed </span>
                          </td>
                          <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}>
                            {!(selectedBookingIdForCancellation && cancellationReason) && (
                              <span className="custom-dropdown">
                                <select
                                  className="no-border"
                                  onChange={(e) => handleServiceCompletedChange(e, booking.id)}
                                  value={bookingStatuses[booking.id]?.serviceCompleted !== "No" ? "Yes" : "No"}
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


                    <button className="btn btn-primary w-100" onClick={() => updateBooking(booking.id)}>
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Reschedule Slider */}
          {isRescheduleModalOpen && selectedBookingId && (
            <Reschedule id={selectedBookingId} booking={booking} onClose={() => setIsRescheduleModalOpen(false)} onReschedule={handleRescheduleSuccess} />
          )}

          {/* Cancel Booking Modal */}
          {showCancelBookingModal && selectedBookingIdForCancellation && (
            <CancelBooking
              id={selectedBookingIdForCancellation}
              booking={booking}
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
