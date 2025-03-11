import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ViewBooking.css";
import Reschedule from "./Reschedule"; // Import the Reschedule component
import CancelBooking from "./CancelBooking"; // Import the CancelBooking component
import Header from "./Header"
const ViewBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Fixed missing import
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
   const [showCancelBookingModal, setShowCancelBookingModal] = useState(false); // State to control CancelBooking visibility
  const [cancellationReason, setCancellationReason] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showRescheduledRow, setShowRescheduledRow] = useState(false);
 const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [ selectedBookingIdForCancellation,setSelectedBookingIdForCancellation] = useState("");
  const [isCancellationConfirmed, setIsCancellationConfirmed] = useState(false);
  const [isRescheduledConfirmed, setIsRescheduledConfirmed] = useState(false); // To track reschedule confirmation
  const [isUpdated, setIsUpdated] = useState(false); // New state to track if the booking was updated
  const [feedback, setFeedback] = useState([]);
const [isRescheduleHovered, setIsRescheduleHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [bookingStatuses, setBookingStatuses] = useState({});
  useEffect(() => {
    // Fetch feedback for a specific booking when the bookingId changes
    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          `http://localhost:2222/feedback/byBooking/${id}`
        );

        // Check if response is okay
        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }

        // Parse JSON response
        const data = await response.json();
        console.log("Fetched Feedback Data:", data); // Log the data for verification

        // Set the feedback state if data is in correct format (an array)
        if (Array.isArray(data)) {
          setFeedback(data);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        setError(error.message); // Handle errors
        console.error("Error fetching feedback:", error); // Log the error for debugging
      } finally {
        setLoading(false); // Stop loading after request is complete
      }
    };

    if (id) {
      fetchFeedback(); // Fetch feedback when bookingId is set
    }
  }, [id]); // Re-run when bookingId changes

  const getCurrentDate = () => {
    const date = new Date() ;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  };

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:2222/booking/${id}`);
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }
        const data = await response.json();
        console.log("Fetched Booking Data:", data);
        if (data && data.bookingDate && data.bookedDate ) {
          setBooking(data);
          setNotes(data.notes || "");
          setError(null);
        } else {
          console.error("Invalid booking data", data);
        }
        // Set worker details
        if (data.worker) {
          setWorker(data.worker);
        } else if (data.workerId) {
          try {
            const workerResponse = await fetch(
              `http://localhost:2222/workers/view/${data.workerId}`
            );
            if (!workerResponse.ok) {
              throw new Error("Failed to fetch worker details");
            }
            const workerData = await workerResponse.json();
            console.log("Worker Data:", workerData);
            setWorker(workerData);
          } catch (workerErr) {
            console.error("Error fetching worker details:", workerErr);
            setWorker(null); // Ensure UI handles missing worker properly
          }
        } else {
          setWorker(null); // If no worker, explicitly set null
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  useEffect(() => {
    console.log("Worker Data:", worker);
  }, [worker]);




  const updateBooking = async () => {
    const serviceStarted = bookingStatuses[id]?.serviceStarted;
    const serviceCompleted = bookingStatuses[id]?.serviceCompleted;

    if (!id) {
      alert("Error: Booking ID is missing.");
      return;
    }

    console.log("Debug: Type of serviceStarted =", typeof serviceStarted);
    console.log("Debug: Type of serviceCompleted =", typeof serviceCompleted);

    // Determine status dynamically
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

        setIsUpdated(true); // Mark the booking as updated
      } else {
        alert(`Failed to update booking. Server response: ${textResponse}`);
      }
    } catch (error) {
      console.error("Network or API Error:", error);
      alert("Network error while updating booking.");
    }
  };
  useEffect(() => {
    // Get saved statuses for all bookings
    const savedStatuses = JSON.parse(localStorage.getItem("bookingStatuses")) || {};
    setBookingStatuses(savedStatuses);
  }, []);
  
  const handleServiceStartedChange = (e, id) => {
    const value = e.target.value === "Yes" ? new Date().toISOString() : "No";
    setBookingStatuses((prevStatuses) => {
      const updatedStatuses = { 
        ...prevStatuses, 
        [id]: { 
          ...prevStatuses[id], 
          serviceStarted: value 
        }
      };
  
      // Save the updated statuses to localStorage
      localStorage.setItem("bookingStatuses", JSON.stringify(updatedStatuses));
      return updatedStatuses;
    });
  
    // If service is marked as started, set serviceCompleted to "No"
    if (value === "Yes") {
      setBookingStatuses((prevStatuses) => {
        const updatedStatuses = { 
          ...prevStatuses, 
          [id]: { 
            ...prevStatuses[id], 
            serviceCompleted: "No" // Reset service completed status
          }
        };
        localStorage.setItem("bookingStatuses", JSON.stringify(updatedStatuses));
        return updatedStatuses;
      });
    }
  };
  
  const handleServiceCompletedChange = (e, id) => {
    const value = e.target.value === "Yes" ? new Date().toISOString() : "No";
    setBookingStatuses((prevStatuses) => {
      const updatedStatuses = { 
        ...prevStatuses, 
        [id]: { 
          ...prevStatuses[id], 
          serviceCompleted: value 
        }
      };
  
      // Save the updated statuses to localStorage
      localStorage.setItem("bookingStatuses", JSON.stringify(updatedStatuses));
      return updatedStatuses;
    });
  };
  
  const getLinePosition = () => {
    let position = 72; // Initial position for "Booking Successful"
    let color = "black"; // Default color (black)

    // Set position and color based on different conditions
    if (bookedDate !== "No") {
      position = 70; // Move down when "Worker Assigned"
      color = "black"; // Worker Assigned color (Black)
    }
    if (selectedBookingId && showRescheduledRow ) {
      position = 150; // Adjust for rescheduled booking
      color = "#C14810"; 
    }
   
    if (serviceStarted !== "No") {
      position = 137; // Move down when "Service Started"
      color = "black"; // Service Started color (Black)
    }
    if (serviceCompleted !== "No") {
      position = 212; // Move down when "Service Completed"
      color = "green"; // Service Completed color (Green)
    }
    if (selectedBookingIdForCancellation && isCancellationConfirmed) {
      position = 80; // Adjust for cancellation row visibility
      color = "#AE1319"; // Cancellation color (Red)
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
    setSelectedBookingIdForCancellation(id); // Store the selected booking ID
    setShowCancelBookingModal(true); // Show the cancel booking modal
    // setLineColor("red");
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
    // Update only the selected booking, not all bookings
    setBooking((prevBooking) =>
     
         selectedBookingId
          ? {
              ...booking,
              bookedDate: newDate,
              bookedTimeSlot: newTime,
              rescheduleReason: reason,
            }
          : booking
      )
    
  
    setShowRescheduledRow(true);

    closeRescheduleModal(); // Close modal after success
  };
  const handleRescheduleButtonClick = (id) => {
    setSelectedBookingId(id); // This will trigger the modal to open
    openRescheduleModal();
  };
  const handleNotesChange = (e) => {
    setNotes(e.target.value); // Update notes state as user types
  };
  const handleUpdateNotes = async () => {
    localStorage.setItem("notes", notes); // Save notes to localStorage
    if (!id || !notes) {
      return; // Don't send empty requests or when no bookingId
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await fetch(
        `http://localhost:2222/booking/update-notes/${id}`,
        {
          method: "PATCH", // Use PATCH request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }), // Send the updated notes in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking notes");
      }

      const data = await response.json(); // Get the updated booking
      console.log("Updated Booking:", data);
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
 

  // Function to dynamically apply the text color
  const getTextColor = () => {
    return isUpdated ? "green" : "";  // Green if updated, Grey if not
  };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100" >
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          {/* Header */}
         <Header/>

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
                      {bookings.service} - ₹{booking.totalPrice}
                    </p>

                    <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                  </div>
                </div>

                <div className="p-0 m-0 mt-2">
                <>
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
          {booking?.bookingDate ?? "N/A"} {"|"} {booking?.timeSlot ?? "N/A"}
        </p>
      </>
    ) : (
      <p>Loading customer details...</p>
    )}
  </>
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
                    value={notes}
                    onChange={handleNotesChange} // Update notes state
                    onBlur={handleUpdateNotes} // Trigger save when user clicks away
                     
                  >
                    
      
                  </textarea>  
               
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
                          <i className="bi bi-person me-1"></i>{" "}
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
                          <i className="bi bi-telephone me-2"></i>{" "}
                          {worker.contactNumber}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt me-2"></i>{" "}
                          {worker.houseNumber},{worker.nearbyLandmark},
                          {worker.district},{worker.town},{worker.state},{worker.pincode},
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>No worker assigned</p>
                  )}
                  <a
                    href={`/workers/view/${worker.id}`}
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
                       gap: "20px",  // Added some gap for spacing between secti
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
                    >

                    </div>
                    
                    <table className="table w-100" style={{ width: "100%" }}>
                      <tbody>
                       <tr style={{ height: "40px",width:"500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
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
                            </span><br/>
                            Booking Successful on{" "}
                            {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                            {booking.timeSlot ? ` | ${booking.timeSlot}` : ""}
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
                                    <span style={{ color: "#AE1319" }}>
                                      Service Cancelled
                                    </span>
                                  </div>
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
                       <tr style={{ height: "70px",width:"500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                            {booking.bookedDate !== "No"
                        ? new Date(booking.bookedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              }) +
                            " | " +
                         new Date().toLocaleTimeString("en-US", {
                         hour: "2-digit",
                         minute: "2-digit",
                         hour12: true,
                         })
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
                              {console.log(booking)}
                              <span style={{ color: "grey" }}>
                              {booking.bookedDate !== "No"
                       ? new Date(booking.bookedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                             }) +
                           " | " +
                    new Date().toLocaleTimeString("en-US", {
                   hour: "2-digit",
                   minute: "2-digit",
                   hour12: true,
                      })
                  : "Not Assigned"}
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
                                  <span style={{ color: "#C14810" }}>
                                    Reschedule Service On
                                    {new Date(
                                      booking.bookedDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                    {" | "}
                                    {booking.timeSlot}
                                    {/* Assuming bookedTimeSlot is in the correct format */}
                                  </span>
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  <td>{booking.rescheduleReason}</td>
                                </div>
                              </div>
                            </td>
                            <td
                              className="text-end"
                              style={{ backgroundColor: "#f0f0f0" }}
                            ></td>
                          </tr>
                        )}
                 <tr key={booking.id}style={{ height: "70px",width:'500px' }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                             {bookingStatuses[booking.id]?.serviceStarted !== "No"
                     ? `${new Date(bookingStatuses[booking.id]?.serviceStarted).toLocaleDateString("en-US", {
                        month: "short",
                         day: "2-digit",
                          year: "numeric",
                     })} | ${new Date(bookingStatuses[booking.id]?.serviceStarted).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                       hour12: true,
                        })}`
                 : `${new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                     year: "numeric",
                    })} | ${new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                     minute: "2-digit",
                      hour12: true,
                         })}`}
                            </span>
                            <br />
                            Service Started
                          </td>
                          <td
                            className="text-end "
                            style={{ backgroundColor: "#f0f0f0" }}
                          >
                           {
                              !(
                                selectedBookingIdForCancellation &&
                                cancellationReason
                              ) && (  
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
                        <tr style={{ height: "80px",width:"500px" }}>
                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                               {bookingStatuses[booking.id]?.serviceCompleted !== "No"
                               ? `${new Date(bookingStatuses[booking.id]?.serviceCompleted).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })} | ${new Date(bookingStatuses[booking.id]?.serviceCompleted).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}`
                              : `${new Date().toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })} | ${new Date().toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}`}
                            </span>
                            <br />
                            <span style={{ color: getTextColor() }}>  Service Completed  </span>
                          </td>
                          <td
                            className="text-end"
                            style={{ backgroundColor: "#f0f0f0" }}
                          >
                              {
                              !(
                                selectedBookingIdForCancellation &&
                                cancellationReason
                              ) && (  
                               
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
            <Reschedule
              id={selectedBookingId}
              booking={booking}
              onClose={closeRescheduleModal}
              onReschedule={handleRescheduleSuccess}
            />
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
