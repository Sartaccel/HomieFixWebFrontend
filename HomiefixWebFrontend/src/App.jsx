import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookingDetails from "./components/BookingDetails";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/booking-details"
            element={
              <>
                <Sidebar /> {/* Sidebar will appear on this page */}
                <BookingDetails />
              </>
            }
          />
          {/* Add other routes similarly */}
          <Route path="/dashboard" element={
            <>
              <Sidebar /> {/* Sidebar will appear on this page */}
              <Dashboard />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
