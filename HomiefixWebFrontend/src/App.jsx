import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { setGlobalNavigate } from "./api";
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
import WorkerDetails from "./components/WorkerDetails";
import AddWorker from "./components/AddWorker";
import Services from "./components/Services";
import ComingSoon from "./components/ComingSoon";
import Worker from "./components/Worker";
import EditWorker from "./components/EditWorker";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import Service from "./components/Service";
import ReAssign from "./components/ReAssign";
import UserDetails from "./components/UserDetails";
import User from "./components/User"
import Enquiry from "./components/Enquiry"


const App = () => {
  const navigate = useNavigate();
  setGlobalNavigate(navigate); // Set global navigate function

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login setToken={setToken} />} />

      <Route element={<ProtectedRoute token={token} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/booking-details/view-bookings/:id" element={<ViewBookings />} />
          <Route path="/booking-details/reschedule/:id" element={<Reschedule />} />
          <Route path="/booking-details/reassign/:id" element={<ReAssign />} />
          <Route path="/booking-details/cancel/:id" element={<CancelBooking />} />
          <Route path="/booking-details/assign-bookings/:id" element={<AssignBookings />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/customer-review/:id" element={<CustomerReview />} />
          <Route path="/worker-details" element={<WorkerDetails />} />
          <Route path="/worker-details/worker/:id" element={<Worker />} />
          <Route path="/worker-details/add-worker" element={<AddWorker />} />
          <Route path="/worker-details/worker/edit/:id" element={<EditWorker />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:productId" element={<Service />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/user-details/user/:id" element={<User />} />
          <Route path="/enquiry" element={<Enquiry />} />


        </Route>
      </Route>
    </Routes>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
