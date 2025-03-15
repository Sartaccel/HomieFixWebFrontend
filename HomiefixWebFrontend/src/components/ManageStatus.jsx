import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ManageStatus = ({ booking, onStatusUpdate, onReschedule, onCancel }) => {
  const { id } = useParams();
  const [serviceStarted, setServiceStarted] = useState("No");
  const [serviceCompleted, setServiceCompleted] = useState("No");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (booking) {
      setServiceStarted(
        booking.bookingStatus === "STARTED" ||
          booking.bookingStatus === "COMPLETED"
          ? "Yes"
          : "No"
      );
      setServiceCompleted(booking.bookingStatus === "COMPLETED" ? "Yes" : "No");
    }
  }, [booking]);

  const handleUpdateStatus = async () => {
    if (serviceCompleted === "Yes" && serviceStarted === "No") {
      setErrorMessage("Service must be started before it can be completed.");
      return;
    }

    if (serviceStarted === "No") {
      await onStatusUpdate("ASSIGNED");
    } else if (serviceCompleted === "No") {
      await onStatusUpdate("STARTED");
    } else if (serviceCompleted === "Yes") {
      await onStatusUpdate("COMPLETED");
    }

    setErrorMessage(""); // Clear any previous error messages
  };

  const getLinePosition = () => {
    if (booking.cancelReason) {
      // If cancellation exists, highlight both the "Cancelled" row and the status row
      switch (booking.bookingStatus) {
        case "CANCELLED":
          return { position: "80px", color: "#AE1319" }; // Highlight the "Cancelled" row
        case "STARTED":
          return { position: "137px", color: "black" }; // Highlight the "Started" row
        case "COMPLETED":
          return { position: "212px", color: "#1F7A45" }; // Highlight the "Completed" row
        default:
          return { position: "72px", color: "black" }; // Default to "Booking Successful"
      }
    }
  
    if (booking.rescheduleReason) {
      // If rescheduled, highlight the "Rescheduled" row
      return { position: "70px", color: "#C14810" };
    }
  
    // Highlight based on the booking status
    switch (booking.bookingStatus) {
      case "ASSIGNED":
        return { position: "150px", color: "black" }; // Highlight the "Worker Assigned" row
      case "STARTED":
        return { position: "137px", color: "black" }; // Highlight the "Started" row
      case "COMPLETED":
        return { position: "212px", color: "#1F7A45" }; // Highlight the "Completed" row
      case "CANCELLED":
        return { position: "80px", color: "#AE1319" }; // Highlight the "Cancelled" row
      default:
        return { position: "72px", color: "black" }; // Default to "Booking Successful"
    }
  };

  const { position, color } = getLinePosition();

  return (
    <div className="col-md-6">
      <div
        className="card rounded p-4 shadow-sm"
        style={{
          marginTop: "47px",
          minHeight: "300px",
          maxWidth: "600px",
          marginLeft: "-40px",
          bottom: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <h5>Status update</h5>
        <div
          className="p-3 mt-3 rounded"
          style={{
            height: "300px",
            width: "550px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "20px",
          }}
        >
          <div
            className="position-absolute"
            style={{
              top: position,
              left: "0px",
              width: "4px",
              backgroundColor: color,
              height: "75px",
              transition: "height 0.5s ease-in-out",
            }}
          ></div>

          <table
            className="table w-100"
            style={{ position: "relative", width: "100%" }}
          >
            <tbody>
              {/* Booking Successful Row */}
              <tr style={{ height: "40px", width: "500px" }}>
                <td className="text-start border-right">
                  <span style={{ color: "grey" }}>
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}{" "}
                    |{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <br />
                  Booking Successful on{" "}
                  {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  {booking.timeSlot ? ` | ${booking.timeSlot}` : ""}
                </td>
                <td
                  className="text-end"
                  style={{ backgroundColor: "#f0f0f0" }}
                ></td>
              </tr>

              {/* Cancelled Row */}
              {booking.bookingStatus === "CANCELLED" && (
                <tr style={{ height: "40px", backgroundColor: "#f8e1e1" }}>
                  <td className="text-start border-right">
                    <span style={{ color: "grey" }}>
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}{" "}
                      |{" "}
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    <span
                      className="booking-details"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <span style={{ color: "#AE1319" }}>
                          Service Cancelled
                        </span>
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {booking.cancelReason}
                      </span>
                    </span>
                  </td>
                  <td
                    className="text-end"
                    style={{ backgroundColor: "#f0f0f0" }}
                  ></td>
                </tr>
              )}

              {/* Rescheduled Row */}
              {booking.rescheduleReason && (
                <tr style={{ height: "40px", backgroundColor: "#f8f3e6" }}>
                  <td className="text-start border-right">
                    <span style={{ color: "grey" }}>
                      {booking.bookedDate
                        ? new Date(booking.bookedDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          ) +
                          " | " +
                          new Date().toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Not Assigned"}
                    </span>
                    <span
                      className="booking-details"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "bold",
                          gap: "5px",
                        }}
                      >
                        <span style={{ color: "#C14810" }}>
                          Reschedule Service On{" "}
                          {new Date(booking.bookedDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                          {" | "}
                          {booking.timeSlot}
                        </span>
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {booking.rescheduleReason}
                      </span>
                    </span>
                  </td>
                  <td
                    className="text-end"
                    style={{ backgroundColor: "#f0f0f0" }}
                  ></td>
                </tr>
              )}

              {/* Worker Assigned Row */}
              <tr
                style={{
                  height: "70px",
                  width: "500px",
                  backgroundColor:
                    booking.bookingStatus === "ASSIGNED"
                      ? "#e8f0fe"
                      : "transparent",
                }}
              >
                <td className="text-start border-right">
                  <span style={{ color: "grey" }}>
                    {booking.bookedDate
                      ? new Date(booking.bookedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        ) +
                        " | " +
                        new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Not Assigned"}
                  </span>
                  <br />
                  Worker Assigned
                </td>
                <td
                  className="text-end"
                  style={{ backgroundColor: "#f0f0f0" }}
                ></td>
              </tr>

              {/* Service Started Row */}
              <tr
                style={{
                  height: "70px",
                  width: "500px",
                  backgroundColor:
                    booking.bookingStatus === "STARTED"
                      ? "#e8f0fe"
                      : "transparent",
                }}
              >
                <td className="text-start border-right">
                  <span style={{ color: "grey" }}>
                    {serviceStarted === "Yes"
                      ? `${new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })} | ${new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`
                      : `${new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })} | ${new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                  </span>
                  <br />
                  Service Started
                </td>
                <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}>
                  <span className="custom-dropdown">
                    <select
                      className="no-border"
                      onChange={(e) => setServiceStarted(e.target.value)}
                      value={serviceStarted}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </span>
                </td>
              </tr>

              {/* Service Completed Row */}
              <tr
                style={{
                  height: "80px",
                  width: "500px",
                  backgroundColor:
                    booking.bookingStatus === "COMPLETED"
                      ? "#e8f0fe"
                      : "transparent",
                }}
              >
                <td className="text-start border-right">
                  <span style={{ color: "grey" }}>
                    {serviceCompleted === "Yes"
                      ? `${new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })} | ${new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`
                      : `${new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })} | ${new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                  </span>
                  <br />
                  <span
                    style={{
                      color:
                        booking.bookingStatus === "COMPLETED"
                          ? "#1F7A45"
                          : "black",
                    }}
                  >
                    Service Completed
                  </span>
                </td>
                <td className="text-end" style={{ backgroundColor: "#f0f0f0" }}>
                  <span className="custom-dropdown">
                    <select
                      className="no-border"
                      onChange={(e) => setServiceCompleted(e.target.value)}
                      value={serviceCompleted}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </span>
                </td>
              </tr>

              {/* Update Button Row */}
              <tr>
                <td colSpan="2" className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateStatus}
                    style={{ marginTop: "10px" }}
                  >
                    Update
                  </button>
                  {errorMessage && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                      {errorMessage}
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStatus;