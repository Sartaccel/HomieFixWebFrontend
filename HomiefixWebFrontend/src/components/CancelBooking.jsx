import React, { useState } from "react";
import "../styles/AssignBookings.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CancelBooking = ({ id, booking, onClose, onCancelSuccess }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation");
      return;
    }
  
    const reason = cancelReason === "other" ? otherReason : cancelReason;
    setLoading(true);
  
    try {
      const encodedReason = encodeURIComponent(reason);
      const url = `http://localhost:2222/booking/cancel/${id}?reason=${encodedReason}`;
  
      console.log("Cancellation URL:", url);
  
      const response = await fetch(url, { method: "PUT" });
  
      if (response.ok) {
        alert("Booking cancelled successfully");
        
        // Check if onCancelSuccess is a function before calling it
        if (typeof onCancelSuccess === "function") {
          onCancelSuccess(reason);
        }
  
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Cancellation failed:", response.status, errorData);
        alert(`Failed to cancel booking: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred during cancellation.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="reschedule-slider position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "550px", zIndex: 1000 }}>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Cancel Service</h4>
          <button className="btn btn-light" onClick={onClose} disabled={loading}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        <div className="mb-4 mt-3">
          <h6>Reason for Cancellation</h6>
          <div className="mb-4">
            {loading ? (
              <Skeleton count={5} height={30} style={{ marginBottom: "10px" }} />
            ) : (
              [
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
                    disabled={loading}
                  />
                  <label className="form-check-label" style={{ marginLeft: "5px" }} htmlFor={option.value}>
                    {option.label}
                  </label>
                </div>
              ))
            )}
          </div>

          {cancelReason === "other" && !loading && (
            <textarea
              className="form-control"
              placeholder="Other reason"
              rows="6"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              style={{
                height: "200px",
                resize: "none",
                padding: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
              disabled={loading}
            ></textarea>
          )}

          {loading && cancelReason === "other" && <Skeleton height={200} />}
        </div>
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        <button
  className="btn btn-primary w-100 mt-3"
  style={{ backgroundColor: "#B8141A", border: "none" }}
  onClick={handleCancel}
  disabled={loading}
>
  {loading ? (
    <>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span className="visually-hidden">Loading...</span> Cancelling...
    </>
  ) : (
    "Cancel Service"
  )}
</button>

      </div>
    </div>
  );
};

export default CancelBooking;