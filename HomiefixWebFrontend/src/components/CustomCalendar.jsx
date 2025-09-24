import { useState } from "react";
import leftc from "../assets/LeftC.svg";
import RightC from "../assets/RightC.svg";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CustomCalendar({ onDateSelect }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState("days"); // "days" | "months" | "years"

  // Days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Years list (show 10 years block)
  const startYear = Math.floor(currentYear / 10) * 10;
  const yearsBlock = Array.from({ length: 10 }, (_, i) => startYear + i);

  // Handle month navigation
  const handlePrevMonth = () => {
    if (viewMode === "days") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (viewMode === "years") {
      setCurrentYear(currentYear - 10); // previous decade
    }
  };

  const handleNextMonth = () => {
    if (viewMode === "days") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (viewMode === "years") {
      setCurrentYear(currentYear + 10); // next decade
    }
  };

  return (
    <div className="p-3 bg-white rounded-3" style={{ width: "300px" }}>
      {/* Header with Arrows + Dropdowns */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left Arrow */}
        <button className="btn btn-light btn-sm" onClick={handlePrevMonth}>
          <img src={leftc} style={{ width: "12px", height: "12px" }} />
        </button>

        {/* Year Selector */}
        <button
          className="btn btn-light btn-sm me-2"
          type="button"
          onClick={() =>
            setViewMode(viewMode === "years" ? "days" : "years")
          }
        >
          {currentYear}
        </button>

        {/* Month Selector */}
        <button
          className="btn btn-light btn-sm"
          type="button"
          onClick={() =>
            setViewMode(viewMode === "months" ? "days" : "months")
          }
        >
          {monthNames[currentMonth]}
        </button>

        {/* Right Arrow */}
        <button className="btn btn-light btn-sm" onClick={handleNextMonth}>
          <img src={RightC} style={{ width: "12px", height: "12px" }} />
        </button>
      </div>

      {/* Weekdays (only in days view) */}
      {viewMode === "days" && (
        <div
          className="d-grid mb-1"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center fw-bold small">
              {d}
            </div>
          ))}
        </div>
      )}

      {/* Days View */}
      {viewMode === "days" && (
        <div
          className="d-grid"
          style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}
        >
          {days.map((day, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                day ? "bg-transparent text-dark border-0" : "invisible"
              }`}
              style={{ boxShadow: "none" }}
              onClick={() =>
                day && onDateSelect(new Date(currentYear, currentMonth, day))
              }
            >
              {day || ""}
            </button>
          ))}
        </div>
      )}

      {/* Months View */}
      {viewMode === "months" && (
        <div
          className="d-grid"
          style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}
        >
          {monthNames.map((m, index) => (
            <button
              key={m}
              className={`btn btn-sm ${
                index === currentMonth
                  ? "btn-primary text-white"
                  : "btn-light"
              }`}
              onClick={() => {
                setCurrentMonth(index);
                setViewMode("days"); // return to days view
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Years View */}
      {viewMode === "years" && (
        <div
          className="d-grid"
          style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}
        >
          {yearsBlock.map((year) => (
            <button
              key={year}
              className={`btn btn-sm ${
                year === currentYear ? "btn-primary text-white" : "btn-light"
              }`}
              onClick={() => {
                setCurrentYear(year);
                setViewMode("days"); // return to days view
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomCalendar;
