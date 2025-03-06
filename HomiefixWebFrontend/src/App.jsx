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
import WorkerDetails from "./components/WorkerDetails";
import AddWorker from "./components/AddWorker";
import Services from "./components/Services";

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
            <Route path="/booking-details/assign-bookings/:id" element={<AssignBookings />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/customer-review/:id" element={<CustomerReview />} />
            <Route path="/worker-details" element={<WorkerDetails/>} />
            <Route path="/add-worker" element={<AddWorker />} />
            <Route path="/services" element={<Services />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;