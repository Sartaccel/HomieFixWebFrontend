import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import Header from "./Header"; // Ensure you have a Header component
import Reschedule from "./Reschedule"; // Ensure you have a Reschedule component
import CancelBooking from "./CancelBooking";
import ManageStatus from "./ManageStatus"; // Ensure you have a CancelBooking component


const ViewBookings = () => {
  const { id } = useParams(); // Get the booking ID from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const [booking, setBooking] = useState(null);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState("serviceDetails");
  const [isRescheduleHovered, setIsRescheduleHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [selectedBookingIdForCancellation, setSelectedBookingIdForCancellation] = useState(null);


  const handleStatusUpdate = async (status) => {
    try {
      const response = await axios.put(
        `http://localhost:2222/booking/update-status/${id}?status=${status}`
      );


      if (response.status === 200) {
        setBooking((prevBooking) => ({ ...prevBooking, bookingStatus: status }));
        alert(`Booking status updated to ${status}`);
      } else {
        alert("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Network error while updating booking status.");
    }
  };


  // Helper function to format the date as "Mon DD, YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get the short month name (e.g., "Oct")
    const day = date.getDate().toString().padStart(2, "0"); // Add leading zero for single-digit days
    const year = date.getFullYear(); // Get the full year (e.g., 2023)
    return `${month} ${day}, ${year}`; // Format as "Oct 05, 2023"
  };


  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // Fetch booking details
        const { data } = await axios.get(`http://localhost:2222/booking/${id}`);
        setBooking(data);
        setNotes(data.notes || "No additional notes provided.");


        // Fetch worker details if workerId is available
        if (data.worker) {
          setWorker(data.worker);
        } else if (data.workerId) {
          const workerResponse = await axios.get(
            `http://localhost:2222/workers/view/${data.workerId}`
          );
          setWorker(workerResponse.data);
        }


        // Fetch feedback for the booking
        await fetchFeedback(data.id, data.bookedDate); // Pass booking ID and booking date
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    // Function to fetch feedback dynamically
    const fetchFeedback = async (bookingId, bookingDate) => {
      try {
        const response = await axios.get(
          `http://localhost:2222/feedback/byBooking/${bookingId}`
        );
        if (response.data && response.data.length > 0) {
          // Add booking date to the feedback object
          const feedbackWithDate = {
            ...response.data[0],
            bookingDate: bookingDate, // Include the booking date
          };
          setFeedback(feedbackWithDate); // Set the feedback with booking date
        } else {
          setFeedback(null); // No feedback available
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setFeedback(null); // Reset feedback if there's an error
      }
    };


    fetchBookingDetails();
  }, [id]); // Re-run effect when the booking ID changes


  const saveNotes = async () => {
    setSaving(true);
    try {
      const response = await axios.patch(
        `http://localhost:2222/booking/update-notes/${id}?notes=${encodeURIComponent(
          notes
        )}`
      );


      if (response.status === 200) {
        alert("Notes saved successfully ✅");
        setIsEditing(false);
      } else {
        alert("Failed to save notes ❌");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("An error occurred while saving ❌");
    } finally {
      setSaving(false);
    }
  };

  const handleRescheduleButtonClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsRescheduleModalOpen(true);
  };


  const closeRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setSelectedBookingId(null);
  };


  const handleRescheduleSuccess = () => {
    closeRescheduleModal();
    // Optionally, refetch booking details or update state
  };


  const handleCancelBookingButtonClick = (bookingId) => {
    setSelectedBookingIdForCancellation(bookingId);
    setShowCancelBookingModal(true);
  };


  const handleCancelBookingSuccess = () => {
    setShowCancelBookingModal(false);
    setSelectedBookingIdForCancellation(null);
    // Optionally, refetch booking details or update state
  };


  if (loading) return <Spinner animation="border" />;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!booking) return <p>No booking details found.</p>;


  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />
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
                className={`section ${activeTab === "serviceDetails" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("serviceDetails")}
              >
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
                  backgroundColor: isRescheduleHovered
                    ? "#0076CE"
                    : "transparent",
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
          <div className="container mt-5 pt-4">
            <div
              className="row justify-content-between p-3 mt-5"
            >
              <div className="mt-4 p-3 col-6">
                {/* Service Title & Price */}
                <div className="d-flex align-items-center">
                  <img
                    src={booking.productImage || "https://via.placeholder.com/50"}
                    alt="Service"
                    className="me-3"
                    style={{ width: 50, height: 50 }}
                  />
                  <div>
                    <h6 className="mb-0">
                      {booking.productName} - ₹{booking.totalPrice}
                    </h6>
                    <span className="text-primary">ID: {booking.id}</span>
                  </div>
                </div>


                {/* Customer Details */}
                <div className="mt-3">
                  <h6 className=" fw-bold">Customer Details</h6>
                  <p className="mb-1">
                    <i className="bi bi-person me-2"></i>
                    {booking.userProfile.fullName}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone me-2"></i>{" "}
                    {booking.userProfile.mobileNumber.mobileNumber}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-calendar-event me-2"></i>{" "}
                    {formatDate(booking.bookedDate)} | {booking.timeSlot}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-geo-alt me-2"></i>
                    {booking.deliveryAddress.houseNumber}, {booking.deliveryAddress.town},{" "}
                    {booking.deliveryAddress.district}, {booking.deliveryAddress.state} -{" "}
                    {booking.deliveryAddress.pincode}
                  </p>
                </div>


               {/* Notes Section */}
<div className="border rounded p-3 mt-2" style={{height:"110px"}}>
  <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "-8px" }}>
    <h6 className="m-0" style={{ color: "#808080" }}>Notes</h6>
  </div>

  {/* Editable Textarea in the SAME BOX */}
  <div className="position-relative">
    <textarea
      id="notesText"
      className="form-control border-0 p-2"
      style={{
        width: "100%",
        height: "70px", // 3 rows height
        resize: "none",
        outline: "none",
        background: "transparent",
        boxShadow: "none",
        overflowY: "auto", // Enable scrolling if text exceeds
      }}
      rows="3"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      readOnly={!isEditing}
    />

    {/* Show Edit & Save Button Inside the Textarea */}
    <div className="d-flex justify-content-end " style={{ marginTop: "-95px", marginRight: "5px" }}>
      {!isEditing ? (
        <a
          href="#"
          className="text-primary text-decoration-none"
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
            document.getElementById("notesText").focus();
          }}
        >
          Edit
        </a>
      ) : (
        <a
          href="#"
          className={`text-primary text-decoration-none ${saving ? "disabled" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            if (!saving) saveNotes();
          }}
          style={{ cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving..." : "Save"}
        </a>
      )}
    </div>
  </div>
