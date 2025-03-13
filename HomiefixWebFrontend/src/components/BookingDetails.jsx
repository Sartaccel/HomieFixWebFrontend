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
import Header from "./Header";

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

  // Fetch bookings from the API
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
          productImage: booking.productImage, // Add productImage to the transformed booking
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
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Fetch ratings for completed bookings
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
      (booking.status === "Rescheduled" && !booking.worker) // Rescheduled bookings without workers stay in pending
  );

  const inProgress = bookings.filter(
    (booking) =>
      (booking.status === "Assigned" ||
        booking.status === "Started" ||
        booking.status === "Rescheduled") &&
      booking.worker // Only include bookings with a worker
  );

  const completed = bookings.filter(
    (booking) => booking.status === "Completed"
  );
  const canceled = bookings.filter((booking) => booking.status === "Canceled");

  // Update filteredBookings whenever activeTab or bookings change
  useEffect(() => {
    let filtered = [];
    switch (activeTab) {
      case "bookings":
        filtered = filterBookingsByDate(selectedDateBookings, pendingBookings);
        break;
      case "inProgress":
        filtered = filterBookingsByDate(
          selectedDateInProgress,
          inProgress
        ).filter((booking) => {
          if (statusFilter === "All") {
            return true;
          } else {
            return booking.status === statusFilter;
          }
        });
        break;
      case "completed":
        filtered = filterBookingsByDate(
          selectedDateCompleted,
          completed
        ).filter((booking) => {
          if (ratingFilter === "All") {
            return true;
          } else if (ratingFilter === "No Rating") {
            return !ratings[booking.id];
          } else {
            return ratings[booking.id] === parseInt(ratingFilter, 10);
          }
        });
        break;
      case "canceled":
        filtered = filterBookingsByDate(selectedDateCanceled, canceled);
        break;
      default:
        filtered = [];
    }
    setFilteredBookings(filtered);
  }, [
    activeTab,
    bookings,
    ratingFilter,
    ratings,
    statusFilter,
    selectedDateBookings,
    selectedDateInProgress,
    selectedDateCompleted,
    selectedDateCanceled,
  ]); // Add selectedDate states as dependencies

  // Handle date filter changes
  const handleDateChange = (date) => {
    switch (activeTab) {
      case "bookings":
        setSelectedDateBookings(date);
        setFilteredBookings(filterBookingsByDate(date, pendingBookings));
        break;
      case "inProgress":
        setSelectedDateInProgress(date);
        setFilteredBookings(
          filterBookingsByDate(date, inProgress).filter((booking) => {
            if (statusFilter === "All") {
              return true;
            } else {
              return booking.status === statusFilter;
            }
          })
        );
        break;
      case "completed":
        setSelectedDateCompleted(date);
        setFilteredBookings(
          filterBookingsByDate(date, completed).filter((booking) => {
            if (ratingFilter === "All") {
              return true;
            } else if (ratingFilter === "No Rating") {
              return !ratings[booking.id];
            } else {
              return ratings[booking.id] === parseInt(ratingFilter, 10);
            }
          })
        );
        break;
      case "canceled":
        setSelectedDateCanceled(date);
        setFilteredBookings(filterBookingsByDate(date, canceled));
        break;
      default:
        setFilteredBookings([]);
    }
  };
  const filterBookingsByDate = (date, bookingsToFilter) => {
    if (!date) return bookingsToFilter;

    const formattedSelectedDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    return bookingsToFilter.filter(
      (booking) => booking.date === formattedSelectedDate
    );
  };

  const truncateText = (text, maxLength = 53) => {
    if (!text) return "No Reason Provided";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Clear date filter
  const clearDateFilter = () => {
    switch (activeTab) {
      case "bookings":
        setSelectedDateBookings(null);
        setFilteredBookings(pendingBookings);
        break;
      case "inProgress":
        setSelectedDateInProgress(null);
        setFilteredBookings(
          inProgress.filter((booking) => {
            if (statusFilter === "All") {
              return true;
            } else {
              return booking.status === statusFilter;
            }
          })
        );
        break;
      case "completed":
        setSelectedDateCompleted(null);
        setFilteredBookings(
          completed.filter((booking) => {
            if (ratingFilter === "All") {
              return true;
            } else if (ratingFilter === "No Rating") {
              return !ratings[booking.id];
            } else {
              return ratings[booking.id] === parseInt(ratingFilter, 10);
            }
          })
        );
        break;
      case "canceled":
        setSelectedDateCanceled(null);
        setFilteredBookings(canceled);
        break;
      default:
        setFilteredBookings([]);
    }
  };

  // Get status icon based on booking status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Rescheduled":
        return { icon: statusRescheduled, width: 140 }; // Adjust width as needed
      case "Assigned":
        return { icon: statusAssigned, width: 110 }; // Adjust width as needed
      case "Started":
        return { icon: statusStarted, width: 110 }; // Adjust width as needed
      default:
        return null;
    }
  };

  // Initialize datepicker when dropdown is open
  useEffect(() => {
    if (dropdownOpen) {
      $("#sandbox-container div")
        .datepicker({
          autoclose: true,
          todayHighlight: true,
        })
        .on("changeDate", function (e) {
          handleDateChange(e.date);
          setDropdownOpen(false);
        });
    }
  }, [dropdownOpen]);

  // Format date as "Feb 25, 2025"
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
          
          <Header/>
          <div className=" d-flex gap-3 pt-3 bg-white border-bottom w-100 mt-5">
            <div
              className={`section ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              Bookings{" "}
              <span className="badge bg-dark ms-1" style={{borderRadius:"45%"}}>
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
              <span className="badge bg-dark ms-1" style={{borderRadius:"45%"}}>{inProgress.length}</span>
            </div>
            <div
              className={`section ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed{" "}
              <span className="badge bg-dark ms-1" style={{borderRadius:"45%"}}>{completed.length}</span>
            </div>
            <div
              className={`section ${activeTab === "canceled" ? "active" : ""}`}
              onClick={() => setActiveTab("canceled")}
            >
              Canceled{" "}
              <span className="badge bg-dark ms-1"style={{borderRadius:"45%"}}>{canceled.length}</span>
            </div>
          </div>

          <div
            className="table-responsive mt-3 w-100 px-0 overflow-auto"
            style={{ maxHeight: "100%", minHeight: "100%" }}
          >
            <table
              className="booking-table table table-hover bg-white rounded shadow-sm"
              style={{ borderRadius: "15px" }}
            >
              <thead className="td-height">
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
                          ? "19.8%"
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
                            ? "15.8%"
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
                            <div></div>{" "}
                            {/* This is where the datepicker will be rendered */}
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
                      className=" text-left"
                      style={{
                        width:
                          activeTab === "inProgress"
                            ? "15%"
                            : activeTab === "completed"
                            ? "15%"
                            : activeTab === "canceled"
                            ? "15%"
                            : "15%",
                        padding: activeTab == "canceled" ? "16px" : "10px",
                      }}
                    >
                      {activeTab === "inProgress" ? (
                        <div
                          className="dropdown d-inline"
                          style={{ marginLeft: "-5px" }}
                        >
                          <button
                            className="btn btn-light btn-sm dropdown-toggle"
                            type="button"
                            id="statusFilterDropdown"
                            data-bs-toggle="dropdown"
                            data-bs-placement="bottom"
                            aria-expanded="false"
                            style={{
                              height: "35px",
                              padding: "2px 10px",
                              background: "transparent",
                              border: "none",
                              transition: "background 0.2s ease-in-out",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onMouseLeave={(e) => {
                              if (!e.target.classList.contains("show")) {
                                e.target.style.background = "transparent";
                              }
                            }}
                            onMouseDown={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onMouseUp={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onFocus={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onBlur={(e) =>
                              setTimeout(
                                () =>
                                  (e.target.style.background = "transparent"),
                                2
                              )
                            }
                          >
                            Status:&nbsp;
                            {statusFilter}
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="statusFilterDropdown"
                            style={{
                              minWidth: "unset",
                              width: "110px",
                              fontSize: "13px",
                              background: "white",
                              borderRadius: "0 0 8px 8px",
                              padding: "5px",
                            }}
                          >
                            {["All", "Assigned", "Rescheduled", "Started"].map(
                              (status) => (
                                <li key={status}>
                                  <button
                                    className="dropdown-item p-2"
                                    onClick={() => setStatusFilter(status)}
                                    style={{
                                      background:
                                        statusFilter === status
                                          ? "#0076CE"
                                          : "transparent",
                                      color:
                                        statusFilter === status
                                          ? "white"
                                          : "black",
                                      transition: "background 0.2s ease-in-out",
                                      padding: "5px",
                                      borderRadius: "5px",
                                      marginBottom: "5px",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (statusFilter !== status) {
                                        e.target.style.background = "#F2F2F2"; // Light gray on hover
                                        e.target.style.color = "black";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (statusFilter !== status) {
                                        e.target.style.background =
                                          "transparent";
                                        e.target.style.color = "black";
                                      }
                                    }}
                                    onMouseDown={(e) => {
                                      e.target.style.background = "#0056A6";
                                      e.target.style.color = "white";
                                    }}
                                  >
                                    {status}
                                  </button>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      ) : activeTab === "completed" ? (
                        <div className="dropdown p-0 m-0">
                          <button
                            className="btn btn-light btn-sm dropdown-toggle d-flex align-items-center"
                            type="button"
                            id="ratingFilterDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{
                              height: "35px",
                              padding: "2px 10px",
                              background: "transparent",
                              border: "none",
                              transition: "background 0.2s ease-in-out",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onMouseLeave={(e) => {
                              if (!e.target.classList.contains("show")) {
                                e.target.style.background = "transparent";
                              }
                            }}
                            onMouseDown={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onMouseUp={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onFocus={(e) =>
                              (e.target.style.background = "#F0F0F0")
                            }
                            onBlur={(e) =>
                              setTimeout(
                                () =>
                                  (e.target.style.background = "transparent"),
                                2
                              )
                            }
                          >
                            Rating:&nbsp;
                            <span
                              className="d-inline-flex align-items-center"
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#F0F0F0")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                            >
                              <FaStar
                                style={{ color: "gold", marginRight: "4px" }}
                              />
                              {ratingFilter}
                            </span>
                          </button>
                          <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="ratingFilterDropdown"
                            style={{
                              minWidth: "unset",
                              width: "110px",
                              fontSize: "12px",
                              background: "white",
                              borderRadius: "0 0 8px 8px",
                              padding: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {["All", 5, 4, 3, 2, 1, "No Rating"].map(
                              (rating) => (
                                <li key={rating}>
                                  <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() =>
                                      setRatingFilter(rating.toString())
                                    }
                                    style={{
                                      background:
                                        ratingFilter === rating.toString()
                                          ? "#0076CE"
                                          : "transparent",
                                      color:
                                        ratingFilter === rating.toString()
                                          ? "white"
                                          : "black",
                                      transition: "background 0.2s ease-in-out",
                                      padding: "5px 5px",
                                      borderRadius: "5px",
                                      marginBottom: "5px",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (ratingFilter !== rating.toString()) {
                                        e.target.style.background = "#F2F2F2"; // Light gray hover
                                        e.target.style.color = "black";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (ratingFilter !== rating.toString()) {
                                        e.target.style.background =
                                          "transparent";
                                        e.target.style.color = "black";
                                      }
                                    }}
                                    onMouseDown={(e) => {
                                      e.target.style.background = "#0056A6";
                                      e.target.style.color = "white";
                                    }}
                                  >
                                    <FaStar
                                      style={{
                                        color: "gold",
                                        marginRight: "5px",
                                      }}
                                    />
                                    {rating === "No Rating" ? (
                                      <>&nbsp;No Rating</>
                                    ) : (
                                      rating
                                    )}
                                  </button>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      ) : (
                        "Reason"
                      )}
                    </th>
                  )}

                  {/* Action Column */}
                  <th className="p-3 text-left" style={{ width: "10%" }}></th>
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
                            ? "19.2%"
                            : "20%",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
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
                            : activeTab === "completed"
                            ? "15%"
                            : activeTab === "inProgress"
                            ? "14.5%"
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
                              ? "15%"
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
                          width: "15%",
                          maxWidth: "200px",
                          overflow: "hidden",
                        }}
                      >
                        {activeTab === "inProgress" ? (
                          <img
                            src={
                              getStatusIcon(booking.status)
                                ? getStatusIcon(booking.status).icon
                                : null
                            }
                            alt={booking.status}
                            width={
                              getStatusIcon(booking.status)
                                ? getStatusIcon(booking.status).width
                                : 0
                            }
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
                          <span>{truncateText(booking.cancelReason)}</span>
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
                            navigate(`/booking-details/view-bookings/${booking.id}`, {
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