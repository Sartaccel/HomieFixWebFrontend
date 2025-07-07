import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/BookingDetails.css";
import statusRescheduled from "../assets/Rescheduled.svg";
import statusAssigned from "../assets/Assigned.svg";
import statusStarted from "../assets/Started.svg";
import statusReassigned from "../assets/Reassigned.svg";
import closeDate from "../assets/close date.png";
import $ from "jquery";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";
import Header from "./Header";
import api from "../api";

const hasBookingChanges = (newBookings, prevBookings) => {
  if (newBookings.length !== prevBookings.length) return true;

  const prevBookingMap = new Map(prevBookings.map((b) => [b.id, b]));

  for (const newBooking of newBookings) {
    const prevBooking = prevBookingMap.get(newBooking.id);

    if (
      !prevBooking ||
      newBooking.status !== prevBooking.status ||
      newBooking.worker?.name !== prevBooking.worker?.name ||
      newBooking.worker?.contact !== prevBooking.worker?.contact ||
      newBooking.isDeletedUser !== prevBooking.isDeletedUser
    ) {
      return true;
    }
  }

  return false;
};

const transformBookingData = (booking) => ({
  id: Number(booking.id),
  service: booking.productName,
  name: booking.userFullName,
  contact: booking.userProfile.mobileNumber.mobileNumber,
  address: `${booking.deliveryAddress.houseNumber}, ${booking.deliveryAddress.town}, ${booking.deliveryAddress.district}, ${booking.deliveryAddress.state}, ${booking.deliveryAddress.pincode}`,
  date: new Date(booking.bookedDate),
  timeslot: booking.timeSlot,
  cancelReason: booking.cancelReason,
  productImage: booking.productImage,
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
      : booking.bookingStatus === "REASSIGNED"
      ? "Reassigned"
      : booking.bookingStatus === "PENDING"
      ? "Pending"
      : "Unknown",
  worker: booking.worker
    ? {
        name: booking.worker.name,
        contact: booking.worker.contactNumber,
      }
    : null,
  isDeletedUser: !booking.userProfile.active,
});
const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState({
    bookings: "All",
    inProgress: "All",
    completed: "All",
    canceled: "All",
  });
  const [ratings, setRatings] = useState({});
  const dropdownRef = useRef(null);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const prevBookingsRef = useRef([]);

  // Date filters for each tab
  const [selectedDates, setSelectedDates] = useState({
    bookings: null,
    inProgress: null,
    completed: null,
    canceled: null,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/booking/all");
      const transformedBookings = response.data
        .map(transformBookingData)
        .sort((a, b) => b.id - a.id);

      if (hasBookingChanges(transformedBookings, prevBookingsRef.current)) {
        setBookings(transformedBookings);
        prevBookingsRef.current = transformedBookings;
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.message === "Network Error") {
        setError(
          "No internet connection. Please check your network and try again."
        );
      } else if (error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError("Failed to load bookings. Please try again later.");
      }
      setBookings([]);
    } finally {
      setInitialLoad(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => {
      fetchBookings();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  useEffect(() => {
    if (activeTab !== "completed" || initialLoad) return;

    const fetchRatings = async () => {
      const completedBookings = bookings.filter(
        (booking) => booking.status === "Completed"
      );
      const ratingsData = {};

      for (const booking of completedBookings) {
        try {
          const response = await api.get(`/feedback/byBooking/${booking.id}`);
          if (response.data.length > 0) {
            ratingsData[booking.id] = response.data[0].rating;
          }
        } catch (error) {
          console.error("Error fetching rating:", error);
          if (error.message === "Network Error") {
            setError(
              "No internet connection. Please check your network and try again."
            );
          }
        }
      }

      setRatings(ratingsData);
    };

    fetchRatings();
  }, [bookings, activeTab, initialLoad]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (
      tab &&
      ["bookings", "inProgress", "completed", "canceled"].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const { pendingBookings, inProgress, completed, canceled } = useMemo(() => {
    return {
      pendingBookings: bookings.filter(
        (booking) =>
          booking.status === "Pending" ||
          (booking.status === "Rescheduled" && !booking.worker)
      ),
      inProgress: bookings.filter(
        (booking) =>
          (booking.status === "Assigned" ||
            booking.status === "Started" ||
            booking.status === "Rescheduled" ||
            booking.status === "Reassigned") && // Add this line
          booking.worker
      ),
      completed: bookings.filter((booking) => booking.status === "Completed"),
      canceled: bookings.filter((booking) => booking.status === "Canceled"),
    };
  }, [bookings]);

  const filterBookingsByDate = useCallback((date, bookingsToFilter) => {
    if (!date) return bookingsToFilter;
    const formattedSelectedDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");
    return bookingsToFilter.filter(
      (booking) =>
        booking.date.toISOString().split("T")[0] === formattedSelectedDate
    );
  }, []);

  useEffect(() => {
    if (initialLoad) return;

    let filtered = [];
    const currentTab = activeTab;
    const dateFilter = selectedDates[currentTab];
    const currentStatusFilter = statusFilter[currentTab];

    switch (currentTab) {
      case "bookings":
        filtered = filterBookingsByDate(dateFilter, pendingBookings);
        break;
      case "inProgress":
        filtered = filterBookingsByDate(dateFilter, inProgress).filter(
          (booking) => {
            return (
              currentStatusFilter === "All" ||
              booking.status === currentStatusFilter
            );
          }
        );
        break;
      case "completed":
        filtered = filterBookingsByDate(dateFilter, completed).filter(
          (booking) => {
            if (ratingFilter === "All") return true;
            if (ratingFilter === "No Rating") return !ratings[booking.id];
            return ratings[booking.id] === parseInt(ratingFilter, 10);
          }
        );
        break;
      case "canceled":
        filtered = filterBookingsByDate(dateFilter, canceled);
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
    selectedDates,
    pendingBookings,
    inProgress,
    completed,
    canceled,
    filterBookingsByDate,
    initialLoad,
  ]);

  const handleDateChange = (date) => {
    setSelectedDates((prev) => ({
      ...prev,
      [activeTab]: date,
    }));
  };

  const clearDateFilter = () => {
    setSelectedDates((prev) => ({
      ...prev,
      [activeTab]: null,
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Rescheduled":
        return { icon: statusRescheduled, width: 140 };
      case "Assigned":
        return { icon: statusAssigned, width: 110 };
      case "Started":
        return { icon: statusStarted, width: 110 };
      case "Reassigned":
        return { icon: statusReassigned, width: 140 };
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 53) => {
    if (!text) return "No Reason Provided";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const renderSkeletonRows = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr key={index}>
        <td className="p-3">
          <div className="d-flex align-items-center gap-2">
            <Skeleton circle width={40} height={40} />
            <div>
              <Skeleton width={120} />
              <Skeleton width={80} />
            </div>
          </div>
        </td>
        <td className="p-3">
          <Skeleton />
          <Skeleton width={100} />
        </td>
        {activeTab === "inProgress" ||
        activeTab === "completed" ||
        activeTab === "canceled" ? (
          <td className="p-3">
            <Skeleton />
            <Skeleton width={100} />
          </td>
        ) : (
          <>
            <td className="p-3">
              <Skeleton />
            </td>
            <td className="p-3">
              <Skeleton count={2} />
            </td>
          </>
        )}
        <td className="p-3">
          <Skeleton />
          <Skeleton width={80} />
        </td>
        {activeTab !== "bookings" && (
          <td className="p-3">
            {activeTab === "inProgress" ? (
              <Skeleton width={140} height={40} />
            ) : activeTab === "completed" ? (
              <div className="d-flex align-items-center">
                <Skeleton circle width={20} height={20} />
                <Skeleton width={30} className="ms-2" />
              </div>
            ) : (
              <Skeleton />
            )}
          </td>
        )}
        <td className="p-3">
          <Skeleton width={90} height={35} />
        </td>
      </tr>
    ));
  };

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

  // Get filtered counts for each tab
  const getFilteredCounts = useMemo(() => {
    const counts = {
      bookings: pendingBookings.length,
      inProgress: inProgress.length,
      completed: completed.length,
      canceled: canceled.length,
    };

    // Apply date filters to counts
    Object.keys(selectedDates).forEach((tab) => {
      if (selectedDates[tab]) {
        const bookingsToFilter = {
          bookings: pendingBookings,
          inProgress: inProgress,
          completed: completed,
          canceled: canceled,
        }[tab];

        counts[tab] = filterBookingsByDate(
          selectedDates[tab],
          bookingsToFilter
        ).length;
      }
    });

    // Apply status filter to inProgress tab
    if (statusFilter.inProgress !== "All") {
      counts.inProgress = filterBookingsByDate(
        selectedDates.inProgress,
        inProgress
      ).filter((b) => b.status === statusFilter.inProgress).length;
    }

    // Apply rating filter to completed tab
    if (ratingFilter !== "All") {
      counts.completed = filterBookingsByDate(
        selectedDates.completed,
        completed
      ).filter((b) => {
        if (ratingFilter === "No Rating") return !ratings[b.id];
        return ratings[b.id] === parseInt(ratingFilter, 10);
      }).length;
    }

    return counts;
  }, [
    pendingBookings,
    inProgress,
    completed,
    canceled,
    selectedDates,
    statusFilter.inProgress,
    ratingFilter,
    ratings,
    filterBookingsByDate,
  ]);

  // Determine column classes based on active tab
  const getColumnClasses = () => {
    const baseClasses = "text-left align-middle";

    if (activeTab === "bookings") {
      return {
        service: `${baseClasses} col-md-2 col-3`, // Service column
        name: `${baseClasses} col-md-2 col-2`, // Name column
        contact: `${baseClasses} col-md-1 col-2`, // Contact column
        address: `${baseClasses} col-md-3 col-3`, // Address column
        date: `${baseClasses} col-md-2 col-2`, // Date column
        action: `${baseClasses} col-md-2 col-2`, // Action column
      };
    } else {
      return {
        service: `${baseClasses} col-md-2 col-3`, // Service column
        name: `${baseClasses} col-md-2 col-2`, // Name column
        worker: `${baseClasses} col-md-2 col-2`, // Worker column
        date: `${baseClasses} col-md-2 col-2`, // Date column
        status: `${baseClasses} col-md-2 col-2`, // Status/Reason column
        action: `${baseClasses} col-md-2 col-2`, // Action column
      };
    }
  };

  const columnClasses = getColumnClasses();

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />

          <div className="navigation-barr d-flex gap-3 py-3 bg-white border-bottom w-100">
            <div
              className={`section ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("bookings");
                navigate("/booking-details?tab=bookings");
              }}
            >
              Bookings{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {activeTab === "bookings"
                    ? filteredBookings.length
                    : getFilteredCounts.bookings}
                </span>
              )}
            </div>
            <div
              className={`section ${
                activeTab === "inProgress" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("inProgress");
                navigate("/booking-details?tab=inProgress");
              }}
            >
              In Progress{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {activeTab === "inProgress"
                    ? filteredBookings.length
                    : getFilteredCounts.inProgress}
                </span>
              )}
            </div>
            <div
              className={`section ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("completed");
                navigate("/booking-details?tab=completed");
              }}
            >
              Completed{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {activeTab === "completed"
                    ? filteredBookings.length
                    : getFilteredCounts.completed}
                </span>
              )}
            </div>
            <div
              className={`section ${activeTab === "canceled" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("canceled");
                navigate("/booking-details?tab=canceled");
              }}
            >
              Canceled{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {activeTab === "canceled"
                    ? filteredBookings.length
                    : getFilteredCounts.canceled}
                </span>
              )}
            </div>
          </div>

          <div
            className="table-responsive mt-3 w-100 px-0 overflow-auto"
            style={{ maxHeight: "100%", minHeight: "100%" }}
          >
            {error ? (
              <div
                className="alert alert-danger text-center m-3 mt-5"
                style={{
                  position: "fixed",
                  top: "110px",
                  left: "40%",
                  zIndex: 2000,
                }}
              >
                <div className="mb-3">
                  <i
                    className="bi bi-wifi-off"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
                {error}
                <button
                  className="btn  ms-3"
                  style={{ backgroundColor: "#0076CE", color: "white" }}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <table className="booking-table table table-hover bg-white rounded shadow-sm w-80 ">
                <thead className="td-height">
                  <tr>
                    <th className={`p-3 ${columnClasses.service}`}>Service</th>

                    <th className={`p-3 ${columnClasses.name}`}>Name</th>

                    {activeTab === "inProgress" ||
                    activeTab === "completed" ||
                    activeTab === "canceled" ? (
                      <th className={`p-3 ${columnClasses.worker}`}>Worker</th>
                    ) : (
                      <>
                        <th
                          className={`p-3 ${columnClasses.contact}`}
                          style={{ width: "200px" }}
                        >
                          Contact
                        </th>
                        <th className={`p-3 ${columnClasses.address}`}>
                          Address
                        </th>
                      </>
                    )}
                    <th className={`p-3 ${columnClasses.date}`}>
                      {!initialLoad && (
                        <>
                          <div
                            className="dropdown d-inline ms-2"
                            ref={dropdownRef}
                          >
                            <button
                              className="btn btn-light btn-sm dropdown-toggle p-0"
                              type="button"
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                              Date
                            </button>
                            {dropdownOpen && (
                              <div className="dropdown-menu show p-2">
                                <div id="sandbox-container">
                                  <div></div>
                                </div>
                              </div>
                            )}
                          </div>
                          {selectedDates[activeTab] ? (
                            <img
                              src={closeDate}
                              alt="Close Date Filter"
                              width="20"
                              className="cursor-pointer ms-2"
                              onClick={clearDateFilter}
                            />
                          ) : null}
                        </>
                      )}
                    </th>

                    {activeTab !== "bookings" && (
                      <th className={`p-3 ${columnClasses.status}`}>
                        {initialLoad ? (
                          <Skeleton width={100} />
                        ) : activeTab === "inProgress" ? (
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
                            >
                              Status:&nbsp;
                              {statusFilter.inProgress}
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="statusFilterDropdown"
                            >
                              {[
                                "All",
                                "Assigned",
                                "Rescheduled",
                                "Reassigned", // Add this option
                                "Started",
                              ].map((status) => (
                                <li key={status}>
                                  <button
                                    className="dropdown-item p-2"
                                    onClick={() =>
                                      setStatusFilter((prev) => ({
                                        ...prev,
                                        inProgress: status,
                                      }))
                                    }
                                  >
                                    {status}
                                  </button>
                                </li>
                              ))}
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
                            >
                              Rating:&nbsp;
                              <span className="d-inline-flex align-items-center">
                                <FaStar
                                  style={{ color: "gold", marginRight: "4px" }}
                                />
                                {ratingFilter}
                              </span>
                            </button>
                            <ul
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="ratingFilterDropdown"
                            >
                              {["All", 5, 4, 3, 2, 1, "No Rating"].map(
                                (rating) => (
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

                    <th className={`p-3 ${columnClasses.action}`}></th>
                  </tr>
                </thead>
                <tbody>
                  {initialLoad ? (
                    renderSkeletonRows(5)
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        style={
                          booking.isDeletedUser
                            ? {
                                textDecoration: "line-through",
                                color: "#6c757d",
                              }
                            : {}
                        }
                      >
                        <td className={`p-3 ${columnClasses.service}`}>
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

                        <td className={`p-3 ${columnClasses.name}`}>
                          {booking.name}
                          {booking.isDeletedUser && (
                            <span className="badge bg-danger ms-1">
                              Deleted User
                            </span>
                          )}
                          <br />
                          {(activeTab === "inProgress" ||
                            activeTab === "completed" ||
                            activeTab === "canceled") && (
                            <span>{booking.contact}</span>
                          )}
                        </td>

                        {activeTab === "inProgress" ||
                        activeTab === "completed" ||
                        activeTab === "canceled" ? (
                          <td className={`p-3 ${columnClasses.worker}`}>
                            {booking.worker ? (
                              <>
                                <p className="mb-0">{booking.worker.name}</p>
                                <p className="mb-0">{booking.worker.contact}</p>
                              </>
                            ) : (
                              <p className="text-muted">Not Assigned</p>
                            )}
                          </td>
                        ) : (
                          <>
                            <td
                              className={`p-3 ${columnClasses.contact}`}
                              style={{ width: "200px" }}
                            >
                              {booking.contact}
                            </td>
                            <td className={`p-3 ${columnClasses.address}`}>
                              {booking.address}
                            </td>
                          </>
                        )}

                        <td className={`p-3 ${columnClasses.date}`}>
                          {formatDate(booking.date)} <br />
                          <span>{booking.timeslot}</span>
                        </td>

                        {activeTab !== "bookings" && (
                          <td className={`p-3 ${columnClasses.status}`}>
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
                                style={{
                                  marginLeft:
                                    booking.status === "Reassigned"
                                      ? "-8px"
                                      : "0px", // tweak as needed
                                }}
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
                                  {ratings[booking.id] || "No ratings"}
                                </span>
                              </div>
                            ) : (
                              <span>{truncateText(booking.cancelReason)}</span>
                            )}
                          </td>
                        )}

                        <td className={`p-3 ${columnClasses.action}`}>
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
                                navigate(
                                  `/booking-details/view-bookings/${booking.id}`,
                                  {
                                    state: {
                                      booking,
                                      previousTab: activeTab,
                                    },
                                  }
                                )
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
                                    state: {
                                      booking,
                                      previousTab: activeTab,
                                    },
                                  }
                                )
                              }
                              disabled={booking.isDeletedUser}
                            >
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={activeTab === "bookings" ? 6 : 7}
                        className="text-center py-5"
                      >
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                            alt="No bookings"
                            width="100"
                            className="mb-3"
                          />
                          <h5 className="text-muted">No bookings found</h5>
                          <p className="text-muted">
                            {selectedDates[activeTab]
                              ? "No bookings match your selected filters."
                              : activeTab === "inProgress" &&
                                statusFilter.inProgress !== "All"
                              ? `No ${statusFilter.inProgress.toLowerCase()} bookings available.`
                              : activeTab === "completed" &&
                                ratingFilter !== "All"
                              ? `No bookings with ${
                                  ratingFilter === "No Rating"
                                    ? "no rating"
                                    : `${ratingFilter} star rating`
                                }.`
                              : "No bookings available at the moment."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingDetails;
