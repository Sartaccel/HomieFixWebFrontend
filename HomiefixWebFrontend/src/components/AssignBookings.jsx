import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import closeDate from "../assets/close date.png"; // Import the close date icon
import Reschedule from "./Reschedule"; // Import the Reschedule component
import CancelBooking from "./CancelBooking"; // Import the CancelBooking component
import "../styles/AssignBookings.css";
import bookingDetails from "../assets/BookingDetails.png";
import Header from "./Header";
import api from "../api";


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
  const [rescheduledDate, setRescheduledDate] = useState(
    booking.rescheduledDate || booking.bookedDate
  );
  const [rescheduledTimeSlot, setRescheduledTimeSlot] = useState(
    booking.rescheduledTimeSlot || booking.timeSlot
  );
  const [rescheduleHistory, setRescheduleHistory] = useState([]); // Track reschedule history
  const [loadingWorkers, setLoadingWorkers] = useState(true); // Loading state for workers
  const [loadingBookingDetails, setLoadingBookingDetails] = useState(true); // Loading state for booking details
  const navigate = useNavigate();
  const [assigningWorker, setAssigningWorker] = useState(false);


  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  // Helper function to decode URL-encoded time slot
  const decodeTimeSlot = (timeSlot) => {
    try {
      return decodeURIComponent(timeSlot);
    } catch (error) {
      console.error("Error decoding time slot:", error);
      return timeSlot; // Return the original time slot if decoding fails
    }
  };


  // Fetch workers from the API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/workers/view", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
        if (error.response && error.response.status === 403) {
          alert("You do not have permission to perform this action.");
          navigate("/"); // Redirect to login page
        }
      } finally {
        setLoadingWorkers(false); // Set loading to false after fetching
      }
    };


    fetchWorkers();
  }, []);


  // Fetch booking details from the API
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/booking/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        // Check if booking is expired
        const expired = isBookingExpired(data.bookedDate);
        setIsExpired(expired);

        // Rest of your existing code...
        if (data.bookedDate && data.timeSlot) {
          setRescheduledDate(data.rescheduledDate || data.bookedDate);
          setRescheduledTimeSlot(
            decodeTimeSlot(data.rescheduledTimeSlot || data.timeSlot)
          );
        } else {
          console.error("Booking details are incomplete:", data);
        }

        setNotes(data.notes || "");
      } catch (error) {
        console.error("Error fetching booking details:", error);
        if (error.response && error.response.status === 403) {
          alert("You do not have permission to perform this action.");
          navigate("/");
        }
      } finally {
        setLoadingBookingDetails(false);
      }
    };

    fetchBookingDetails();
  }, [id]);


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

    if (isExpired) {
      alert("Cannot assign worker to an expired booking");
      return;
    }

    if (!selectedWorkerId) {
      alert("Please select a worker");
      return;
    }
    setAssigningWorker(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/booking/assign-worker/${id}?workerId=${selectedWorkerId}`,
        {
          notes: notes, // Send notes in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Worker assigned successfully");
        navigate(-1);
      } else {
        alert("Failed to assign worker");
      }
    } catch (error) {
      console.error("Error assigning worker:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        if (error.response.status === 403) {
          alert("You do not have permission to perform this action.");
          navigate("/"); // Redirect to login page
        }
      }
    } finally {
      setAssigningWorker(false); // Stop loading regardless of success/failure
    }
  };


  // Save notes to the booking
  const saveNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/booking/update-notes/${id}?notes=${encodeURIComponent(notes)}`,
        null, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.status === 200) {
        alert("Notes saved successfully");
      } else {
        alert("Failed to save notes");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      if (error.response && error.response.status === 403) {
        alert("You do not have permission to perform this action.");
        navigate("/"); // Redirect to login page
      }
    }
  };


  // Handle rescheduling
  const handleReschedule = (newDate, newTimeslot) => {
    // Add the current rescheduled date and time slot to the history
    setRescheduleHistory((prevHistory) => [
      ...prevHistory,
      { date: rescheduledDate, timeSlot: rescheduledTimeSlot },
    ]);


    // Update the rescheduled date and time slot
    setRescheduledDate(newDate);
    setRescheduledTimeSlot(newTimeslot);


    // Store the rescheduled date and time slot in localStorage
    localStorage.setItem("rescheduledDate", newDate);
    localStorage.setItem("rescheduledTimeSlot", newTimeslot); // Store the decoded time slot


    setShowRescheduleSlider(false);
  };


  // Undo rescheduling
  const undoReschedule = async () => {
    try {
      const token = localStorage.getItem("token");


      // Get the previous rescheduled date and time slot from the history
      const previousReschedule =
        rescheduleHistory[rescheduleHistory.length - 1];
      const previousDate = previousReschedule
        ? previousReschedule.date
        : booking.bookedDate;
      const previousTimeSlot = previousReschedule
        ? decodeTimeSlot(previousReschedule.timeSlot) // Decode the time slot
        : booking.timeSlot;


      // Make the API call to undo rescheduling
      const undoResponse = await api.put(
        `/booking/reschedule/${id}`,
        null, // No request body
        {
          params: {
            selectedDate: previousDate,
            selectedTimeSlot: encodeURIComponent(previousTimeSlot), // Encode only for the API call
            rescheduleReason: "Undo rescheduling",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (undoResponse.status === 200) {
        // Update local state to reflect the previous booking details
        setRescheduledDate(previousDate);
        setRescheduledTimeSlot(previousTimeSlot);


        // Remove the last entry from the reschedule history
        setRescheduleHistory((prevHistory) => {
          const updatedHistory = prevHistory.slice(0, -1);


          // Clear local storage if no more reschedules
          if (updatedHistory.length === 0) {
            localStorage.removeItem("rescheduledDate");
            localStorage.removeItem("rescheduledTimeSlot");
          } else {
            // Store the last available reschedule in local storage
            localStorage.setItem(
              "rescheduledDate",
              updatedHistory[updatedHistory.length - 1].date
            );
            localStorage.setItem(
              "rescheduledTimeSlot",
              updatedHistory[updatedHistory.length - 1].timeSlot
            );
          }


          return updatedHistory;
        });


        alert("Rescheduling undone successfully");
      } else {
        console.error("Failed to undo rescheduling:", undoResponse.data);
        alert(`Failed to undo rescheduling: ${undoResponse.data}`);
      }
    } catch (error) {
      console.error("Error undoing rescheduling:", error);


      if (error.response) {
        if (error.response.status === 400) {
          alert(
            "Invalid request: Please check the selected date and time slot."
          );
        } else if (error.response.status === 403) {
          alert("You do not have permission to perform this action.");
          navigate("/"); // Redirect to login page
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };


  // Clear localStorage on component unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("rescheduledDate");
      localStorage.removeItem("rescheduledTimeSlot");
    };
  }, []);


  // Check for reschedule history on component mount
  useEffect(() => {
    const storedRescheduledDate = localStorage.getItem("rescheduledDate");
    const storedRescheduledTimeSlot = localStorage.getItem(
      "rescheduledTimeSlot"
    );


    if (storedRescheduledDate && storedRescheduledTimeSlot) {
      setRescheduledDate(storedRescheduledDate);
      setRescheduledTimeSlot(decodeTimeSlot(storedRescheduledTimeSlot)); // Decode the time slot
    }
  }, []);

  // Add this helper function to check if booking date is expired
  const isBookingExpired = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    const bookingDateObj = new Date(bookingDate);
    return bookingDateObj < today;
  };

  const [isExpired, setIsExpired] = useState(false);


  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />


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
                  {loadingBookingDetails ? (
                    <Skeleton circle width={40} height={40} />
                  ) : (
                    <div
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        flexShrink: 0,
                        backgroundImage: `url(${booking.productImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  )}
                  <div>
                    {loadingBookingDetails ? (
                      <>
                        <Skeleton width={150} height={20} />
                        <Skeleton width={100} height={15} />
                      </>
                    ) : (
                      <>
                        <p className="mb-0">{booking.service}</p>
                        <small style={{ color: "#0076CE" }}>
                          ID: {booking.id}
                        </small>
                      </>
                    )}
                  </div>
                </div>


                <div className="p-0 m-0">
                  <div className="mt-4">
                    <h6>Customer Details</h6>
                  </div>
                  {loadingBookingDetails ? (
                    <>
                      <Skeleton width={200} height={15} />
                      <Skeleton width={200} height={15} />
                      <Skeleton width={200} height={15} />
                      <Skeleton width={200} height={15} />
                    </>
                  ) : (
                    <>
                      <p className="mb-1">
                        <i className="bi bi-person fw-bold me-2"></i>{" "}
                        {booking.name}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-telephone fw-bold me-2"></i>{" "}
                        {booking.contact}
                      </p>
                      <p
                        className="mb-1"
                        style={{
                          backgroundColor:
                            localStorage.getItem("rescheduledDate") &&
                              localStorage.getItem("rescheduledTimeSlot")
                              ? "#EDF3F7"
                              : "transparent",
                          borderRadius: "5px",
                          display: "inline-block",
                          padding:
                            localStorage.getItem("rescheduledDate") &&
                              localStorage.getItem("rescheduledTimeSlot")
                              ? "0px 10px 0px 0px"
                              : "0",
                        }}
                      >
                        {localStorage.getItem("rescheduledDate") &&
                          localStorage.getItem("rescheduledTimeSlot") ? (
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
                            className="menu-icon"
                            style={{
                              width: "17px",
                              height: "17px",
                            }}
                          />
                        )}
                        {formatDate(rescheduledDate)} |{" "}
                        {decodeTimeSlot(rescheduledTimeSlot) || "Not Available"}
                      </p>


                      <p className="mb-1">
                        <i className="bi bi-geo-alt fw-bold me-2"></i>{" "}
                        {booking.address}
                      </p>
                    </>
                  )}
                </div>


                {/* Comment Field (Notes) */}
                <div
                  className="mt-3 position-relative"
                  style={{ width: "550px" }}
                >
                  {loadingBookingDetails ? (
                    <Skeleton height={237} />
                  ) : (
                    <>
                      <textarea
                        id="notes"
                        className="form-control"
                        placeholder="Notes"
                        rows="8"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                          height: "237px",
                          resize: "none",
                          padding: "10px",
                          width: "100%",
                          boxSizing: "border-box",
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
                    </>
                  )}
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
                      {loadingWorkers
                        ? Array.from({ length: 4 }).map((_, index) => (
                          <div
                            key={index}
                            className="col-6"
                            style={{
                              width: "48%",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              padding: "8px",
                              background: "#f9f9f9",
                            }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <Skeleton circle width={40} height={40} />
                              <div>
                                <Skeleton width={100} height={15} />
                                <Skeleton width={80} height={12} />
                              </div>
                            </div>
                          </div>
                        ))
                        : workers.map((worker, index) => (
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
                          disabled={assigningWorker}
                        >
                          {assigningWorker ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Assigning...
                            </>
                          ) : (
                            "Assign Worker"
                          )}
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
                          background: isExpired
                            ? "#CCCCCC"
                            : selectedWorkerId ? "#0076CE" : "#999999",
                          color: "white",
                          width: "350px",
                          borderRadius: "14px",
                        }}
                        onClick={assignWorker}
                        disabled={isExpired || !selectedWorkerId || assigningWorker}
                      >
                        {
                          assigningWorker ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Assigning...
                            </>
                          ) : "Assign Worker"}
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
