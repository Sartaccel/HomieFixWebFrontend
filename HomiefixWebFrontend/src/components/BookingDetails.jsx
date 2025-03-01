import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaStar } from "react-icons/fa";
import "../styles/BookingDetails.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import statusRescheduled from "../assets/Status Rescheduled.png";
import statusAssigned from "../assets/Status Assigned.png";
import statusStarted from "../assets/Status Started.png";
import closeDate from "../assets/close date.png";
import $ from "jquery";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";

const BookingDetails = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratings, setRatings] = useState({});
  const dropdownRef = useRef(null);
  const [ratingFilter, setRatingFilter] = useState("All");

  // Separate selectedDate states for each section
  const [selectedDateBookings, setSelectedDateBookings] = useState(null);
  const [selectedDateInProgress, setSelectedDateInProgress] = useState(null);
  const [selectedDateCompleted, setSelectedDateCompleted] = useState(null);
  const [selectedDateCanceled, setSelectedDateCanceled] = useState(null);

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
          cancelReason: booking.cancelReason,
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
      const completedBookings = bookings.filter(
        (booking) => booking.status === "Completed"
      );
      const ratingsData = {};

      for (const booking of completedBookings) {
        try {
          const response = await fetch(
            `http://localhost:2222/feedback/byBooking/${booking.id}`
          );
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

  const completed = bookings.filter(
    (booking) => booking.status === "Completed"
  );
  const canceled = bookings.filter((booking) => booking.status === "Canceled");

  const handleDateChange = (date) => {
    if (activeTab === "bookings") {
      setSelectedDateBookings(date);
      filterBookingsByDate(date, pendingBookings);
    } else if (activeTab === "inProgress") {
      setSelectedDateInProgress(date);
      filterBookingsByDate(date, inProgress);
    } else if (activeTab === "completed") {
      setSelectedDateCompleted(date);
      filterBookingsByDate(date, completed);
    } else if (activeTab === "canceled") {
      setSelectedDateCanceled(date);
      filterBookingsByDate(date, canceled);
    }
  };

  const filterBookingsByDate = (date, bookingsToFilter) => {
    let filtered = bookingsToFilter;

    if (date) {
      const formattedSelectedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      filtered = filtered.filter(
        (booking) => booking.date === formattedSelectedDate
      );
    }

    setFilteredBookings(filtered);
  };

  const clearDateFilter = () => {
    if (activeTab === "bookings") {
      setSelectedDateBookings(null);
      setFilteredBookings(pendingBookings);
    } else if (activeTab === "inProgress") {
      setSelectedDateInProgress(null);
      setFilteredBookings(inProgress);
    } else if (activeTab === "completed") {
      setSelectedDateCompleted(null);
      setFilteredBookings(completed);
    } else if (activeTab === "canceled") {
      setSelectedDateCanceled(null);
      setFilteredBookings(canceled);
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") {
      filterBookingsByDate(selectedDateBookings, pendingBookings);
    } else if (activeTab === "inProgress") {
      filterBookingsByDate(selectedDateInProgress, inProgress);
    } else if (activeTab === "completed") {
      filterBookingsByDate(selectedDateCompleted, completed);
    } else if (activeTab === "canceled") {
      filterBookingsByDate(selectedDateCanceled, canceled);
    }
  }, [activeTab, selectedDateBookings, selectedDateInProgress, selectedDateCompleted, selectedDateCanceled]);

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

  useEffect(() => {
    if (dropdownOpen) {
      $("#sandbox-container div").datepicker({
        autoclose: true,
        todayHighlight: true,
      }).on("changeDate", function (e) {
        handleDateChange(e.date);
        setDropdownOpen(false);
      });
    }
  }, [dropdownOpen]);

  // Function to format the date as "Feb 25, 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
            <h2
              className="heading align-items-center mb-0 "
              style={{ marginLeft: "31px" }}
            >
              Booking Details
            </h2>
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
              <span className="badge bg-dark ms-1">
                {pendingBookings.length}
              </span>
            </div>
            <div
              className={`section ${
                activeTab === "inProgress" ? "active" : ""
              }`}
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
            style={{ maxHeight: "100%", minHeight: "100%"}}
          >
            <table className="booking-table table table-hover bg-white rounded shadow-sm"  style={{borderRadius: "15px" }}>
              <thead className="td-height" >
                <tr>
                  {/* Service Column */}
                  <th
                    className="p-3 text-left"
                    style={{
                      width:
                        activeTab === "bookings"
                          ? "20%"
                          : activeTab === "inProgress"
                          ? "19.4%"
                          : activeTab === "completed"
                          ? "20.6%"
                          : activeTab === "canceled"
                          ? "18.7%"
                          : "20%",
                    }}
                  >
                    Service
                  </th>

                  {/* Name Column */}
                  <th
                    className="p-3 text-left"
                    style={{
                      width:
                        activeTab === "bookings"
                          ? "13.8%"
                          : activeTab === "completed"
                          ? "15.3%"
                          : activeTab === "inProgress"
                          ? "14.4%"
                          : activeTab === "canceled"
                          ? "16.9%"
                          : "13.8%",
                    }}
                  >
                    Name
                  </th>

                  {/* Worker, Contact, and Address Columns */}
                  {activeTab === "inProgress" ||
                  activeTab === "completed" ||
                  activeTab === "canceled" ? (
                    <th
                      className="p-3 text-left"
                      style={{
                        width:
                          activeTab === "completed"
                            ? "17%"
                            : activeTab === "inProgress"
                            ? "15.5%"
                            : activeTab === "canceled"
                            ? "15.3%"
                            : "16%",
                      }}
                    >
                      Worker
                    </th>
                  ) : (
                    <>
                      <th className="p-3 text-left" style={{ width: "12%" }}>
                        Contact
                      </th>
                      <th className="p-3 text-left" style={{ width: "25%" }}>
                        Address
                      </th>
                    </>
                  )}

                  {/* Date Column */}
                  <th
                    className="text-left"
                    style={{
                      width:
                        activeTab === "bookings"
                          ? "14%"
                          : activeTab === "inProgress"
                          ? "14%"
                          : activeTab === "completed"
                          ? "15%"
                          : activeTab === "canceled"
                          ? "14%"
                          : "14%",
                      padding: "14px",
                    }}
                  >
                    Date
                    <div className="dropdown d-inline ms-2" ref={dropdownRef}>
                      <button
                        className="btn btn-light btn-sm dropdown-toggle p-0"
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      ></button>
                      {dropdownOpen && (
                        <div className="dropdown-menu show p-2">
                          <div id="sandbox-container">
                            <div></div> {/* This is where the datepicker will be rendered */}
                          </div>
                        </div>
                      )}
                    </div>
                    {(activeTab === "bookings" && selectedDateBookings) ||
                    (activeTab === "inProgress" && selectedDateInProgress) ||
                    (activeTab === "completed" && selectedDateCompleted) ||
                    (activeTab === "canceled" && selectedDateCanceled) ? (
                      <img
                        src={closeDate}
                        alt="Close Date Filter"
                        width="20"
                        className="cursor-pointer ms-2"
                        onClick={clearDateFilter}
                      />
                    ) : null}
                  </th>

                  {/* Status/Reason Column */}
                  {activeTab !== "bookings" && (
                    <th
                      className="p-3 text-left"
                      style={{
                        width:
                          activeTab === "inProgress"
                            ? "15%"
                            : activeTab === "completed"
                            ? "15%"
                            : activeTab === "canceled"
                            ? "15%"
                            : "15%",
                      }}
                    >
                      {activeTab === "inProgress" ? (
                        <div
                          className="dropdown d-inline"
                          style={{ marginLeft: "-5px" }}
                        >
                          Status:&nbsp;
                          <button
                            className="btn btn-light btn-sm dropdown-toggle"
                            type="button"
                            id="statusFilterDropdown"
                            data-bs-toggle="dropdown"
                            data-bs-placement="bottom"
                            aria-expanded="false"
                            style={{ padding: "0px" }}
                          >
                            {statusFilter}
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
                        <div className="dropdown p-0 m-0">
                          Rating:&nbsp;
                          <button
                            className="btn btn-light btn-sm dropdown-toggle"
                            type="button"
                            id="ratingFilterDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ height: "25px", padding: "0" }}
                          >
                            {" "}
                            <span className="d-inline-flex align-items-center">
                              <FaStar
                                style={{ color: "gold", marginRight: "4px" }}
                              />
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
                                <FaStar
                                  style={{ color: "gold", marginRight: "4px" }}
                                />
                                All
                              </button>
                            </li>
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <li key={rating}>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() =>
                                    setRatingFilter(rating.toString())
                                  }
                                >
                                  <FaStar
                                    style={{
                                      color: "gold",
                                      marginRight: "4px",
                                    }}
                                  />
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
                        "Reason"
                      )}
                    </th>
                  )}

                  {/* Action Column */}
                  <th className="p-3 text-left" style={{ width: "10%"}}></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    {/* Service Column */}
                    <td
                      className="p-3 text-left"
                      style={{
                        width:
                          activeTab === "bookings"
                            ? "20%"
                            : activeTab === "canceled"
                            ? "18.8%"
                            : activeTab === "completed" ||
                              activeTab === "inProgress"
                            ? "20%"
                            : "20%",
                      }}
                    >
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

                    {/* Name Column */}
                    <td
                      className="p-3 text-left"
                      style={{
                        width:
                          activeTab === "bookings"
                            ? "13.8%"
                            : activeTab === "canceled"
                            ? "17%"
                            : activeTab === "completed" ||
                              activeTab === "inProgress"
                            ? "15%"
                            : "13.8%",
                      }}
                    >
                      {booking.name} <br />
                      {(activeTab === "inProgress" ||
                        activeTab === "completed" ||
                        activeTab === "canceled") && (
                        <span>{booking.contact}</span>
                      )}
                    </td>

                    {/* Worker, Contact, and Address Columns */}
                    {activeTab === "inProgress" ||
                    activeTab === "completed" ||
                    activeTab === "canceled" ? (
                      <td
                        className="p-3 text-left"
                        style={{
                          width:
                            activeTab === "canceled"
                              ? "15%"
                              : activeTab === "completed" ||
                                activeTab === "inProgress"
                              ? "16%"
                              : "16%",
                        }}
                      >
                        {booking.worker ? (
                          <>
                            <p className="mb-0 ">{booking.worker.name}</p>
                            <p className="mb-0 ">{booking.worker.contact}</p>
                          </>
                        ) : (
                          <p className="text-muted">Not Assigned</p>
                        )}
                      </td>
                    ) : (
                      <>
                        <td className="p-3 text-left" style={{ width: "12%" }}>
                          {booking.contact}
                        </td>
                        <td className="p-3 text-left" style={{ width: "25%" }}>
                          {booking.address}
                        </td>
                      </>
                    )}

                    {/* Date Column */}
                    <td
                      className="p-3 text-left"
                      style={{
                        width:
                          activeTab === "bookings"
                            ? "14%"
                            : activeTab === "completed"
                            ? "14%"
                            : activeTab === "inProgress" ||
                              activeTab === "canceled"
                            ? "14%"
                            : "14%",
                      }}
                    >
                      {formatDate(booking.date)} <br />
                      <span>{booking.timeslot}</span>
                    </td>

                    {/* Status/Reason Column */}
                    {activeTab !== "bookings" && (
                      <td
                        className="p-3 text-left"
                        style={{
                          width:
                            activeTab === "inProgress"
                              ? "15%"
                              : activeTab === "completed"
                              ? "15%"
                              : activeTab === "canceled"
                              ? "15%"
                              : "15%",
                        }}
                      >
                        {activeTab === "inProgress" ? (
                          <img
                            src={getStatusIcon(booking.status)}
                            alt={booking.status}
                            width="120"
                            height="40"
                          />
                        ) : activeTab === "completed" ? (
                          <div
                            className="d-flex align-items-center"
                            style={{ marginLeft: "10px" }}
                          >
                            {ratings[booking.id] && (
                              <FaStar style={{ color: "gold" }} />
                            )}
                            <span className="ms-1">
                              {ratings[booking.id] || "No Rating"}
                            </span>
                          </div>
                        ) : (
                          booking.cancelReason || "No Reason Provided"
                        )}
                      </td>
                    )}

                    {/* Action Column */}
                    <td className="p-3 text-left" style={{ width: "10%" }}>
                      {activeTab === "inProgress" ||
                      activeTab === "completed" ||
                      activeTab === "canceled" ? (
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
                            navigate(
                              `/booking-details/assign-bookings/${booking.id}`,
                              {
                                state: { booking },
                              }
                            )
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