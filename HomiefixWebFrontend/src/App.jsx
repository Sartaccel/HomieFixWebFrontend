import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookingDetails from "./components/BookingDetails";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import AssignBookings from "./components/AssignBookings";
import CustomerReview from "./components/CustomerReview";
import Reviews from "./components/Reviews";
import ProtectedRoute from "./components/ProtectedRoute";
import Reschedule from "./components/Reschedule";
import CancelBooking from "./components/CancelBooking";
import ViewBookings from "./components/ViewBookings";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />

        <Route element={<ProtectedRoute token={token} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/assign-bookings/:id" element={<AssignBookings />} />
            <Route path="/view-bookings/:id" element={<ViewBookings />} />
            <Route path="/reschedule/:id" element={<Reschedule />} /> 
            <Route path="/reschedule/:id" element={<CancelBooking />} /> 
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/customer-review/:id" element={<CustomerReview />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;