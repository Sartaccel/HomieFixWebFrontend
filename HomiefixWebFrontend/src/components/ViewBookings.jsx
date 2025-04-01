
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Header from "./Header";
import Reschedule from "./Reschedule";
import CancelBooking from "./CancelBooking";
import ManageStatus from "./ManageStatus";
import api from "../api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const ViewBookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [
    selectedBookingIdForCancellation,
    setSelectedBookingIdForCancellation,
  ] = useState(null);
  const [refresh, setRefresh] = useState(false);


  const handleStatusUpdate = async (status) => {
    try {
      const response = await api.put(
        `/booking/update-status/${id}?status=${status}`
      );
      if (response.status === 200) {
        setBooking((prev) => ({ ...prev, bookingStatus: status }));
        alert(`Booking status updated to ${status}`);
      } else {
        alert("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Network error while updating booking status.");
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };


  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/booking/${id}`);
      setBooking(data);
      setNotes(data.notes || "No additional notes provided.");


      if (data.worker) {
        setWorker(data.worker);
      } else if (data.workerId) {
        const workerResponse = await api.get(`/workers/view/${data.workerId}`);
        setWorker(workerResponse.data);
      }


      await fetchFeedback(data.id, data.bookedDate);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchFeedback = async (bookingId, bookingDate) => {
    try {
      const response = await api.get(`/feedback/byBooking/${bookingId}`);
      if (response.data?.length > 0) {
        setFeedback({ ...response.data[0], bookingDate });
      } else {
        setFeedback(null);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedback(null);
    }
  };


  const saveNotes = async () => {
    setSaving(true);
    try {
      await api.patch(
        `/booking/update-notes/${id}?notes=${encodeURIComponent(notes)}`
      );
      alert("Notes saved successfully ✅");
      setIsEditing(false);
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
    setRefresh(!refresh);
  };


  const handleCancelBookingButtonClick = (bookingId) => {
    setSelectedBookingIdForCancellation(bookingId);
    setShowCancelBookingModal(true);
  };


  const handleCancelBookingSuccess = () => {
    setShowCancelBookingModal(false);
    setSelectedBookingIdForCancellation(null);
    setRefresh(!refresh);
  };


  useEffect(() => {
    fetchBookingDetails();
  }, [id, refresh]);


  if (error) return <p className="text-danger">{error}</p>;


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
                className={`section ${
                  activeTab === "serviceDetails" ? "active" : ""
                }`}
                onClick={() => setActiveTab("serviceDetails")}
              >
                Service Details
              </div>
            </div>
            {!loading && booking && (
              <div
                className="d-flex gap-3 p-2"
                style={{ marginRight: "300px" }}
              >
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
                    backgroundColor: isCancelHovered
                      ? "#B8141A"
                      : "transparent",
                    color: isCancelHovered ? "white" : "#B8141A",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Cancel Service
                </button>
              </div>
            )}
          </div>
          <div className="container mt-5 pt-4">
            <div className="row justify-content-between p-3 mt-5">
              <div className="mt-4 p-3 col-6">
                {/* Service Details */}
                <div className="d-flex align-items-center">
                  {loading ? (
                    <>
                      <Skeleton
                        circle
                        width={50}
                        height={50}
                        className="me-3"
                      />
                      <div>
                        <Skeleton width={180} height={20} className="mb-1" />
                        <Skeleton width={100} height={16} />
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={
                          booking?.productImage ||
                          "https://via.placeholder.com/50"
                        }
                        alt="Service"
                        className="me-3 rounded"
                        style={{ width: 50, height: 50 }}
                      />
                      <div>
                        <h6 className="mb-0">
                          {booking?.productName} - ₹{booking?.totalPrice}
                        </h6>
                        <span className="text-primary">ID: {booking?.id}</span>
                      </div>
                    </>
                  )}
                </div>


                {/* Customer Details */}
                <div className="mt-3">
                  <h6 className="fw-bold">Customer Details</h6>
                  {loading ? (
                    <div className="mt-2">
                      <Skeleton width="80%" height={18} className="mb-2" />
                      <Skeleton width="75%" height={18} className="mb-2" />
                      <Skeleton width="85%" height={18} className="mb-2" />
                      <Skeleton width="90%" height={18} />
                    </div>
                  ) : (
                    <>
                      <p className="mb-1">
                        <i className="bi bi-person me-2"></i>
                        {booking?.userProfile?.fullName}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-telephone me-2"></i>{" "}
                        {booking?.userProfile?.mobileNumber?.mobileNumber}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-calendar-event me-2"></i>{" "}
                        {booking?.rescheduledDate &&
                        booking?.rescheduledTimeSlot
                          ? `${formatDate(booking.rescheduledDate)} | ${
                              booking.rescheduledTimeSlot
                            }`
                          : `${formatDate(booking?.bookedDate)} | ${
                              booking?.timeSlot
                            }`}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-geo-alt me-2"></i>
                        {booking?.deliveryAddress?.houseNumber},{" "}
                        {booking?.deliveryAddress?.town},{" "}
                        {booking?.deliveryAddress?.district},{" "}
                        {booking?.deliveryAddress?.state} -{" "}
                        {booking?.deliveryAddress?.pincode}
                      </p>
                    </>
                  )}
                </div>


                {/* Notes Section */}
                <div
                  className="border rounded p-3 mt-2"
                  style={{ height: "110px" }}
                >
                  {loading ? (
                    <>
                      <Skeleton width={100} height={20} className="mb-2" />
                      <Skeleton height={40} />
                    </>
                  ) : (
                    <>
                      <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ marginTop: "-8px" }}
                      >
                        <h6 className="m-0" style={{ color: "#808080" }}>
                          Notes
                        </h6>
                      </div>
                      <div className="position-relative">
                        <textarea
                          id="notesText"
                          className="form-control border-0 p-2"
                          style={{
                            width: "100%",
                            height: "70px",
                            resize: "none",
                            outline: "none",
                            background: "transparent",
                            boxShadow: "none",
                            overflowY: "auto",
                          }}
                          rows="3"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          readOnly={!isEditing}
                        />
                        <div
                          className="d-flex justify-content-end"
                          style={{ marginTop: "-95px", marginRight: "5px" }}
                        >
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
                              className={`text-primary text-decoration-none ${
                                saving ? "disabled" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!saving) saveNotes();
                              }}
                              style={{
                                cursor: saving ? "not-allowed" : "pointer",
                                opacity: saving ? 0.6 : 1,
                              }}
                            >
                              {saving ? "Saving..." : "Save"}
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>


                {/* Worker Details */}
                <div className="mt-3">
                  <h6 style={{ fontWeight: "bold" }}>Worker Details</h6>
                  {loading ? (
                    <div className="d-flex align-items-center mt-2">
                      <Skeleton
                        circle
                        width={80}
                        height={80}
                        className="me-3"
                      />
                      <div style={{ width: "100%" }}>
                        <Skeleton width="70%" height={18} className="mb-2" />
                        <Skeleton width="60%" height={18} className="mb-2" />
                        <Skeleton width="80%" height={18} />
                      </div>
                      <Skeleton
                        width={150}
                        height={20}
                        className="mt-2"
                        style={{ marginLeft: "100px" }}
                      />
                    </div>
                  ) : worker ? (
                    <>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            worker.profilePicUrl ||
                            "https://via.placeholder.com/50"
                          }
                          alt="Worker"
                          className="me-3 rounded"
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
                              {worker.rating?.toFixed(1) || "4.5"}
                            </span>
                          </p>
                          <p className="mb-1">
                            <i className="bi bi-telephone me-2"></i>{" "}
                            {worker.contactNumber}
                          </p>
                          <p className="mb-1">
                            <i className="bi bi-geo-alt me-2"></i>{" "}
                            {worker.houseNumber}, {worker.town},{" "}
                            {worker.district}, {worker.state}, {worker.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <a
                          href="#"
                          className="text-primary text-decoration-none d-block"
                          style={{ marginLeft: "100px", color: "#0076CE" }}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/worker-details/worker/${worker.id}`);
                          }}
                        >
                          View full profile &gt;
                        </a>
                      </div>
                    </>
                  ) : (
                    <p>No worker assigned yet.</p>
                  )}
                </div>


                {/* Customer Review */}
                <div className="mt-2">
                  <h6>Customer Review</h6>
                  {loading ? (
                    <div className="mt-2">
                      <div className="d-flex align-items-center mb-2">
                        <Skeleton width={50} height={20} />
                        <Skeleton width={100} height={16} className="ms-2" />
                      </div>
                      <Skeleton width="100%" height={50} count={1} />
                    </div>
                  ) : feedback ? (
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
                          <i
                            className="bi bi-star-fill"
                            style={{ color: "#FFD700" }}
                          ></i>{" "}
                          {feedback.rating}
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "#666666",
                            fontSize: "13px",
                          }}
                        >
                          {formatDate(feedback.bookingDate)}
                        </span>
                        <p
                          className="feedback-text"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            whiteSpace: "normal",
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


              {/* Status Management - No skeleton loading */}
              <div className="col-6">
                <ManageStatus
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            </div>


            {/* Modals */}
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


