import React, { useState } from "react";
import "../styles/AssignBookings.css";

const CancelBooking = ({ id, booking, onClose }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // Handle cancel button click
  const handleCancel = async () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation");
      return;
    }

    const reason = cancelReason === "other" ? otherReason : cancelReason;

    try {
      // Encode the reason for the URL
      const encodedReason = encodeURIComponent(reason);

      // Construct the cancellation URL
      const url = `http://localhost:2222/booking/cancel/${id}?reason=${encodedReason}`;

      console.log("Cancellation URL:", url);

      // Send the cancellation request
      const response = await fetch(url, {
        method: "PUT",
      });

      if (response.ok) {
        alert("Booking cancelled successfully");
        onClose(); // Close the CancelBooking modal
      } else {
        const errorData = await response.json();
        console.error("Cancellation failed:", response.status, errorData);
        alert(`Failed to cancel booking: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred during cancellation.");
    }
  };

  return (
    <div className="reschedule-slider position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "550px", zIndex: 1000 }}>
      <div className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Cancel Service</h4>
          <button className="btn btn-light" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        {/* Reason for Cancellation */}
        <div className="mb-4 mt-3">
          <h6>Reason for Cancellation</h6>
          <div className="mb-4">
            {[
              { value: "too expensive", label: "Too Expensive" },
              { value: "delayed service", label: "Delayed Service" },
              { value: "fixed the issue themselves", label: "Fixed The Issue Themselves" },
              { value: "found a cheaper alternative", label: "Found A Cheaper Alternative" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  id={option.value}
                  name="cancelReason"
                  value={option.value}
                  checked={cancelReason === option.value}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <label className="form-check-label" style={{ marginLeft: "5px" }} htmlFor={option.value}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          {cancelReason === "other" && (
            <textarea
              className="form-control"
              placeholder="Other reason"
              rows="3"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            ></textarea>
          )}
        </div>
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        {/* Cancel Button */}
        <button className="btn btn-primary w-100 mt-3" style={{ backgroundColor: "#B8141A", border: "none" }} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CancelBooking;