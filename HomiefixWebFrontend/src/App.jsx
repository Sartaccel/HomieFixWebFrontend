import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookingDetails from "./components/BookingDetails";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import AssignBookings from "./components/AssignBookings";
import CustomerReview from "./components/CustomerReview";
import Reviews from "./components/Reviews";
import WorkerDetails from "./components/WorkerDetails";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes (inside Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/assign-bookings/:id" element={<AssignBookings />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/customer-review/:id" element={<CustomerReview />} />
          <Route path="/worker-details" element={<WorkerDetails />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