</div>



                {/* Worker Details */}
                {worker && (
                  <div className="mt-3">
                    <h6 style={{ fontWeight: "bold" }}>Worker Details</h6>
                    <div className="d-flex align-items-center">
                      <img
                        src={worker.profilePicUrl || "https://via.placeholder.com/50"}
                        alt="Worker"
                        className="me-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundPosition: "center",
                        }}
                      />
                      <div>
                        <p className="mb-1">
                          <i className="bi bi-person me-1"></i> {worker.name}
                          <span
                            className="ms-1 px-1 border rounded-1"
                            style={{
                              fontSize: "15px",
                              backgroundColor: "#EDF3F7",
                              width: "50px",
                            }}
                          >
                            <i
                              className="bi bi-star-fill"
                              style={{ color: "#FFD700" }}
                            ></i>
                            {worker.rating !== undefined && worker.rating !== null
                              ? worker.rating.toFixed(1)
                              : "4.5"}
                          </span>
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-telephone me-2"></i> {worker.contactNumber}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt me-2"></i> {worker.houseNumber},{" "}
                          {worker.town}, {worker.district}, {worker.state}, {worker.pincode}
                        </p>
                      </div>
                    </div>
                    {/* Move the "View full profile" link outside the flex container */}
                    <div className="">
                      <a
                        href="#"
                        className="text-primary text-decoration-none d-block"
                        style={{ marginLeft: "100px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/worker-details/worker/${worker.id}`);
                        }}
                      >
                        View full profile &gt;
                      </a>
                    </div>
                  </div>
                )}


                {/* Feedback Section */}
                <div className="mt-2">
                  <h6>Customer Review</h6>
                  {feedback ? (
                    <>
                      <p>
                        <span
                          className="ms-1 px-1 border rounded-1"
                          style={{
                            fontSize: "15px",
                            backgroundColor: "#EDF3F7",
                            width: "50px",
                          }}
                        >
                          <i className="bi bi-star-fill" style={{ color: "#FFD700" }}></i>{" "}
                          {feedback.rating}
                        </span>
                        <span style={{ marginLeft: "10px", color: "#666666", fontSize: "13px" }}>
                          {formatDate(feedback.bookingDate)}
                        </span>
                        <p
                        className="feedback-text"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2, // Limit to 2 lines
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%", // Ensure it doesn't stretch
                          whiteSpace: "normal", // Allow wrapping
                        }}
                      >
                        {feedback.comment}
                      </p>
                      </p>
                   
                    </>
                  ) : (
                    <p>No feedback available.</p>
                  )}
                </div>


              </div>
              <ManageStatus booking={booking} onStatusUpdate={handleStatusUpdate} />
             
            </div>
            {isRescheduleModalOpen && selectedBookingId && (
              <Reschedule
                id={selectedBookingId}
                booking={booking}
                onClose={closeRescheduleModal}
                onReschedule={handleRescheduleSuccess}
              />
            )}
            {showCancelBookingModal && selectedBookingIdForCancellation && (
              <CancelBooking
                id={selectedBookingIdForCancellation}
                booking={booking}
                onClose={() => setShowCancelBookingModal(false)}
                onCancelSuccess={handleCancelBookingSuccess}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


export default ViewBookings;
