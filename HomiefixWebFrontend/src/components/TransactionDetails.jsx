import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import api from "../api";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DateRangePicker } from "react-date-range";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts for PDF
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2",
      fontWeight: "bold",
    },
  ],
});

const TransactionDetails = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [exportError, setExportError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const [appliedDateRange, setAppliedDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setError(null);
        const response = await api.get("/booking/all");
        const bookingDetails = response.data;
        console.log(bookingDetails);
        const sortedData = bookingDetails.sort(
          (a, b) =>
            new Date(b.paymentCapturedAt) - new Date(a.paymentCapturedAt)
        );
        setDetails(sortedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.message === "Network Error") {
          setError(
            "No internet connection. Please check your network and try again."
          );
        } else if (error.response?.status === 403) {
          localStorage.removeItem("token");
          setToken("");
          navigate("/");
        } else {
          setError("Failed to load user data. Please try again later.");
        }
        setDetails([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [token, setToken, navigate]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredBookings.map((profile) => profile.id));
    } else {
      setSelectedUsers([]);
    }
  };
  // ref for the datepicker popup
  const datePickerRef = useRef(null);

  // close date picker when clicking outside
  // useEffect(() => {
  //   function handleOutsideClick(e) {
  //     if (
  //       showDatePicker &&
  //       datePickerRef.current &&
  //       !datePickerRef.current.contains(e.target)
  //     ) {
  //       setShowDatePicker(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleOutsideClick);
  //   return () => document.removeEventListener("mousedown", handleOutsideClick);
  // }, [showDatePicker]);

  // close date picker when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (!showDatePicker) return;

      // If click is inside your popup container, do nothing
      const clickedInsideRef = datePickerRef.current && datePickerRef.current.contains(e.target);
      if (clickedInsideRef) return;

      // react-date-range often renders calendar nodes into body (portal).
      // Detect common classnames used by the library and treat clicks there as "inside".
      const isInDateRangePicker =
        !!e.target.closest(".rdrCalendarWrapper") ||
        !!e.target.closest(".rdrDateRangePicker") ||
        !!e.target.closest(".rdrDateRangePickerWrapper") ||
        !!e.target.closest(".rdrMonth") ||
        !!e.target.closest(".rdrDay") ||
        !!e.target.closest(".rdrDayNumber");

      if (isInDateRangePicker) return;

      // otherwise it's a genuine outside click -> close
      setShowDatePicker(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDatePicker]);

  const filteredBookings = details
    .filter((profile) => {
      if (statusFilter === "Paid" && profile.paymentStatus !== "CAPTURED")
        return false;
      if (statusFilter === "Pending" && profile.paymentStatus !== "PENDING")
        return false;
      if (statusFilter === "N/A" &&
        (profile.paymentStatus === "CAPTURED" || profile.paymentStatus === "PENDING"))
        return false;



      if (appliedDateRange.startDate && appliedDateRange.endDate) {
        const bookingDate = moment(profile.paymentCapturedAt).startOf("day");
        const start = moment(appliedDateRange.startDate).startOf("day");
        const end = moment(appliedDateRange.endDate).startOf("day");

        // ✅ If start and end are the same day → match exactly that date
        if (start.isSame(end, "day")) {
          return bookingDate.isSame(start, "day");
        }

        // ✅ Normal range (inclusive)
        return (
          bookingDate.isSameOrAfter(start) && bookingDate.isSameOrBefore(end)
        );
      }


      return true;
    })
    .sort(
      (a, b) => new Date(b.paymentCapturedAt) - new Date(a.paymentCapturedAt)
    );

  // const filteredBookings = details
  //   .filter((profile) => {
  //     if (statusFilter === "Paid" && profile.paymentStatus !== "CAPTURED")
  //       return false;
  //     if (statusFilter === "Pending" && profile.paymentStatus !== "PENDING")
  //       return false;

  //     if (dateRange.startDate && dateRange.endDate) {
  //       const bookingDate = new Date(profile.paymentCapturedAt);
  //       const start = new Date(dateRange.startDate);
  //       const end = new Date(dateRange.endDate);
  //       return bookingDate >= start && bookingDate <= end;
  //     }

  //     return true;
  //   })
  //   .sort(
  //     (a, b) => new Date(b.paymentCapturedAt) - new Date(a.paymentCapturedAt)
  //   );

  const getDateRangeLabel = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return "Select Date Range";
    }
    return `${dateRange.startDate ? formatDate(dateRange.startDate) : ""} - ${dateRange.endDate ? formatDate(dateRange.endDate) : ""
      }`;
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("MMM D, YYYY");
  };

  const handleDateRangeChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  const applyDateFilter = () => {
    // copy the currently selected calendar range into the *applied* range
    setAppliedDateRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    setShowDatePicker(false);
  };


  const clearDateFilter = () => {
    setDateRange({
      startDate: null,
      endDate: null,
      key: "selection",
    });
    setAppliedDateRange({
      startDate: null,
      endDate: null,
    });
    setShowDatePicker(false);
  };

  const TransactionPDFDocument = () => {
    const usersToExport = filteredBookings.filter((profile) =>
      selectedUsers.includes(profile.id)
    );

    // PDF Styles
    const styles = StyleSheet.create({
      page: {
        padding: 30,
        fontFamily: "Helvetica",
      },
      header: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: "center",
      },
      table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
      tableRow: {
        flexDirection: "row",
      },
      tableColHeader: {
        width: "16.66%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#0076CE",
        color: "white",
        padding: 5,
        fontWeight: "bold",
        fontSize: 10,
      },
      tableCol: {
        width: "16.66%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
        fontSize: 7,
        color: "black",
      },
      footer: {
        fontSize: 10,
        marginTop: 10,
        textAlign: "center",
        color: "gray",
      },
    });

    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.header}>Transaction Details Report</Text>
          <Text style={styles.footer}>
            Generated on: {moment().format("MMMM D, YYYY HH:mm")}
          </Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Order Id</Text>
              <Text style={styles.tableColHeader}>Customer Name</Text>
              <Text style={styles.tableColHeader}>Transaction Id</Text>
              <Text style={styles.tableColHeader}>Service Name</Text>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Status</Text>
            </View>

            {/* Table Rows */}
            {usersToExport.map((user, index) => {
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{user.orderId}</Text>
                  <Text style={styles.tableCol}>{user.userFullName}</Text>
                  <Text style={styles.tableCol}>{user.paymentId}</Text>
                  <Text style={styles.tableCol}>{user.productName}</Text>
                  <Text style={styles.tableCol}>
                    {formatDate(user.paymentCapturedAt)}
                  </Text>
                  <Text style={styles.tableCol}>
                    {user.paymentStatus === "CAPTURED" ? "Paid" : "Pending"}
                  </Text>
                </View>
              );
            })}
          </View>
        </Page>
      </Document>
    );
  };
  return (
    <div>
      <Header />
      {exportError && (
        <div className="alert alert-warning py-2 px-3 mb-2">
          {exportError}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />


      <div className="container-fluid pt-5" style={{ paddingTop: "80px" }}>
        <div
          className="d-flex justify-content-between align-items-center mb-3 mt-5"
          style={{ marginRight: "25px" }}
        >
          <h5
            className="px-3 pb-2 text-black mx-3"
            style={{ borderBottom: "3px solid #000" }}
          >
            Transaction Details
          </h5>
          <div className="d-flex align-items-center">
            <div className="me-3 position-relative">
              <button
                type="button"
                className="btn btn-outline-secondary "
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                {getDateRangeLabel()} <i className="bi bi-calendar"></i>
              </button>
              {showDatePicker && (
                <div
                  className="position-absolute bg-white p-3 border shadow rounded mt-1 z-3 "
                  style={{ marginLeft: "-70px", position: "absolute" }}
                  onMouseDown={(e) => e.stopPropagation()} // prevent flicker
                  onClick={(e) => e.stopPropagation()}
                >
                  <DateRangePicker
                    ranges={[dateRange]}
                    onChange={handleDateRangeChange}
                    maxDate={new Date()}
                  />
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDateFilter();
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="btn btn-sm "
                      onClick={(e) => {
                        e.stopPropagation();
                        applyDateFilter();
                      }}
                      style={{ backgroundColor: "#0076CE", color: "white" }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <PDFDownloadLink
              document={<TransactionPDFDocument />}
              fileName={`user-details-${moment().format("YYYY-MM-DD")}.pdf`}
              style={{ textDecoration: "none" }}
            >
              {({ loading }) => (
                <button
                  className="btn text-light d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: "#0076CE",
                    // pointerEvents:
                    //   selectedUsers.length === 0 || loading ? "none" : "auto",
                    opacity: selectedUsers.length === 0 ? 0.6 : 1,
                    width: "80px",
                    height: "38px",
                  }}
                  onClick={(e) => {
                    if (selectedUsers.length === 0) {
                      e.preventDefault(); // stop PDF download
                      toast.error(
                        "Please select at least one transaction before exporting."
                      );
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </>
                  ) : (
                    "Export"
                  )}
                </button>
              )}
            </PDFDownloadLink>


          </div>
        </div>
        <div style={{ overflow: "hidden", padding: "10px 15px" }}>
          <div
            style={{
              maxHeight: "75vh",
              overflowY: "auto",
              border: "1px solid #dee2e6",
            }}
          >
            {error ? (
              <div
                className="alert alert-danger text-center m-3"
                style={{ width: "60%", margin: "auto", left: "18%" }}
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
                  onClick={() => window.location.reload()}
                  style={{ backgroundColor: "#0076CE", color: "white" }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <table
                className="table table-hover"
                style={{
                  width: "100%",
                  marginBottom: "0",
                  tableLayout: "fixed",
                }}
              >
                <thead
                  className="table-light"
                  style={{ position: "sticky", top: 0, zIndex: 2 }}
                >
                  <tr>
                    <th style={{ width: "5%", padding: "12px" }}>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedUsers.length === filteredBookings.length &&
                          filteredBookings.length > 0
                        }
                      />
                    </th>
                    <th style={{ width: "14%", padding: "12px" }}>Order Id</th>
                    <th style={{ width: "15%", padding: "12px" }}>
                      Customer Name
                    </th>
                    <th style={{ width: "15%", padding: "12px" }}>
                      Transaction Id
                    </th>
                    <th style={{ width: "15%", padding: "12px" }}>
                      Service Name
                    </th>
                    <th style={{ width: "10%", padding: "12px" }}>Date</th>
                    <th style={{ width: "10%", padding: "12px" }}>
                      <div className="dropdown">
                        <button
                          className="btn btn-light btn-sm dropdown-toggle p-0 border-0"
                          type="button"
                          id="statusFilterDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            backgroundColor: "transparent",
                            color: "#000",
                          }}
                        >
                          Status
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="statusFilterDropdown"
                        // style={{ maxHeight: "130px", overflowY: "auto" }}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              style={
                                statusFilter === "All"
                                  ? {
                                    backgroundColor: "#0076CE",
                                    color: "white",
                                  }
                                  : {}
                              }
                              onClick={() => setStatusFilter("All")}
                            >
                              All
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              style={
                                statusFilter === "Paid"
                                  ? {
                                    backgroundColor: "#0076CE",
                                    color: "white",
                                  }
                                  : {}
                              }
                              onClick={() => setStatusFilter("Paid")}
                            >
                              Paid
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              style={
                                statusFilter === "Pending"
                                  ? {
                                    backgroundColor: "#0076CE",
                                    color: "white",
                                  }
                                  : {}
                              }
                              onClick={() => setStatusFilter("Pending")}
                            >
                              Pending
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              style={
                                statusFilter === "N/A"
                                  ? { backgroundColor: "#0076CE", color: "white" }
                                  : {}
                              }
                              onClick={() => setStatusFilter("N/A")}
                            >
                              N/A
                            </button>
                          </li>

                        </ul>
                      </div>
                    </th>
                    <th style={{ width: "5%", padding: "12px" }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(5)
                      .fill()
                      .map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Skeleton width={20} height={20} />
                          </td>
                          <td>
                            <Skeleton width={100} height={20} />
                          </td>
                          <td>
                            <Skeleton width={100} height={20} />
                          </td>
                          <td>
                            <Skeleton width={200} height={20} />
                          </td>
                          <td>
                            <Skeleton width={80} height={20} />
                          </td>
                          <td>
                            <Skeleton width={100} height={20} />
                          </td>
                          <td>
                            <Skeleton width={50} height={20} />
                          </td>
                          <td>
                            <Skeleton width={30} height={20} />
                          </td>
                        </tr>
                      ))
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => {
                      return (
                        <tr key={booking.id}>
                          <td className="p-2 pt-3">
                            <input
                              type="checkbox"
                              className="m-1"
                              checked={selectedUsers.includes(booking.id)}
                              onChange={() => handleUserSelect(booking.id)}
                            />
                          </td>
                          <td className="p-2 pt-3">{booking.orderId}</td>
                          <td className="p-2 pt-3 ps-3">
                            {booking.userFullName}
                          </td>
                          <td className="p-2 pt-3">{booking.paymentId}</td>
                          <td className="p-2 pt-3 ps-3">
                            {booking.productName}
                          </td>
                          <td className="p-2 pt-3">
                            {formatDate(booking.paymentCapturedAt)}
                          </td>
                          <td className="p-3">
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  booking.paymentStatus === "CAPTURED"
                                    ? "#ceffcdff"
                                    : "#FFD5D5",
                                color:
                                  booking.paymentStatus === "PENDING"
                                    ? "#FF5757"
                                    : "#14AE5C",
                                padding: "5px 10px",
                              }}
                            >
                              {booking.paymentStatus === "PENDING"
                                ? "Pending"
                                : booking.paymentStatus === "CAPTURED"
                                  ? "Paid"
                                  : "N/A"}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-link p-2"
                              onClick={() =>
                                navigate(`/transaction-details/${booking.id}`)
                              }
                              style={{ color: "#474444" }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>


                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center"
                        style={{ height: "150px", verticalAlign: "middle" }}
                      >
                        No users found matching your criteria
                      </td>

                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
