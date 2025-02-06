import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookingDetails from "./components/BookingDetails";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route (No Sidebar) */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes (With Sidebar) */}
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking-details" element={<BookingDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
