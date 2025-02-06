import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/BookingDetails.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const BookingDetails = () => {
  const [filteredBookings, setFilteredBookings] = useState([
    {
      id: 1,
      service: "AC Repair",
      name: "John Doe",
      contact: "1234567890",
      address: "123 Street, City, State, 12345",
      date: "2025-02-05",
    },
    {
      id: 2,
      service: "Plumbing Service",
      name: "Jane Smith",
      contact: "0987654321",
      address: "456 Avenue, City, State, 67890",
      date: "2025-02-06",
    },
    {
      id: 3,
      service: "House Cleaning",
      name: "Alice Johnson",
      contact: "1122334455",
      address: "789 Road, City, State, 11223",
      date: "2025-02-07",
    },
    {
      id: 4,
      service: "Vehicle Service",
      name: "Bob Brown",
      contact: "2233445566",
      address: "101 Boulevard, City, State, 44556",
      date: "2025-02-08",
    },
    {
      id: 5,
      service: "Home Demolition",
      name: "Charlie Davis",
      contact: "3344556677",
      address: "202 Lane, City, State, 55667",
      date: "2025-02-09",
    },
    {
      id: 6,
      service: "AC Repair",
      name: "John Doe",
      contact: "1234567890",
      address: "123 Street, City, State, 12345",
      date: "2025-02-05",
    },
    {
      id: 7,
      service: "Plumbing Service",
      name: "Jane Smith",
      contact: "0987654321",
      address: "456 Avenue, City, State, 67890",
      date: "2025-02-06",
    },
    {
      id: 8,
      service: "House Cleaning",
      name: "Alice Johnson",
      contact: "1122334455",
      address: "789 Road, City, State, 11223",
      date: "2025-02-07",
    },
    {
      id: 9,
      service: "Vehicle Service",
      name: "Bob Brown",
      contact: "2233445566",
      address: "101 Boulevard, City, State, 44556",
      date: "2025-02-08",
    },
    {
      id: 10,
      service: "Home Demolition",
      name: "Charlie Davis",
      contact: "3344556677",
      address: "202 Lane, City, State, 55667",
      date: "2025-02-09",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);

    if (selected) {
      const filtered = filteredBookings.filter(
        (booking) => booking.date === selected
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(filteredBookings);
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
            <div className="section">
              Bookings <span className="badge bg-dark ms-1">{filteredBookings.length}</span>
            </div>
            <div className="section">In Progress</div>
            <div className="section">Completed</div>
            <div className="section">Canceled</div>
          </div>

          <div className="table-responsive mt-3 w-100 px-0 overflow-auto" style={{ maxHeight: "100%" }}>
            <table className="booking-table table table-hover bg-white rounded shadow-sm align-items-center ">
              <thead className="td-height">
                <tr>
                  <th>Service</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>
                    Date
                    <input
                      type="date"
                      // className="form-control d-inline w-auto ms-2 date-filter"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-secondary" style={{ width: "40px", height: "40px" }}></div>
                        <div>
                          <p className="mb-0 fw-bold">{booking.service}</p>
                          <small className="text-muted">ID: {booking.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{booking.name}</td>
                    <td>{booking.contact}</td>
                    <td>{booking.address}</td>
                    <td>{booking.date}</td>
                    <td>
                      <button className="btn btn-primary">Assign</button>
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
