import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/AssignBookings.css";

const Reschedule = ({ id, booking, onClose, onReschedule }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(true);

  // Fetch available dates and times
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch("http://localhost:2222/booking/available-dates");
        const data = await response.json();
        console.log("Available Dates from API:", data); // Debugging

        // Transform dates into a valid format
        const validDates = data
          .map((date) => {
            // Remove the day of the week (e.g., "Saturday") from the date string
            const cleanedDate = date.replace(/\s\w+day\s/, " "); // Removes " Saturday", " Sunday", etc.
            console.log("Cleaned Date:", cleanedDate); // Debugging

            // Parse the cleaned date
            const parsedDate = new Date(cleanedDate);
            if (isNaN(parsedDate.getTime())) {
              console.warn("Invalid date found:", date); // Log invalid dates
              return null; // Skip invalid dates
            }
            return parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
          })
          .filter((date) => date !== null); // Remove null values

        setAvailableDates(validDates);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    const fetchAvailableTimes = async () => {
      try {
        const response = await fetch("http://localhost:2222/booking/available-times");
        const data = await response.json();
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

  // Handle date selection and deselection
  const handleDateSelection = (date) => {
    if (selectedDate === date) {
      // Deselect the date if already selected
      setSelectedDate("");
    } else {
      // Select the date
      setSelectedDate(date);
    }
  };

  // Handle time slot selection and deselection
  const handleTimeSlotSelection = (time) => {
    if (selectedTimeSlot === time) {
      // Deselect the time slot if already selected
      setSelectedTimeSlot("");
    } else {
      // Select the time slot
      setSelectedTimeSlot(time);
    }
  };

  // Handle reschedule button click
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTimeSlot || !rescheduleReason) {
      alert("Please select a date, time slot, and reason for reschedule");
      return;
    }

    // Validate selectedDate
    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      alert("Please select a valid date");
      return;
    }

    const reason = rescheduleReason === "other" ? otherReason : rescheduleReason;

    try {
      // Format the date as YYYY-MM-DD
      const formattedDate = parsedDate.toISOString().split("T")[0];
      const encodedTimeSlot = encodeURIComponent(selectedTimeSlot); // URL encode time
      const encodedReason = encodeURIComponent(reason); // URL encode reason

      const url = `http://localhost:2222/booking/reschedule/${id}?selectedDate=${formattedDate}&selectedTimeSlot=${encodedTimeSlot}&rescheduleReason=${encodedReason}`;

      console.log("Reschedule URL:", url);

      const response = await fetch(url, {
        method: "PUT",
      });

      if (response.ok) {
        alert("Booking rescheduled successfully");
        onReschedule(formattedDate, selectedTimeSlot); // Update parent state
        onClose(); // Close the Reschedule modal
      } else {
        const errorData = await response.json();
        console.error("Reschedule failed:", response.status, errorData);
        alert(`Failed to reschedule booking: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert("An error occurred during reschedule.");
    }
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate(); // Get the day (e.g., 21)
    const month = date.toLocaleString("en-US", { month: "short" }); // Get the month (e.g., "Feb")
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" }); // Get the day of the week (e.g., "Friday")

    return (
      <div>
        <div>{`${day} ${month}`}</div> {/* Output: "21 Feb" */}
        <div>{dayOfWeek}</div> {/* Output: "Friday" */}
      </div>
    );
  };

  return (
    <div className="reschedule-slider position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "550px", zIndex: 1000 }}>
      <div className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Reschedule Service</h4>
          <button className="btn btn-light" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        {/* Date Selection */}
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
                      border: selectedDate === date ? "1px solid #0076CE" : "1px solid #D2D2D2",
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
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        {/* Time Slot Selection */}
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
                      border: selectedTimeSlot === time ? "1px solid #0076CE" : "1px solid #D2D2D2",
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
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        {/* Reason for Reschedule */}
        <div className="mb-3 mt-3">
          <h6>Reason for Reschedule</h6>
          <div className="mb-2">
            {[
              { value: "technician unAvailability", label: "Technician Unavailability" },
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
                <label className="form-check-label" style={{ marginLeft: "5px" }} htmlFor={option.value}>
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
                height: "75px", // Fixed height
                resize: "none", // Prevents resizing
                padding: "10px", // Ensures proper spacing
                width: "100%", // Ensures it fills the container
                boxSizing: "border-box", // Prevents overflow issues
              }}
            ></textarea>
          )}
        </div>
        <div style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}></div>

        {/* Reschedule Button */}
        <button className="btn btn-primary w-100 mt-3" style={{ backgroundColor: "#0076CE" }} onClick={handleReschedule}>
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default Reschedule;