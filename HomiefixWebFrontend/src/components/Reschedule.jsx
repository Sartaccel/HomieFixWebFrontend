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

  const isTimeSlotExpired = (timeSlot) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const selected = new Date(selectedDate);
    
    // Check if selected date is today
    if (
      selected.getDate() === today.getDate() &&
      selected.getMonth() === today.getMonth() &&
      selected.getFullYear() === today.getFullYear()
    ) {
      // Extract the start time from the time slot (e.g., "9:00 AM" from "9:00 AM - 11:00 AM")
      const startTimeStr = timeSlot.split(" - ")[0];
      
      // Parse the start time
      const [time, period] = startTimeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      
      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }
      
      // Create a Date object for the time slot's start time
      const slotTime = new Date(today);
      slotTime.setHours(hours, minutes, 0, 0);
      
      // Compare with current time
      return slotTime < today;
    }
    
    return false;
  };

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await api.get("/booking/available-dates");
        const data = response.data;
        
        const validDates = data.map((dateStr) => {
          const parts = dateStr.split(' ');
          if (parts.length < 4) return null;
          
          const day = parts[0];
          const month = parts[1];
          const year = parts[3];
          
          const date = new Date(`${month} ${day}, ${year} 12:00:00`);
          
          if (isNaN(date.getTime())) {
            console.warn("Invalid date found:", dateStr);
            return null;
          }
          
          return date.toISOString().split("T")[0];
        }).filter(date => date !== null);

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
        
        const formattedTimes = data.map(time => {
          return time.replace(/(\d{1,2}):(\d{2})/g, (match, hour, minute) => {
            return hour.padStart(2, '0') + ':' + minute;
          });
        });
        
        setAvailableTimes(formattedTimes);
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

  const isSameAsExistingBooking = () => {
    if (booking.rescheduledDate && booking.rescheduledTimeSlot) {
      return (
        selectedDate === booking.rescheduledDate && 
        selectedTimeSlot === booking.rescheduledTimeSlot
      );
    }
    return (
      selectedDate === booking.date && 
      selectedTimeSlot === booking.timeslot
    );
  };

  const isRescheduleDisabled = () => {
    const isOtherReasonEmpty = rescheduleReason === "other" && !otherReason.trim();
    
    return (
      !selectedDate || 
      !selectedTimeSlot || 
      !rescheduleReason || 
      isSameAsExistingBooking() || 
      isOtherReasonEmpty ||
      (
        (booking.rescheduledDate === null && booking.rescheduledTimeSlot === null) 
          ? (selectedDate === booking.bookedDate && selectedTimeSlot === booking.timeSlot) 
          : (selectedDate === booking.rescheduledDate && selectedTimeSlot === booking.rescheduledTimeSlot)
      )
    );
  };

  const handleReschedule = async () => {
    if (isSameAsExistingBooking()) {
      alert("Please select a different date or time slot for rescheduling");
      return;
    }

    if (!selectedDate || !selectedTimeSlot || !rescheduleReason) {
      alert("Please select a date, time slot, and reason for reschedule");
      return;
    }

    if (rescheduleReason === "other" && !otherReason.trim()) {
      alert("Please provide a reason for rescheduling");
      return;
    }

    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      alert("Please select a valid date");
      return;
    }

    const reason = rescheduleReason === "other" ? otherReason : rescheduleReason;

    try {
      setIsRescheduling(true);
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
          `Failed to reschedule booking: ${response.status} - ${
            response.data.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert("An error occurred during reschedule.");
    } finally {
      setIsRescheduling(false);
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
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Reschedule Service</h4>
          <button className="btn btn-light" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-2 mt-2">
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

        <div className="mb-2 mt-2">
          <h6>Time</h6>
          <div className="d-flex flex-wrap gap-2">
             {loadingTimes
    ? Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} width={80} height={30} />
      ))
    : availableTimes.map((time, index) => {
        const isExpired = isTimeSlotExpired(time);
        return (
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
              color: isExpired ? "#999" : "#333",
              backgroundColor: isExpired ? "#f5f5f5" : "transparent",
              cursor: isExpired ? "not-allowed" : "pointer",
            }}
            onClick={() => !isExpired && handleTimeSlotSelection(time)}
            disabled={isExpired}
          >
            {time}
          </button>
        );
      })}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-2 mt-2">
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
              placeholder="Other reason (required)"
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
              required
            ></textarea>
          )}
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <button
          className="btn btn-primary w-100 mt-2"
          style={{ backgroundColor: "#0076CE" }}
          onClick={handleReschedule}
          disabled={isRescheduleDisabled() || isRescheduling}
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