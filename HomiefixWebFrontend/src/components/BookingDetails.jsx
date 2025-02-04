// import React, { useState, useEffect } from "react";
// import "../styles/BookingDetails.css"; // Import the CSS file
// import notification from "../assets/Bell.png";
// import profile from "../assets/Profile.png";
// import search from "../assets/Search.png";

// const BookingDetails = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await fetch("/api/bookings"); // Replace with your API endpoint
//         const data = await response.json();
//         setBookings(data);
//         setFilteredBookings(data); // Initially show all bookings
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };
//     fetchBookings();
//   }, []);

//   // Handle Date Filtering
//   const handleDateChange = (event) => {
//     const selected = event.target.value;
//     setSelectedDate(selected);

//     if (selected) {
//       const filtered = bookings.filter(
//         (booking) => booking.date === selected
//       );
//       setFilteredBookings(filtered);
//     } else {
//       setFilteredBookings(bookings);
//     }
//   };

//   return (
//     <div className="booking-page">
//       {/* Header Section */}
//       <header className="header">
//         <h2 className="heading">Booking Details</h2>
//         <div className="header-right">
//           <div className="search-bar">
//             <input type="text" placeholder="Search" />
//             <img src={search} alt="Search" className="search-icon" />
//           </div>
//           <img src={notification} alt="Notifications" className="icon" />
//           <img src={profile} alt="Profile" className="icon" />
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="navigation-bar">
//         <div className="section active">Bookings <span className="count">{filteredBookings.length}</span></div>
//         <div className="section">In Progress</div>
//         <div className="section">Completed</div>
//         <div className="section">Canceled</div>
//       </div>

//       {/* Booking Table */}
//       <table className="booking-table">
//         <thead>
//           <tr>
//             <th>Service</th>
//             <th>Name</th>
//             <th>Contact</th>
//             <th>Address</th>
//             <th>
//               Date
//               <input 
//                 type="date" 
//                 value={selectedDate} 
//                 onChange={handleDateChange} 
//                 className="date-filter"
//               />
//             </th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredBookings.map((booking) => (
//             <tr key={booking.id}>
//               <td>
//                 <div className="service-info">
//                   <div className="service-icon"></div>
//                   <div>
//                     <p className="service-name">{booking.service}</p>
//                     <p className="service-id">ID: {booking.id}</p>
//                   </div>
//                 </div>
//               </td>
//               <td>{booking.name}</td>
//               <td>{booking.contact}</td>
//               <td>{booking.address}</td>
//               <td>{booking.date}</td>
//               <td><button className="assign-button">Assign</button></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BookingDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BookingDetails.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("https://2c38-2401-4900-8826-eb6e-6cd4-8176-72cb-d6ad.ngrok-free.app/booking/all");
        console.log("API Response:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error("API response is not an array");
        }

        const mappedBookings = response.data.map(booking => ({
          id: booking.id,
          service: booking.productName,
          name: booking.userProfile.fullName,
          contact: booking.userProfile.mobileNumber.mobileNumber,
          address: `${booking.deliveryAddress.houseNumber}, ${booking.deliveryAddress.town}, ${booking.deliveryAddress.district}, ${booking.deliveryAddress.state}, ${booking.deliveryAddress.pincode}`,
          date: booking.bookedDate, // Ensure this property matches the API response
        }));

        setBookings(mappedBookings);
        setFilteredBookings(mappedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    fetchBookings();
  }, []);

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);

    if (selected) {
      const filtered = bookings.filter((booking) => booking.date === selected);
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  };

  return (
    <div className="booking-page">
      <header className="header">
        <h2 className="heading">Booking Details</h2>
        <div className="header-right">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <img src={search} alt="Search" className="search-icon" />
          </div>
          <img src={notification} alt="Notifications" className="icon" />
          <img src={profile} alt="Profile" className="icon" />
        </div>
      </header>

      <div className="navigation-bar">
        <div className="section active">Bookings <span className="count">{filteredBookings.length}</span></div>
        <div className="section">In Progress</div>
        <div className="section">Completed</div>
        <div className="section">Canceled</div>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>
              Date
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="date-filter"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <div className="service-info">
                  <div className="service-icon"></div>
                  <div>
                    <p className="service-name">{booking.service}</p>
                    <p className="service-id">ID: {booking.id}</p>
                  </div>
                </div>
              </td>
              <td>{booking.name}</td>
              <td>{booking.contact}</td>
              <td>{booking.address}</td>
              <td>{booking.date}</td>
              <td><button className="assign-button">Assign</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDetails;
