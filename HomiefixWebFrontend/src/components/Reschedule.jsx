import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/AssignBookings.css";
import api from "../api";


const Reschedule = ({ id, booking, onClose, onReschedule }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);


  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await api.get("/booking/available-dates");
        const data = response.data;

        const validDates = data
          .map((date) => {
            const cleanedDate = date.replace(/\s\w+day\s/, " ");
            const parsedDate = new Date(cleanedDate);
            if (isNaN(parsedDate.getTime())) {
              console.warn("Invalid date found:", date);
              return null;
            }
            return parsedDate.toISOString().split("T")[0];
          })
          .filter((date) => date !== null);
        setAvailableDates(validDates);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    const fetchAvailableTimes = async () => {
      try {
        const response = await api.get("/booking/available-times");
        const data = response.data;
        setAvailableTimes(data);
      } catch (error) {
        console.error("Error fetching available times:", error);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchAvailableDates();
    fetchAvailableTimes();
  }, []);

  const handleDateSelection = (date) => {
    if (selectedDate === date) {
      setSelectedDate("");
    } else {
      setSelectedDate(date);
    }
  };

  const handleTimeSlotSelection = (time) => {
    if (selectedTimeSlot === time) {
      setSelectedTimeSlot("");
    } else {
      setSelectedTimeSlot(time);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTimeSlot || !rescheduleReason) {
      alert("Please select a date, time slot, and reason for reschedule");
      return;
    }

    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      alert("Please select a valid date");
      return;
    }

    const reason = rescheduleReason === "other" ? otherReason : rescheduleReason;

    try {
      setIsRescheduling(true); // Start loading
      const formattedDate = parsedDate.toISOString().split("T")[0];
      const encodedTimeSlot = encodeURIComponent(selectedTimeSlot);
      const encodedReason = encodeURIComponent(reason);

      const url = `/booking/reschedule/${id}?selectedDate=${formattedDate}&selectedTimeSlot=${encodedTimeSlot}&rescheduleReason=${encodedReason}`;

      const response = await api.put(url);

      if (response.status === 200) {
        alert("Booking rescheduled successfully");
        onReschedule(formattedDate, selectedTimeSlot);
        onClose();
      } else {
        console.error("Reschedule failed:", response.status, response.data);
        alert(
          `Failed to reschedule booking: ${response.status} - ${response.data.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert("An error occurred during reschedule.");
    } finally {
      setIsRescheduling(false); // Stop loading regardless of success/failure
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });

    return (
      <div>
        <div>{`${day} ${month}`}</div>
        <div>{dayOfWeek}</div>
      </div>
    );
  };

  return (
    <div
      className="reschedule-slider position-fixed top-0 end-0 h-100 bg-white shadow-lg"
      style={{ width: "550px", zIndex: 1000 }}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Reschedule Service</h4>
          <button className="btn btn-light" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-3 mt-3">
          <h6>Date</h6>
          <div className="d-flex flex-wrap gap-2">
            {loadingDates
              ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} width={100} height={50} />
              ))
              : availableDates.map((date, index) => (
                <button
                  key={index}
                  className="btn btn-sm"
                  style={{
                    fontSize: "15px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border:
                      selectedDate === date
                        ? "1px solid #0076CE"
                        : "1px solid #D2D2D2",
                    color: "#333",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => handleDateSelection(date)}
                >
                  {formatDate(date)}
                </button>
              ))}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-3 mt-3">
          <h6>Time</h6>
          <div className="d-flex flex-wrap gap-2">
            {loadingTimes
              ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} width={80} height={30} />
              ))
              : availableTimes.map((time, index) => (
                <button
                  key={index}
                  className="btn btn-sm"
                  style={{
                    fontSize: "15px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border:
                      selectedTimeSlot === time
                        ? "1px solid #0076CE"
                        : "1px solid #D2D2D2",
                    color: "#333",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => handleTimeSlotSelection(time)}
                >
                  {time}
                </button>
              ))}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-3 mt-3">
          <h6>Reason for Reschedule</h6>
          <div className="mb-2">
            {[
              {
                value: "technician unAvailability",
                label: "Technician Unavailability",
              },
              { value: "customer request", label: "Customer Request" },
              { value: "weather conditions", label: "Weather Conditions" },
              { value: "part unavailability", label: "Part Unavailability" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  id={option.value}
                  name="rescheduleReason"
                  value={option.value}
                  checked={rescheduleReason === option.value}
                  onChange={(e) => setRescheduleReason(e.target.value)}
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


          {rescheduleReason === "other" && (
            <textarea
              className="form-control"
              placeholder="Other reason"
              rows="3"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              style={{
                height: "75px",
                resize: "none",
                padding: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
            ></textarea>
          )}
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>


        <button
          className="btn btn-primary w-100 mt-3"
          style={{ backgroundColor: "#0076CE" }}
          onClick={handleReschedule}
          disabled={isRescheduling} // Disable button while loading
        >
          {isRescheduling ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Rescheduling...
            </>
          ) : (
            "Reschedule"
          )}
        </button>
      </div>
    </div>
  );
};

export default Reschedule;
