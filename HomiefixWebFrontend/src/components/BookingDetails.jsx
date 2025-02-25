import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-datepicker/dist/react-datepicker.css";
import { FaStar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "../styles/BookingDetails.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import statusRescheduled from "../assets/Status Rescheduled.png";
import statusAssigned from "../assets/Status Assigned.png";
import statusStarted from "../assets/Status Started.png";

const BookingDetails = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratings, setRatings] = useState({});
  const dropdownRef = useRef(null);
  const [ratingFilter, setRatingFilter] = useState("All");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:2222/booking/all");
        const text = await response.text();
        console.log("Raw Response:", text);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = JSON.parse(text);
        console.log("API Data:", data);

        const transformedBookings = data.map((booking) => ({
          id: booking.id,
          service: booking.productName,
          name: booking.userProfile.fullName,
          contact: booking.userProfile.mobileNumber.mobileNumber,
          address: `${booking.deliveryAddress.houseNumber}, ${booking.deliveryAddress.town}, ${booking.deliveryAddress.district}, ${booking.deliveryAddress.state}, ${booking.deliveryAddress.pincode}`,
          date: booking.bookedDate,
          timeslot: booking.timeSlot,
          status:
            booking.bookingStatus === "COMPLETED"
              ? "Completed"
              : booking.bookingStatus === "CANCELLED"
              ? "Canceled"
              : booking.bookingStatus === "ASSIGNED"
              ? "Assigned"
              : booking.bookingStatus === "STARTED"
              ? "Started"
              : booking.bookingStatus === "RESCHEDULED"
              ? "Rescheduled"
              : booking.bookingStatus === "PENDING"
              ? "Pending"
              : "Unknown",
          worker: booking.worker
            ? {
                name: booking.worker.name,
                contact: booking.worker.contactNumber,
              }
            : null,
        }));

        setBookings(transformedBookings);
        setFilteredBookings(transformedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      const completedBookings = bookings.filter((booking) => booking.status === "Completed");
      const ratingsData = {};

      for (const booking of completedBookings) {
        try {
          const response = await fetch(`http://localhost:2222/feedback/byBooking/${booking.id}`);
          const data = await response.json();
          if (data.length > 0) {
            ratingsData[booking.id] = data[0].rating;
          }
        } catch (error) {
          console.error("Error fetching rating:", error);
        }
      }

      setRatings(ratingsData);
    };

    if (activeTab === "completed") {
      fetchRatings();
    }
  }, [bookings, activeTab]);

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "Pending" ||
      (booking.status === "Rescheduled" && !booking.worker)
  );

  const inProgress = bookings.filter(
    (booking) =>
      (booking.status === "Started" ||
        booking.status === "Assigned" ||
        booking.status === "Rescheduled") &&
      booking.worker
  );

  const completed = bookings.filter((booking) => booking.status === "Completed");
  const canceled = bookings.filter((booking) => booking.status === "Canceled");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedSelectedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      const filtered = bookings.filter(
        (booking) => booking.date === formattedSelectedDate
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    let filtered = bookings;

    if (activeTab === "bookings") {
      filtered = filtered.filter(
        (booking) =>
          booking.status === "Pending" ||
          (booking.status === "Rescheduled" && !booking.worker)
      );
    } else if (activeTab === "inProgress") {
      filtered = filtered.filter(
        (booking) =>
          (booking.status === "Started" ||
            booking.status === "Assigned" ||
            booking.status === "Rescheduled") &&
          booking.worker
      );

      if (statusFilter !== "All") {
        filtered = filtered.filter((booking) => booking.status === statusFilter);
      }
    } else if (activeTab === "completed") {
      filtered = filtered.filter((booking) => booking.status === "Completed");
      if (ratingFilter !== "All") {
        if (ratingFilter === "No Rating") {
          filtered = filtered.filter((booking) => !ratings[booking.id]);
        } else {
          filtered = filtered.filter((booking) => ratings[booking.id] === parseInt(ratingFilter));
        }
      }
    } else if (activeTab === "canceled") {
      filtered = filtered.filter((booking) => booking.status === "Canceled");
    }

    if (selectedDate) {
      const formattedSelectedDate =
        selectedDate.getFullYear() +
        "-" +
        String(selectedDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(selectedDate.getDate()).padStart(2, "0");

      filtered = filtered.filter(
        (booking) => booking.date === formattedSelectedDate
      );
    }

    console.log("Filtered Bookings:", filtered);
    setFilteredBookings(filtered);
  }, [activeTab, selectedDate, bookings, statusFilter, ratingFilter]);

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
            <h2 className="heading align-items-center mb-0 "  style={{ marginLeft: "31px" }}>Booking Details</h2>
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

          <div className="navigation-bar d-flex gap-3 py-3 bg-white border-bottom w-100">
            <div
              className={`section ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              Bookings{" "}
              <span className="badge bg-dark ms-1">{pendingBookings.length}</span>
            </div>
            <div
              className={`section ${activeTab === "inProgress" ? "active" : ""}`}
              onClick={() => setActiveTab("inProgress")}
            >
              In Progress{" "}
              <span className="badge bg-dark ms-1">{inProgress.length}</span>
            </div>
            <div
              className={`section ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed{" "}
              <span className="badge bg-dark ms-1">{completed.length}</span>
            </div>
            <div
              className={`section ${activeTab === "canceled" ? "active" : ""}`}
              onClick={() => setActiveTab("canceled")}
            >
              Canceled{" "}
              <span className="badge bg-dark ms-1">{canceled.length}</span>
            </div>
          </div>

          <div
            className="table-responsive mt-3 w-100 px-0 overflow-auto"
            style={{ maxHeight: "100%", minHeight: "100%" }}
          >
            <table className="booking-table table table-hover bg-white rounded shadow-sm align-items-center">
              <thead className="td-height">
                <tr>
                  <th className="p-3" style={{ width: "19.5%" }}>
                    Service
                  </th>
                  <th className="p-3" style={{ width: "15%" }}>
                    Name
                  </th>
                  {activeTab === "inProgress" ? (
                    <th className="p-3" style={{ width: "16%" }}>
                      Worker
                    </th>
                  ) : activeTab === "completed" ? (
                    <th className="p-3" style={{ width: "16%" }}>
                      Worker
                    </th>
                  ) : (
                    <>
                      <th className="p-3">Contact</th>
                      <th className="p-3" style={{ width: "25%" }}>
                        Address
                      </th>
                    </>
                  )}
                  <th className="p-3" style={{ width: "14%" }}>
                    Date
                    <div className="dropdown d-inline ms-2" ref={dropdownRef}>
                      <button
                        className="btn btn-light dropdown-toggle p-0"
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      ></button>
                      {dropdownOpen && (
                        <div className="dropdown-menu show p-2">
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            dateFormat="yyyy-MM-dd"
                            popperPlacement="bottom-start"
                            popperModifiers={[
                              {
                                name: "preventOverflow",
                                options: {
                                  boundary: "viewport",
                                },
                              },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  {activeTab !== "bookings" && (
                    <th className="p-3">
                      {activeTab === "inProgress" ? (
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id="statusFilterDropdown"
                            data-bs-toggle="dropdown"
                            data-bs-placement="bottom"
                            aria-expanded="false"
                          >
                            Status: {statusFilter}
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="statusFilterDropdown"
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => setStatusFilter("All")}
                              >
                                All
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => setStatusFilter("Assigned")}
                              >
                                Assigned
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => setStatusFilter("Rescheduled")}
                              >
                                Rescheduled
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => setStatusFilter("Started")}
                              >
                                Started
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : activeTab === "completed" ? (
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id="ratingFilterDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Rating:{" "}
                            <span className="d-inline-flex align-items-center">
                              <FaStar style={{ color: "gold", marginRight: "4px" }} />
                              {ratingFilter}
                            </span>
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="ratingFilterDropdown"
                          >
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center"
                                onClick={() => setRatingFilter("All")}
                              >
                                <FaStar style={{ color: "gold", marginRight: "4px" }} />
                                All
                              </button>
                            </li>
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <li key={rating}>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => setRatingFilter(rating.toString())}
                                >
                                  <FaStar style={{ color: "gold", marginRight: "4px" }} />
                                  {rating}
                                </button>
                              </li>
                            ))}
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center"
                                onClick={() => setRatingFilter("No Rating")}
                              >
                                <FaStar style={{ color: "gold" }} />
                                No Rating
                              </button>
                            </li>
                            
                          </ul>
                        </div>
                      ) : (
                        "Status"
                      )}
                    </th>
                  )}
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
                            flexShrink: 0,
                          }}
                        ></div>
                        <div>
                          <p className="mb-0">{booking.service}</p>
                          <small style={{ color: "#0076CE" }}>
                            ID: {booking.id}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {booking.name} <br />
                      {activeTab === "inProgress" && (
                        <span>{booking.contact}</span>
                      )}
                    </td>
                    {activeTab === "inProgress" ? (
                      <td>
                        {booking.worker ? (
                          <>
                            <p className="mb-0 ">{booking.worker.name}</p>
                            <p className="mb-0 text-muted">
                              {booking.worker.contact}
                            </p>
                          </>
                        ) : (
                          <p className="text-muted">Not Assigned</p>
                        )}
                      </td>
                    ) : activeTab === "completed" ? (
                      <td>
                        {booking.worker ? (
                          <>
                            <p className="mb-0 ">{booking.worker.name}</p>
                            <p className="mb-0 text-muted">
                              {booking.worker.contact}
                            </p>
                          </>
                        ) : (
                          <p className="text-muted">Not Assigned</p>
                        )}
                      </td>
                    ) : (
                      <>
                        <td>{booking.contact}</td>
                        <td style={{ width: "25%" }}>{booking.address}</td>
                      </>
                    )}

                    <td>
                      {booking.date} <br />
                      <span>{booking.timeslot}</span>
                    </td>
                    {activeTab !== "bookings" && (
                      <td>
                        {activeTab === "inProgress" ? (
                          <img
                            src={getStatusIcon(booking.status)}
                            alt={booking.status}
                            width="120"
                            height="40"
                          />
                        ) : activeTab === "completed" ? (
                          <div className="d-flex align-items-center">
                            {ratings[booking.id] && <FaStar style={{ color: "gold" }} />}
                            <span className="ms-1">
                              {ratings[booking.id] || "No Rating"}
                            </span>
                          </div>
                        ) : (
                          booking.status
                        )}
                      </td>
                    )}
                    <td>
                      {activeTab === "inProgress" ? (
                        <button
                          className="btn btn-primary"
                          style={{
                            backgroundColor: "#0076CE",
                            width: "90px",
                            borderRadius: "12px",
                          }}
                          onClick={() =>
                            navigate(`/view-bookings/${booking.id}`, {
                              state: { booking },
                            })
                          }
                        >
                          View
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{
                            backgroundColor: "#0076CE",
                            width: "100px",
                            borderRadius: "12px",
                          }}
                          onClick={() =>
                            navigate(`/booking-details/assign-bookings/${booking.id}`, {
                              state: { booking },
                            })
                          }
                        >
                       Assign
                        </button>
                      )}
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