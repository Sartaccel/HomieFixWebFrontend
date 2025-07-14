import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import api from "../api";
import addWorker from "../assets/addWorker.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [profiles, setProfiles] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  //    Fetch user data
  useEffect(() => {
    api
      .get(`/profile/all`)
      .then((response) => {
        const allUsers = response.data;
        const selectedUser = allUsers.find((user) => user.id === Number(id));
        setUserData(selectedUser);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  //  Fetch Booking data

  useEffect(() => {
    const fetchBookingsAndRatings = async () => {
      try {
        const [bookingRes, feedbackRes] = await Promise.all([
          api.get(`/booking/user/${id}`),
          api.get(`/feedback/byUser/${id}`),
        ]);

        const bookings = bookingRes.data;
        const feedbacks = feedbackRes.data;

        // Step 1: Map feedbacks by bookingId
        const feedbackMap = new Map();
        feedbacks.forEach((fb) => {
          feedbackMap.set(fb.bookingId, fb.rating); // Map bookingId -> rating
        });

        // Step 2: Merge feedback into bookings
        const merged = bookings
          .map((booking) => ({
            ...booking,
            averageRating: feedbackMap.get(booking.id) || "N/A",
          }))
          .sort((a, b) => {
            const dateA = new Date(`${a.bookedDate}T${a.bookingTime}`);
            const dateB = new Date(`${b.bookedDate}T${b.bookingTime}`);
            return dateB - dateA;
          });

        setUserBookings(merged);
      } catch (err) {
        console.error("Error fetching bookings or feedbacks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsAndRatings();
  }, [id]);

  // Ensure addresses exist
  const addresses = userData.addresses || [];

  // Sort addresses by ID (converted to number)
  const sortedAddresses = [...addresses].sort(
    (a, b) => Number(b.id) - Number(a.id)
  );

  const mainAddress = sortedAddresses[0];
  const otherAddresses = sortedAddresses.slice(1);

  //function for filtering
  const filteredBookings =
    statusFilter === "All"
      ? userBookings
      : userBookings.filter((booking) => {
          const status = booking.bookingStatus.toLowerCase();
          const filter = statusFilter.toLowerCase();
          return (
            (status === "pending" && filter === "in progress") ||
            status === filter
          );
        });

  // Function for the badge
  const renderStatusBadge = (isActive) => {
    const styles = {
      backgroundColor: isActive ? "#CDFFF7" : "#FFD5D5",
      color: isActive ? "#14AE5C" : "#FF5757",
      padding: "5px 10px",
    };
    return (
      <span className="badge" style={styles}>
        {isActive ? "Active" : "Deleted"}
      </span>
    );
  };

  return (
    <div className="col-12 p-0 m-0 d-flex flex-column">
      {/* Navbar */}
      <Header />

      <div
        className="navigation-barr d-flex justify-content-between align-items-center py-0 px-3 bg-white w-100"
        style={{ maxHeight: "25px", borderBottom: "0" }}
      >
        <div className="d-flex gap-3 align-items-center">
          <button
            className="btn btn-light p-0"
            style={{ height: "50px", marginTop: "45px", width: "40px" }}
            onClick={() => navigate(`/user-details`)}
          >
            <i
              className="bi bi-arrow-left"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            ></i>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ marginTop: "140px" }}>
        <div className="d-flex">
          {/* LEFT SIDE - stacked boxes */}
          <div className="d-flex flex-column" style={{ width: "33.33%" }}>
            {/* Box 1: User Details */}
            <div
              className="col-12 border p-3 rounded align-self-start h-auto d-flex flex-column"
              style={{
                marginLeft: "15px",
                marginRight: "10px",
                minHeight: "300px",
              }}
            >
              {loading ? (
                <>
                  <Skeleton height={30} width={200} />
                  <Skeleton height={100} width={100} className="my-3" />
                  <Skeleton height={20} width={150} />
                  <Skeleton height={20} width={150} />
                  <Skeleton height={20} width={150} />
                  <Skeleton height={20} width={150} />
                  <Skeleton height={20} width={150} />
                </>
              ) : (
                <>
                  {/* Profile Section */}
                  <div className="row">
                    <div className="d-flex">
                      <div>
                        <img
                          className="rounded"
                          src={addWorker}
                          alt="workerData"
                          height={100}
                          width={100}
                        />
                      </div>
                      <div className="mx-4">
                        <p>
                          <i className="bi bi-person mx-1"></i>
                          {userData.fullName}
                        </p>
                        <p>
                          <i className="bi bi-telephone mx-1"></i>
                          {userData.mobileNumber}
                        </p>
                        <p>
                          <i className="bi bi-envelope mx-1"></i>
                          {userData.email ? userData.email : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  {userData.addresses && userData.addresses.length > 0 && (
                    <div className="row mt-3">
                      <div className="d-flex">
                        <i className="bi bi-geo-alt mx-1"></i>
                        <p>
                          {mainAddress.houseNumber}, {mainAddress.town},{" "}
                          {mainAddress.landmark}, {mainAddress.district},{" "}
                          {mainAddress.state} - {mainAddress.pincode}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="row mt-3">
                    <div className="col-5">
                      <p>Joining Date</p>
                      <p>Status</p>
                      <p>Total bookings</p>
                    </div>
                    <div className="col-7">
                      <p>: {formatDate(userData.firstLoginDate)}</p>
                      <p>: {renderStatusBadge(userData.isActive)}</p>
                      <p>: {userData.totalBookings}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Box 2: Other Addresses */}
            <div
              className="col-12 border p-3 mt-1 rounded align-self-start h-auto d-flex flex-column"
              style={{
                marginLeft: "15px",
                marginRight: "10px",
                maxHeight: "155px",
                overflow: "auto",
              }}
            >
              {loading ? (
                <>
                  <Skeleton height={30} width={200} />
                </>
              ) : (
                <>
                  <div className="row ">
                    <p>Other address </p>
                    {otherAddresses.length === 0 ? (
                      <div className="d-flex">
                        <i className="bi bi-geo-alt mx-1"></i>
                        <p>No other address available</p>
                      </div>
                    ) : (
                      otherAddresses.map((address, index) => (
                        <div
                          className="d-flex mb-2"
                          key={index}
                          style={{ fontSize: "0.9rem" }}
                        >
                          <i className="bi bi-geo-alt mx-1"></i>
                          <p>
                            {address.houseNumber}, {address.town},{" "}
                            {address.landmark}, {address.district},{" "}
                            {address.state} - {address.pincode}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - third box */}
          <div
            className="border p-3   rounded"
            style={{
              maxHeight: "540px",
              width: "100%",
              maxWidth: "874px",
              marginRight: "10px",
              marginLeft: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center px-3 pb-2">
              <h6
                className="px-3 pb-2 text-black mx-3"
                style={{
                  borderBottom: "3px solid #000",
                  display: "inline-block",
                }}
              >
                User Details
              </h6>
              <button
                className="btn btn-light btn-sm dropdown-toggle mb-1"
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
                Status: {statusFilter}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="statusFilterDropdown"
              >
                {[
                  "All",
                  "Completed",
                  "Cancelled",
                  "In Progress",
                  "Rescheduled",
                  "Reassigned", // Add this option
                ].map((status) => (
                  <li key={status}>
                    <button
                      className="dropdown-item p-2"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ overflow: "hidden", padding: "10px 15px" }}>
              <div
                style={{
                  maxHeight: "67vh",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                }}
              >
                <table
                  className="table table-hover"
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    marginBottom: "10",
                    tableLayout: "fixed",
                  }}
                >
                  <thead
                    className="table-light"
                    style={{ position: "sticky", top: 0, zIndex: 2 }}
                  >
                    <tr>
                      <th style={{ width: "10%", padding: "12px" }}>S.No</th>
                      <th style={{ width: "15%", padding: "12px" }}>Service</th>
                      <th style={{ width: "15%", padding: "12px" }}>Name</th>
                      <th style={{ width: "15%", padding: "12px" }}>Date</th>
                      <th style={{ width: "15%", padding: "12px" }}>Rating</th>
                      <th style={{ width: "15%", padding: "12px" }}>Amount</th>
                      <th style={{ width: "15%", padding: "12px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      // Show skeletons while loading
                      Array(5)
                        .fill()
                        .map((_, index) => (
                          <tr key={index}>
                            {Array(7)
                              .fill()
                              .map((__, tdIndex) => (
                                <td key={tdIndex} style={{ padding: "12px" }}>
                                  <Skeleton width={80} height={20} />
                                </td>
                              ))}
                          </tr>
                        ))
                    ) : filteredBookings.length === 0 ? (
                      // Show "No bookings found"
                      <tr>
                        <td colSpan="7" className="text-center py-4" style={{ overflow: "hidden"}}>
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      // Show actual bookings
                      filteredBookings.map((booking, index) => (
                        <tr key={booking.id}>
                          <td style={{ padding: "12px" }}>{index + 1}</td>
                          <td style={{ padding: "12px" }}>
                            {booking.productName}
                            <div style={{ fontSize: "12px", color: "blue" }}>
                              ID: {booking.id}
                            </div>
                          </td>
                          <td style={{ padding: "12px" }}>
                            {booking.userProfile?.fullName || "—"}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {formatDate(booking.bookedDate)}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            {booking.averageRating || "N/A"}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {booking.totalPrice}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              className="badge"
                              style={{
                                color:
                                  booking.bookingStatus === "PENDING"
                                    ? "#FDD835"
                                    : booking.bookingStatus === "COMPLETED"
                                    ? "#009980"
                                    : booking.bookingStatus === "CANCELLED"
                                    ? "#B8141A"
                                    : booking.bookingStatus === "RESCHEDULED"
                                    ? "#6C757D"
                                    : "#6F42C1",
                                fontWeight: "500",
                              }}
                            >
                              {booking.bookingStatus === "PENDING"
                                ? "IN PROGRESS"
                                : booking.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
