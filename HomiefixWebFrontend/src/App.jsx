import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; 
import BookingDetails from "./components/BookingDetails";
import Sidebar from "./components/Sidebar";

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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
