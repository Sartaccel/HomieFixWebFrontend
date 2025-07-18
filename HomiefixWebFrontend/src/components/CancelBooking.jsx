import React, { useState } from "react";
import "../styles/AssignBookings.css";
import api from "../api";

const CancelBooking = ({ id, booking, onClose, onCancelSuccess }) => {
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const isCancelDisabled = () => {
    if (!cancelReason) return true;
    if (cancelReason === "other" && !otherReason.trim()) return true;
    return false;
  };

  const handleCancel = async () => {
    if (isCancelDisabled()) {
      alert("Please provide a complete reason for cancellation");
      return;
    }

    const reason = cancelReason === "other" ? otherReason : cancelReason;
    setLoading(true);

    try {
      const encodedReason = encodeURIComponent(reason);
      const url = `/booking/cancel/${id}?reason=${encodedReason}`;

      const response = await api.put(url);

      if (response.status === 200) {
        alert("Booking cancelled successfully");

        if (typeof onCancelSuccess === "function") {
          onCancelSuccess(reason);
        }

        onClose();
      } else {
        console.error("Cancellation failed:", response.status, response.data);
        alert(
          `Failed to cancel booking: ${response.status} - ${
            response.data.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred during cancellation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="reschedule-slider position-fixed top-0 end-0 h-100 bg-white shadow-lg"
      style={{ width: "550px", zIndex: 1000 }}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Cancel Service</h4>
          <button
            className="btn btn-light"
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-4 mt-3">
          <h6>Reason for Cancellation</h6>
          <div className="mb-4">
            {[
              { value: "too expensive", label: "Too Expensive" },
              { value: "delayed service", label: "Delayed Service" },
              {
                value: "fixed the issue themselves",
                label: "Fixed The Issue Themselves",
              },
              {
                value: "found a cheaper alternative",
                label: "Found A Cheaper Alternative",
              },
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
                <label
                  className="form-check-label"
                  style={{ marginLeft: "5px" }}
                  htmlFor={option.value}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          {cancelReason === "other" && (
            <textarea
              className="form-control"
              placeholder="Please specify the reason (required)"
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
              required
            ></textarea>
          )}
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <button
          className="btn btn-primary w-100 mt-3"
          style={{ backgroundColor: "#B8141A", border: "none" }}
          onClick={handleCancel}
          disabled={isCancelDisabled() || loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Cancelling...
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