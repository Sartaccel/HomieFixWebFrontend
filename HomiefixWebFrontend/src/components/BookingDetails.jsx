import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "../styles/BookingDetails.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const BookingDetails = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([
    { id: 1, service: "AC Repair", name: "John Doe", contact: "1234567890", address: "123 Street, City, State, 12345", date: "2025-02-05", status: "In Progress" },
    { id: 2, service: "Plumbing Service", name: "Jane Smith", contact: "0987654321", address: "456 Avenue, City, State, 67890", date: "2025-02-06", status: "Completed" },
    { id: 3, service: "House Cleaning", name: "Alice Johnson", contact: "1122334455", address: "789 Road, City, State, 11223", date: "2025-02-07", status: "Canceled" },
    { id: 4, service: "Electrical Work", name: "Michael Brown", contact: "3344556677", address: "101 Lane, City, State, 33445", date: "2025-02-08", status: "In Progress" },
    { id: 5, service: "Carpentry Service", name: "Emily Davis", contact: "7788990011", address: "202 Street, City, State, 55667", date: "2025-02-09", status: "Completed" },
    { id: 6, service: "Sofa Cleaning", name: "William Wilson", contact: "8899001122", address: "303 Avenue, City, State, 66778", date: "2025-02-10", status: "Canceled" },
    { id: 7, service: "Water Filter Repair", name: "Olivia Martinez", contact: "9900112233", address: "404 Road, City, State, 77889", date: "2025-02-11", status: "In Progress" },
    { id: 8, service: "Vehicle Service", name: "James Anderson", contact: "1100223344", address: "505 Street, City, State, 88990", date: "2025-02-12", status: "Completed" },
    { id: 9, service: "Home Demolition", name: "Sophia Thomas", contact: "2200334455", address: "606 Avenue, City, State, 99001", date: "2025-02-13", status: "Canceled" },
    { id: 10, service: "Interior Works", name: "Benjamin White", contact: "3300445566", address: "707 Road, City, State, 11002", date: "2025-02-14", status: "In Progress" },
  ]);

  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    if (activeTab !== "bookings") {
      filtered = filtered.filter((booking) => booking.status.toLowerCase() === activeTab.toLowerCase());
    }

    // Filter by date if selected
    if (selectedDate) {
      const formattedSelectedDate = selectedDate.getFullYear() + "-" +
        String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" +
        String(selectedDate.getDate()).padStart(2, "0");

      filtered = filtered.filter((booking) => booking.date === formattedSelectedDate);
    }

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

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
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

          <div className="navigation-bar d-flex gap-3 py-3 bg-white border-bottom w-100">
            <div className={`section ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>
              Bookings <span className="badge bg-dark ms-1">{filteredBookings.length}</span>
            </div>
            <div className={`section ${activeTab === "inProgress" ? "active" : ""}`} onClick={() => setActiveTab("inProgress")}>
              In Progress
            </div>
            <div className={`section ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
              Completed
            </div>
            <div className={`section ${activeTab === "canceled" ? "active" : ""}`} onClick={() => setActiveTab("canceled")}>
              Canceled
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
                  <th className="p-3">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ width: "20%" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-secondary" style={{ width: "40px", height: "40px" }}></div>
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
                    <td>{booking.status}</td>
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