import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ViewBooking.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const ViewBookings = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Fixed missing import
  const booking = location.state?.booking || {};
  const [bookings, setBookings] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [bookedDate, setBookedDate] = useState("");
  const [activeTab, setActiveTab] = useState("serviceDetails");
  const [workers, setWorkers] = useState([]);
  const [serviceStarted, setServiceStarted] = useState("No");
  const [serviceCompleted, setServiceCompleted] = useState("No");
  const [endTime, setEndTime] = useState(null);
  ;

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
  }, [id]); // Added id in dependencies

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch("http://localhost:2222/booking/all");
        const data = await response.json();

        const currentBooking = data.find(b => String(b.id) === String(id));
        if (currentBooking) {
          setBookings(currentBooking);
          setBookingDate(currentBooking.bookingDate || "N/A");
          setBookedDate(currentBooking["bookedDate"] || "N/A");
          setTimeSlot(currentBooking.timeSlot || "N/A"); // Fix key if needed
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [id]); // Dependency array ensures it runs when `id` changes

  const SetBookedDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }) +
      " - " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
  };
  const updateBooking = async () => {
    const updatedData = {
      bookingDate: bookingDate !== "Yes" ? bookingDate : null,
      bookedDate: bookedDate !== "Yes" ? bookedDate : null,
      serviceStarted: serviceStarted !== "Yes" ? serviceStarted : null,
      serviceCompleted: serviceCompleted !== "Yes" ? serviceCompleted : null
    };

    try {
      const response = await fetch(`http://localhost:2222/booking/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();  // Try to parse JSON response

      console.log("Server Response:", responseData);

      if (response.ok) {
        alert("Booking updated successfully!");
      } else {
        alert(`Failed to update booking. Server responded with: ${responseData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking.");
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
            <div className="d-flex gap-3 align-items-center">
              <button className="btn btn-light p-2" style={{ marginBottom: "-20px" }} onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem", fontWeight: "bold" }}></i>
              </button>
              <div
                className={`section ${activeTab === "serviceDetails" ? "active" : ""}`}
                onClick={() => setActiveTab("serviceDetails")}
              >
                Service Details
              </div>
            </div>
            {/* Right side buttons */}
            <div className="d-flex gap-3 p-2" style={{ marginRight: "300px" }}>
              <button className="btn btn-outline-primary">Reschedule</button>
              <button className="btn btn-outline-danger">Cancel Service</button>
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
                    <p className="mb-0">{booking.service}</p>
                    <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                  </div>
                </div>

                <div className="p-0 m-0 mt-4">
                  <h6>Customer Details</h6>
                  <p className="mb-1"><i className="bi bi-person-fill me-2"></i> {booking.name}</p>
                  <p className="mb-1"><i className="bi bi-telephone-fill me-2"></i> {booking.contact}</p>
                  <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {booking.address}</p>
                  <p className="mb-1"><i className="bi bi-calendar-event-fill me-2"></i> {booking.date}</p>
                </div>

                {/* Comment Field (Notes) */}
                <div className="mt-3 position-relative" style={{ width: "500px" }}>
                  <span
                    className="position-absolute"
                    style={{ top: "5px", right: "10px", fontSize: "14px", color: "#0076CE", cursor: "pointer" }}
                  >
                    Edit
                  </span>
                  <textarea id="notes" className="form-control" placeholder="Notes" rows="4" style={{ resize: "none", height: "150px" }}></textarea>
                </div>

                {/* Worker Details */}
                <div className="mt-4">
                  <h6>Worker Details</h6>
                  {workers.length > 0 ? (
                    workers.map((worker) => (

                      <div key={worker.id} className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-secondary"
                            style={{
                              width: "100px",
                              height: "100px",
                              marginTop: "-30px",
                              flexShrink: 0,
                              backgroundImage: `url(${worker.profilePicUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                        </div>
                        <div className="ms-3">
                          <p className="mb-1"><i className="bi bi-person-fill me-2"></i>{worker.name}</p>
                          <p className="mb-1"><i className="bi bi-telephone-fill me-2"></i> {worker.contactNumber}</p>
                          <p className="mb-1"><i className="bi bi-house-fill me-2"></i> {worker.houseNumber}</p>
                          <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {worker.pincode}</p>
                          <p className="mb-1"><i className="bi bi-signpost-fill me-2"></i> {worker.nearbyLandmark}</p>
                          <p className="mb-1"><i className="bi bi-map-fill me-2"></i> {worker.district}</p>
                          <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {worker.state}</p>

                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No workers assigned</p>
                  )}
                </div>
              </div>

              {/* Right Card - Service Details */}
              <div className="col-md-6">
                <div className="card rounded p-4 shadow-sm" style={{ marginTop: "60px", minHeight: "400px", maxWidth: "550px", border: "1px solid #ddd", borderRadius: "12px" }}>
                  <h5>Status update</h5>
                  <div className="p-3 mt-3 rounded" style={{ height: "350px", border: "1px solid #ccc", borderRadius: "10px" }}>
                    <table className="table w-100">
                      <tbody>


                        <tr style={{ height: "50px" }}>

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
                              })}</tr>

                            Booking Successful on  {new Date(bookingDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                            {bookings.timeSlot ? ` | ${bookings.timeSlot}` : ""}</td>

                        </tr>


                        <tr style={{ height: "50px" }}>

                          <td className="text-start border-right">
                            <span style={{ color: "grey" }}>
                              {bookedDate !== "No"
                                ? new Date(bookedDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                                : "Not Assigned"}
                            </span><br />

                            Worker Assigned</td>

                          <td className="text-end bg-grey" >
                            <div className="custom-dropdown">
                              <select
                                className="no-border"
                                onChange={(e) => { setBookedDate(e.target.value === "Yes" ? new Date().toISOString() : "No"); }}
                                value={bookedDate !== "No" ? "Yes" : "No"}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>
                          </td>

                        </tr>

                        <tr style={{ height: "50px" }}>
                          <td className="text-start border-right">
                            <span >
                              {serviceStarted !== "No"
                                ? new Date(serviceStarted).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
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

                          <td className="text-end bg-grey">

                            <div className="custom-dropdown">
                              <select
                                className="no-border"
                                onChange={(e) => setServiceStarted(e.target.value === "Yes" ? new Date().toISOString() : "No")}
                                value={serviceStarted !== "No" ? "Yes" : "No"}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>
                            {/* Display Service Started Time */}


                          </td>

                        </tr>


                        <tr style={{ height: "60px" }}>

                          <td className="text-start border-right"><span style={{ color: "grey" }}>
                            {serviceCompleted !== "No"
                              ? new Date(serviceCompleted).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
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
                            Service Completed</td>
                          <td className="text-end bg-grey">
                            <div className="custom-dropdown">
                              <select
                                className="no-border"
                                onChange={(e) => setServiceCompleted(e.target.value === "Yes" ? new Date().toISOString() : "No")}
                                value={serviceCompleted !== "No" ? "Yes" : "No"}
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>

                          </td>
                        </tr>

                      </tbody>
                    </table>
                    <button className="btn btn-primary w-100" onClick={updateBooking}>Update</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewBookings;
