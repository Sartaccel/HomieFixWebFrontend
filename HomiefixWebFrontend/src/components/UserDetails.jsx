import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./Header";
import api from "../api";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import profileImg from "../assets/addWorker.jpg";

/* ---------------------------------------------
   PDF FONTS
------------------------------------------------*/
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2" },
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2",
      fontWeight: "bold",
    },
  ],
});

/* ---------------------------------------------
   PDF COMPONENT  ✔ FIXED DEFAULT PROP
------------------------------------------------*/
const UserPDFDocument = ({ selectedUsersData = [] }) => {
  const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: "Helvetica" },
    header: { fontSize: 18, marginBottom: 10, fontWeight: "bold", textAlign: "center" },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: { flexDirection: "row" },
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
      fontSize: 9,
      color: "black",
    },
    footer: { fontSize: 10, marginTop: 10, textAlign: "center", color: "gray" },
  });

  const formatDate = (dateString) =>
    !dateString ? "N/A" : moment(dateString).format("MMM D, YYYY");

  const getPrimaryAddress = (addresses) => {
    if (!addresses || addresses.length === 0) return null;
    return addresses.reduce((prev, current) =>
      parseInt(prev.id) > parseInt(current.id) ? prev : current
    );
  };

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>User Details Report</Text>
        <Text style={styles.footer}>
          Generated on: {moment().format("MMMM D, YYYY HH:mm")}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Name</Text>
            <Text style={styles.tableColHeader}>Contact</Text>
            <Text style={styles.tableColHeader}>Address</Text>
            <Text style={styles.tableColHeader}>Bookings</Text>
            <Text style={styles.tableColHeader}>Last Booking</Text>
            <Text style={styles.tableColHeader}>Status</Text>
          </View>

          {selectedUsersData.map((user) => {
            const address = getPrimaryAddress(user.addresses);
            return (
              <View key={`pdf-user-${user.id}`} style={styles.tableRow}>
                <Text style={styles.tableCol}>{user.fullName}</Text>
                <Text style={styles.tableCol}>{user.mobileNumber}</Text>
                <Text style={styles.tableCol}>
                  {address
                    ? `${address.houseNumber}, ${address.town}, ${address.district}, ${address.state} - ${address.pincode}`
                    : "No address"}
                </Text>
                <Text style={styles.tableCol}>{user.totalBookings}</Text>
                <Text style={styles.tableCol}>{formatDate(user.lastBookingDate)}</Text>
                <Text style={styles.tableCol}>{user.isActive ? "Active" : "Deleted"}</Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

/* ---------------------------------------------
   PDF ERROR BOUNDARY
------------------------------------------------*/
class PDFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("PDF Error Boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-warning mt-2">
          <strong>PDF Generation Failed:</strong>{" "}
          {this.state.error?.message || "Unknown error"}
          <button
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------------------------------------------
   MAIN COMPONENT
------------------------------------------------*/
const UserDetails = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------------------------------------------
     FETCH USERS
  ------------------------------------------------*/
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const response = await api.get("/profile/all");
        const sortedData = response.data.sort(
          (a, b) => new Date(b.lastBookingDate) - new Date(a.lastBookingDate)
        );
        setProfiles(sortedData);
      } catch (error) {
        if (error.message === "Network Error") {
          setError("No internet connection. Please check your network and try again.");
        } else if (error.response?.status === 403) {
          localStorage.removeItem("token");
          setToken("");
          navigate("/");
        } else {
          setError("Failed to load user data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, setToken, navigate]);

  /* ---------------------------------------------
     UTIL & FILTERING
  ------------------------------------------------*/
  const formatDate = (dateString) =>
    !dateString ? "N/A" : moment(dateString).format("MMM D, YYYY");

  const getPrimaryAddress = (addresses) => {
    if (!addresses || addresses.length === 0) return null;
    return addresses.reduce((prev, current) =>
      parseInt(prev.id) > parseInt(current.id) ? prev : current
    );
  };

  const filteredProfiles = profiles
    .filter((p) =>
      statusFilter === "All" ? true : statusFilter === "Active" ? p.isActive : !p.isActive
    )
    .filter((profile) => {
      if (!appliedDateRange.startDate && !appliedDateRange.endDate) return true;
      const userDate = moment(profile.lastBookingDate);
      const startDate = appliedDateRange.startDate ? moment(appliedDateRange.startDate) : null;
      const endDate = appliedDateRange.endDate ? moment(appliedDateRange.endDate) : null;

      if (startDate && endDate) return userDate.isBetween(startDate, endDate, null, "[]");
      if (startDate) return userDate.isSameOrAfter(startDate);
      if (endDate) return userDate.isSameOrBefore(endDate);
      return true;
    })
    .sort((a, b) => new Date(b.lastBookingDate) - new Date(a.lastBookingDate));

  const getDateRangeLabel = () =>
    !appliedDateRange.startDate && !appliedDateRange.endDate
      ? "Select Date Range"
      : `${formatDate(appliedDateRange.startDate)} - ${formatDate(
          appliedDateRange.endDate
        )}`;

  const selectedUsersData = filteredProfiles.filter((p) =>
    selectedUsers.includes(p.id)
  );

  const handleSelectAll = (e) =>
    e.target.checked ? setSelectedUsers(filteredProfiles.map((p) => p.id)) : setSelectedUsers([]);

  const handleUserSelect = (id) =>
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const applyDateFilter = () => {
    setAppliedDateRange({ startDate: dateRange.startDate, endDate: dateRange.endDate });
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: null, endDate: null, key: "selection" });
    setAppliedDateRange({ startDate: null, endDate: null });
    setShowDatePicker(false);
  };

  /* ---------------------------------------------
     UI RENDER
  ------------------------------------------------*/
  return (
    <div>
      <Header />
      <div className="container-fluid pt-5 px-4" style={{ paddingTop: "80px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
          <h5 className="px-3 pb-2 text-black mx-3" style={{ borderBottom: "3px solid #000" }}>
            Customer Details
          </h5>

          <div className="d-flex align-items-center">
            {/* DATE FILTER */}
            <div className="me-3 position-relative">
              <button className="btn btn-outline-secondary" onClick={() => setShowDatePicker(!showDatePicker)}>
                {getDateRangeLabel()} <i className="bi bi-calendar"></i>
              </button>

              {showDatePicker && (
                <div className="position-absolute bg-white p-3 border shadow rounded mt-1 z-3 position-fixed" style={{ marginLeft: "-70px" }}>
                  <DateRangePicker ranges={[dateRange]} onChange={(ranges) => setDateRange(ranges.selection)} />
                  <div className="d-flex justify-content-end mt-2">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={clearDateFilter}>
                      Clear
                    </button>
                    <button className="btn btn-sm" onClick={applyDateFilter} style={{ backgroundColor: "#0076CE", color: "white" }}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* EXPORT PDF BUTTON */}
            <PDFErrorBoundary>
              <PDFDownloadLink
                document={<UserPDFDocument selectedUsersData={selectedUsersData} />}
                fileName={`user-details-${moment().format("YYYY-MM-DD")}.pdf`}
                style={{ textDecoration: "none" }}
              >
                {({ loading }) => (
                  <button
                    className="btn text-light d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: "#0076CE",
                      pointerEvents: selectedUsers.length === 0 || loading ? "none" : "auto",
                      opacity: selectedUsers.length === 0 ? 0.6 : 1,
                      width: "80px",
                      height: "38px",
                    }}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm"></span> : "Export"}
                  </button>
                )}
              </PDFDownloadLink>
            </PDFErrorBoundary>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ overflow: "hidden", padding: "10px 15px" }}>
          <div style={{ maxHeight: "75vh", overflowY: "auto", border: "1px solid #dee2e6" }}>
            {error ? (
              <div className="alert alert-danger text-center m-3" style={{ width: "60%", margin: "auto" }}>
                <div className="mb-3">
                  <i className="bi bi-wifi-off" style={{ fontSize: "2rem" }}></i>
                </div>
                {error}
                <button className="btn ms-3" onClick={() => window.location.reload()} style={{ backgroundColor: "#0076CE", color: "white" }}>
                  Retry
                </button>
              </div>
            ) : (
              <table className="table table-hover" style={{ width: "100%", marginBottom: "0", tableLayout: "fixed" }}>
                <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th style={{ width: "5%", padding: "12px" }}>
                      <input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === filteredProfiles.length && filteredProfiles.length > 0} />
                    </th>
                    <th style={{ width: "15%", padding: "12px" }}>Name</th>
                    <th style={{ width: "15%", padding: "12px" }}>Contact</th>
                    <th style={{ width: "25%", padding: "12px" }}>Address</th>
                    <th style={{ width: "15%", padding: "12px", textAlign: "center" }}>Total Bookings</th>
                    <th style={{ width: "15%", padding: "12px" }}>Last Booking</th>
                    <th style={{ width: "10%", padding: "12px" }}>
                      <div className="dropdown">
                        <button className="btn btn-light btn-sm dropdown-toggle p-0 border-0" type="button" id="statusFilterDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                          style={{ backgroundColor: "transparent", color: "#000" }}>
                          Status
                        </button>
                        <ul className="dropdown-menu">
                          {["All", "Active", "Deleted"].map((status) => (
                            <li key={status}>
                              <button
                                className="dropdown-item"
                                style={statusFilter === status ? { backgroundColor: "#0076CE", color: "white" } : {}}
                                onClick={() => setStatusFilter(status)}
                              >
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </th>
                    <th style={{ width: "5%", padding: "12px" }}>View</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array(5)
                      .fill()
                      .map((_, index) => (
                        <tr key={`skeleton-${index}`}>
                          <td><Skeleton width={20} height={20} /></td>
                          <td><Skeleton width={100} height={20} /></td>
                          <td><Skeleton width={100} height={20} /></td>
                          <td><Skeleton width={200} height={20} /></td>
                          <td><Skeleton width={80} height={20} /></td>
                          <td><Skeleton width={100} height={20} /></td>
                          <td><Skeleton width={50} height={20} /></td>
                          <td><Skeleton width={30} height={20} /></td>
                        </tr>
                      ))
                  ) : filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => {
                      const address = getPrimaryAddress(profile.addresses);
                      return (
                        <tr key={`user-${profile.id}`}>
                          <td>
                            <input type="checkbox" className="m-1" checked={selectedUsers.includes(profile.id)}
                              onChange={() => handleUserSelect(profile.id)} />
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <img src={profileImg} alt={profile.fullName} className="rounded-circle me-2" width="40" height="40" />
                              {profile.fullName}
                            </div>
                          </td>
                          <td>{profile.mobileNumber}</td>
                          <td>{address ? `${address.houseNumber}, ${address.town}, ${address.district}, ${address.state} - ${address.pincode}` : "No address"}</td>
                          <td style={{ textAlign: "center" }}>{profile.totalBookings}</td>
                          <td>{formatDate(profile.lastBookingDate)}</td>
                          <td>
                            <span className="badge"
                              style={{
                                backgroundColor: profile.isActive ? "#CDFFF7" : "#FFD5D5",
                                color: profile.isActive ? "#14AE5C" : "#FF5757",
                                padding: "5px 10px",
                              }}>
                              {profile.isActive ? "Active" : "Deleted"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-link p-2"
                              onClick={() => navigate(`/customer-details/user/${profile.id}`)}
                              style={{ color: "#474444" }}>
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
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

export default UserDetails;
