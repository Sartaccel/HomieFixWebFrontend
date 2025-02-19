import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "../styles/BookingDetails.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import statusRescheduled from "../assets/Status Rescheduled.png"; // Import status icons
import statusAssigned from "../assets/Status Assigned.png";
import statusStarted from "../assets/Status Started.png";

const BookingDetails = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:2222/booking/all");

        // Check if response is not JSON
        const text = await response.text();
        console.log("Raw Response:", text); // Log raw response for debugging

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Try parsing JSON
        const data = JSON.parse(text);
        console.log("API Data:", data); // Log data

        const transformedBookings = data.map(booking => ({
          id: booking.id,
          service: booking.productName,
          name: booking.userProfile.fullName,
          contact: booking.userProfile.mobileNumber.mobileNumber,
          address: `${booking.deliveryAddress.houseNumber}, ${booking.deliveryAddress.town}, ${booking.deliveryAddress.district}, ${booking.deliveryAddress.state}, ${booking.deliveryAddress.pincode}`,
          date: booking.bookedDate,
          timeslot: booking.timeSlot,
          status: booking.bookingStatus === "COMPLETED" ? "Completed" : 
                  booking.bookingStatus === "CANCELLED" ? "Canceled" : 
                  booking.bookingStatus === "ASSIGNED" ? "Assigned" : 
                  booking.bookingStatus === "STARTED" ? "Started" : 
                  booking.bookingStatus === "RESCHEDULED" ? "Rescheduled" :
                  booking.bookingStatus === "PENDING" ? "Pending" : "Unknown"
        }));
        

        setBookings(transformedBookings);
        setFilteredBookings(transformedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Calculate the number of bookings for each status
  const pendingBookings = bookings.filter(booking => booking.status === "Pending");
  const inProgress = bookings.filter(booking => booking.status === "Started" || booking.status === "Assigned" || booking.status === "Rescheduled");
  const completed = bookings.filter(booking => booking.status === "Completed");
  const canceled = bookings.filter(booking => booking.status === "Canceled");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedSelectedDate = date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");

      const filtered = bookings.filter((booking) => booking.date === formattedSelectedDate);
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    let filtered = bookings;
  
    // Filter by status based on active tab
    if (activeTab === "bookings") {
      // Show only bookings with status "Pending"
      filtered = filtered.filter((booking) => booking.status === "Pending");
    } else if (activeTab === "inProgress") {
      // Show bookings with status "Started", "Assigned", or "Rescheduled"
      filtered = filtered.filter((booking) => 
        booking.status === "Started" || 
        booking.status === "Assigned" || 
        booking.status === "Rescheduled"
      );
    } else if (activeTab === "completed") {
      // Show bookings with status "Completed"
      filtered = filtered.filter((booking) => booking.status === "Completed");
    } else if (activeTab === "canceled") {
      // Show bookings with status "Canceled"
      filtered = filtered.filter((booking) => booking.status === "Canceled");
    }
  
    // Filter by date if selected
    if (selectedDate) {
      const formattedSelectedDate = selectedDate.getFullYear() + "-" +
        String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" +
        String(selectedDate.getDate()).padStart(2, "0");
  
      filtered = filtered.filter((booking) => booking.date === formattedSelectedDate);
    }
  
    console.log("Filtered Bookings:", filtered); // Debugging line
    setFilteredBookings(filtered);
  }, [activeTab, selectedDate, bookings]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to get the status icon based on the status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Rescheduled":
        return statusRescheduled;
      case "Assigned":
        return statusAssigned;
      case "Started":
        return statusStarted;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
            <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Booking Details</h2>
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

          <div className="navigation-bar d-flex gap-3 py-3 bg-white border-bottom w-100">
            <div className={`section ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
              Bookings <span className="badge bg-dark ms-1">{pendingBookings.length}</span>
            </div>
            <div className={`section ${activeTab === "inProgress" ? "active" : ""}`} onClick={() => setActiveTab("inProgress")}>
              In Progress <span className="badge bg-dark ms-1">{inProgress.length}</span>
            </div>
            <div className={`section ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
              Completed <span className="badge bg-dark ms-1">{completed.length}</span>
            </div>
            <div className={`section ${activeTab === "canceled" ? "active" : ""}`} onClick={() => setActiveTab("canceled")}>
              Canceled <span className="badge bg-dark ms-1">{canceled.length}</span>
            </div>
          </div>

          <div className="table-responsive mt-3 w-100 px-0 overflow-auto" style={{ maxHeight: "100%" }}>
            <table className="booking-table table table-hover bg-white rounded shadow-sm align-items-center">
              <thead className="td-height">
                <tr>
                  <th className="p-3" style={{ width: "20%" }}>Service</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3" style={{ width: "25%" }}>Address</th>
                  <th className="p-3">
                    Date
                    <div className="dropdown d-inline ms-2" ref={dropdownRef}>
                      <button
                        className="btn btn-light dropdown-toggle p-0"
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                      </button>
                      {dropdownOpen && (
                        <div className="dropdown-menu show p-2">
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            dateFormat="yyyy-MM-dd"
                            popperPlacement="bottom-start"
                            popperModifiers={[{
                              name: "preventOverflow",
                              options: {
                                boundary: "viewport",
                              },
                            }]}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  {activeTab !== "bookings" && <th className="p-3">Status</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ width: "20%" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-secondary"
                          style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0, // Prevent shrinking
                          }}
                        ></div>
                        <div>
                          <p className="mb-0">{booking.service}</p>
                          <small style={{ color: "#0076CE" }}>ID: {booking.id}</small>
                        </div>
                      </div>
                    </td>

                    <td>{booking.name}</td>
                    <td>{booking.contact}</td>
                    <td style={{ width: "25%" }}>{booking.address}</td>
                    <td>{booking.date}</td>
                    {activeTab !== "bookings" && (
                      <td>
                        {activeTab === "inProgress" ? (
                          <img
                            src={getStatusIcon(booking.status)}
                            alt={booking.status}
                            width="100"
                            height="40"
                          />
                        ) : (
                          booking.status
                        )}
                      </td>
                    )}
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/assign-bookings/${booking.id}`, { state: { booking } })}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingDetails;