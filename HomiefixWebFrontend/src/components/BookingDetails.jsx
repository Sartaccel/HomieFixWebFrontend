import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/BookingDetails.css";
import statusRescheduled from "../assets/Status Rescheduled.png";
import statusAssigned from "../assets/Status Assigned.png";
import statusStarted from "../assets/Status Started.png";
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
      newBooking.worker?.contact !== prevBooking.worker?.contact
    ) {
      return true;
    }
  }

  return false;
};

const transformBookingData = (booking) => ({
  id: Number(booking.id),
  service: booking.productName,
  name: booking.userProfile.fullName,
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
      : booking.bookingStatus === "PENDING"
      ? "Pending"
      : "Unknown",
  worker: booking.worker
    ? {
        name: booking.worker.name,
        contact: booking.worker.contactNumber,
      }
    : null,
});

const fetchBookings = async (setBookings, prevBookingsRef, setInitialLoad) => {
  try {
    const response = await api.get("/booking/all");
    const transformedBookings = response.data
      .map(transformBookingData)
      .sort((a, b) => b.id - a.id); // Sort by ID in descending order

    if (hasBookingChanges(transformedBookings, prevBookingsRef.current)) {
      setBookings(transformedBookings);
      prevBookingsRef.current = transformedBookings;
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    setInitialLoad(false);
  }
};

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
  const [initialLoad, setInitialLoad] = useState(true);
  const prevBookingsRef = useRef([]);

  // Date filters
  const [selectedDateBookings, setSelectedDateBookings] = useState(null);
  const [selectedDateInProgress, setSelectedDateInProgress] = useState(null);
  const [selectedDateCompleted, setSelectedDateCompleted] = useState(null);
  const [selectedDateCanceled, setSelectedDateCanceled] = useState(null);

  // Fetch bookings from the API
  useEffect(() => {
    fetchBookings(setBookings, prevBookingsRef, setInitialLoad);

    const interval = setInterval(() => {
      fetchBookings(setBookings, prevBookingsRef, () => {});
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Fetch ratings for completed bookings
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
        }
      }

      setRatings(ratingsData);
    };

    fetchRatings();
  }, [bookings, activeTab, initialLoad]);

  // Memoize filtered bookings
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
            booking.status === "Rescheduled") &&
          booking.worker
      ),
      completed: bookings.filter((booking) => booking.status === "Completed"),
      canceled: bookings.filter((booking) => booking.status === "Canceled"),
    };
  }, [bookings]);

  // Filter function
  const filterBookingsByDate = useCallback((date, bookingsToFilter) => {
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
  }, []);

  // Update filteredBookings
  useEffect(() => {
    if (initialLoad) return;

    let filtered = [];
    let dateFilter = null;

    switch (activeTab) {
      case "bookings":
        dateFilter = selectedDateBookings;
        filtered = filterBookingsByDate(dateFilter, pendingBookings);
        break;
      case "inProgress":
        dateFilter = selectedDateInProgress;
        filtered = filterBookingsByDate(dateFilter, inProgress).filter(
          (booking) => {
            return statusFilter === "All" || booking.status === statusFilter;
          }
        );
        break;
      case "completed":
        dateFilter = selectedDateCompleted;
        filtered = filterBookingsByDate(dateFilter, completed).filter(
          (booking) => {
            if (ratingFilter === "All") return true;
            if (ratingFilter === "No Rating") return !ratings[booking.id];
            return ratings[booking.id] === parseInt(ratingFilter, 10);
          }
        );
        break;
      case "canceled":
        dateFilter = selectedDateCanceled;
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
    selectedDateBookings,
    selectedDateInProgress,
    selectedDateCompleted,
    selectedDateCanceled,
    pendingBookings,
    inProgress,
    completed,
    canceled,
    filterBookingsByDate,
    initialLoad,
  ]);

  // Handle date change
  const handleDateChange = (date) => {
    switch (activeTab) {
      case "bookings":
        setSelectedDateBookings(date);
        break;
      case "inProgress":
        setSelectedDateInProgress(date);
        break;
      case "completed":
        setSelectedDateCompleted(date);
        break;
      case "canceled":
        setSelectedDateCanceled(date);
        break;
      default:
        break;
    }
  };

  // Clear date filter
  const clearDateFilter = () => {
    switch (activeTab) {
      case "bookings":
        setSelectedDateBookings(null);
        break;
      case "inProgress":
        setSelectedDateInProgress(null);
        break;
      case "completed":
        setSelectedDateCompleted(null);
        break;
      case "canceled":
        setSelectedDateCanceled(null);
        break;
      default:
        break;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Rescheduled":
        return { icon: statusRescheduled, width: 140 };
      case "Assigned":
        return { icon: statusAssigned, width: 110 };
      case "Started":
        return { icon: statusStarted, width: 110 };
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 53) => {
    if (!text) return "No Reason Provided";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Skeleton loading for table rows
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

  // Initialize datepicker
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

  // Close dropdown when clicking outside
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

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />

          <div className="navigation-bar d-flex gap-3 py-3 bg-white border-bottom w-100">
            <div
              className={`section ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              Bookings{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {pendingBookings.length}
                </span>
              )}
            </div>
            <div
              className={`section ${
                activeTab === "inProgress" ? "active" : ""
              }`}
              onClick={() => setActiveTab("inProgress")}
            >
              In Progress{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {inProgress.length}
                </span>
              )}
            </div>
            <div
              className={`section ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {completed.length}
                </span>
              )}
            </div>
            <div
              className={`section ${activeTab === "canceled" ? "active" : ""}`}
              onClick={() => setActiveTab("canceled")}
            >
              Canceled{" "}
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {canceled.length}
                </span>
              )}
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
                          ></button>
                          {dropdownOpen && (
                            <div className="dropdown-menu show p-2">
                              <div id="sandbox-container">
                                <div></div>
                              </div>
                            </div>
                          )}
                        </div>
                        {(activeTab === "bookings" && selectedDateBookings) ||
                        (activeTab === "inProgress" &&
                          selectedDateInProgress) ||
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
                      </>
                    )}
                  </th>

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
                        padding: activeTab === "canceled" ? "16px" : "10px",
                      }}
                    >
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
                            {statusFilter}
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="statusFilterDropdown"
                          >
                            {["All", "Assigned", "Rescheduled", "Started"].map(
                              (status) => (
                                <li key={status}>
                                  <button
                                    className="dropdown-item p-2"
                                    onClick={() => setStatusFilter(status)}
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

                  <th className="p-3 text-left" style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {initialLoad
                  ? renderSkeletonRows(5)
                  : filteredBookings.map((booking) => (
                      <tr key={booking.id}>
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
                                <p className="mb-0 ">
                                  {booking.worker.contact}
                                </p>
                              </>
                            ) : (
                              <p className="text-muted">Not Assigned</p>
                            )}
                          </td>
                        ) : (
                          <>
                            <td
                              className="p-3 text-left"
                              style={{ width: "12%" }}
                            >
                              {booking.contact}
                            </td>
                            <td
                              className="p-3 text-left"
                              style={{ width: "25%" }}
                            >
                              {booking.address}
                            </td>
                          </>
                        )}

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
                                navigate(
                                  `/booking-details/view-bookings/${booking.id}`,
                                  {
                                    state: { booking },
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
