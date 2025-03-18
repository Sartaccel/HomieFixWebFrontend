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

  const getHighlightStyle = (rowType) => {
    // Define the highlight style for each row type
    const highlightStyles = {
      BOOKING_SUCCESSFUL: { borderLeft: "4px solid black" },
      CANCELLED: { borderLeft: "4px solid #AE1319" },
      RESCHEDULED: { borderLeft: "4px solid #C14810" },
      ASSIGNED: { borderLeft: "4px solid black" },
      STARTED: { borderLeft: "4px solid black" },
      COMPLETED: { borderLeft: "4px solid #1F7A45" },
    };

    // Only highlight the row if it matches the current status or scenario
    if (rowType === booking.bookingStatus) {
      return highlightStyles[rowType];
    }

    // Highlight the rescheduled row only if the status is RESCHEDULED
    if (rowType === "RESCHEDULED" && booking.rescheduleReason) {
      return highlightStyles.RESCHEDULED;
    }

    // No highlight for other rows
    return {};
  };

  return (
    <div className="col-md-6">
      <div
        className="card rounded p-4"
        style={{
          marginTop: "47px",
          minHeight: "300px",
          maxWidth: "550px",
          marginLeft: "0px",
          bottom: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <h5 style={{ paddingLeft: "20px" }}>Status update</h5>
        <div className="p-3 mt-2 ">
          <table
            className="table w-100"
            style={{
              position: "relative",
              width: "100%",
              border: "1px solid #E6E6E6",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {/* Booking Successful Row */}
              <tr
                style={{
                  height: "40px",
                  width: "500px",
                  ...getHighlightStyle("BOOKING_SUCCESSFUL"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{ border: "1px solid #E6E6E6" }}
                >
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
                  {new Date(booking.bookedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  {booking.timeSlot ? ` | ${booking.timeSlot}` : ""}
                </td>
                <td
                  className="text-end"
                  style={{
                    backgroundColor: "#FAFAFA",
                    border: "1px solid #E6E6E6",
                    width: "60px", // Fixed width for the right column
                  }}
                ></td>
              </tr>
              {/* Rescheduled Row */}
              {booking.rescheduleReason && (
                <tr
                  style={{
                    height: "40px",
                    ...(booking.status === "RESCHEDULED"
                      ? getHighlightStyle("RESCHEDULED")
                      : {}),
                  }}
                >
                  <td
                    className="text-start border-right"
                    style={{ border: "1px solid #E6E6E6" }}
                  >
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
                    style={{
                      backgroundColor: "#FAFAFA",
                      border: "1px solid #E6E6E6",
                    }}
                  ></td>
                </tr>
              )}
              {/* Cancelled Row */}
              {booking.bookingStatus === "CANCELLED" && (
                <tr
                  style={{
                    height: "40px",
                    ...getHighlightStyle("CANCELLED"),
                  }}
                >
                  <td
                    className="text-start border-right"
                    style={{ border: "1px solid #E6E6E6" }}
                  >
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
                        {booking.cancelReason
                          ? booking.cancelReason.split(" ").length > 4
                            ? booking.cancelReason
                                .split(" ")
                                .slice(0, 4)
                                .join(" ") + "..."
                            : booking.cancelReason
                          : ""}
                      </span>
                    </span>
                  </td>
                  <td
                    className="text-end"
                    style={{
                      backgroundColor: "#FAFAFA",
                      border: "1px solid #E6E6E6",
                      width: "60px", // Fixed width for the right column
                    }}
                  ></td>
                </tr>
              )}

              {/* Worker Assigned Row */}
              <tr
                style={{
                  height: "40px", // Fixed height
                  width: "500px", // Fixed width
                  ...getHighlightStyle("ASSIGNED"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{
                    border: "1px solid #E6E6E6",
                    height: "60px", // Ensures enough height for proper vertical centering
                    verticalAlign: "middle", // Aligns content within the cell
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <>
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
                      <span style={{ color: "black" }}>Worker Assigned</span>
                    </>
                  ) : (
                    // Flex container for vertical centering
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px", // Matches the td height
                        width: "100%", // Ensures full width
                      }}
                    >
                      <span style={{ color: "grey" }}>Worker Assigned</span>
                    </div>
                  )}
                </td>

                <td
                  className="text-end"
                  style={{
                    backgroundColor: "#FAFAFA",
                    border: "1px solid #E6E6E6",
                    width: "60px", // Fixed width for the right column
                  }}
                ></td>
              </tr>

              {/* Service Started Row */}
              <tr
                style={{
                  height: "40px", // Fixed height
                  width: "500px", // Fixed width
                  ...getHighlightStyle("STARTED"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{
                    border: "1px solid #E6E6E6",
                    height: "60px", // Ensures enough height for vertical centering
                    verticalAlign: "middle", // Helps align content inside the td
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <>
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
                          : "Not Assigned"}
                      </span>
                      <br />
                      <span style={{ color: "black" }}>Service Started</span>
                    </>
                  ) : (
                    // Full height flex container for centering
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px", // Matches the td height
                        width: "100%", // Ensures full width
                      }}
                    >
                      <span style={{ color: "grey" }}>Service Started</span>
                    </div>
                  )}
                </td>

                <td
                  className="text-center"
                  style={{
                    backgroundColor: "#FAFAFA",
                    border: "1px solid #E6E6E6",
                    width: "60px", // Fixed width for the right column
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" &&
                  booking.bookingStatus !== "COMPLETED" ? (
                    <span className="custom-dropdown">
                      <select
                        className="no-border"
                        onChange={(e) => setServiceStarted(e.target.value)}
                        value={serviceStarted}
                        style={{ width: "100%" }} // Ensure dropdown takes full width
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </span>
                  ) : (
                    <span
                      style={{
                        visibility: "hidden",
                        width: "100%",
                        display: "inline-block", // Ensures the placeholder takes up space
                      }}
                    >
                      -
                    </span> // Placeholder to maintain width
                  )}
                </td>
              </tr>

              {/* Service Completed Row */}
              <tr
                style={{
                  height: "40px", // Fixed height
                  width: "500px", // Fixed width
                  ...getHighlightStyle("COMPLETED"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{
                    border: "1px solid #E6E6E6",
                    height: "60px", // Ensures enough height for vertical centering
                    verticalAlign: "middle", // Helps with vertical alignment inside the td
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <>
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
                          : "Not Assigned"}
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
                    </>
                  ) : (
                    // Full height flex container for centering
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px", // Matches the td height
                        width: "100%", // Ensures full width
                      }}
                    >
                      <span style={{ color: "grey" }}>Service Completed</span>
                    </div>
                  )}
                </td>

                {booking.status !== "COMPLETED" && (
                  <td
                    className="text-center"
                    style={{
                      backgroundColor: "#FAFAFA",
                      border: "1px solid #E6E6E6",
                      width: "80px", // Fixed width for the right column
                    }}
                  >
                    {booking.bookingStatus !== "CANCELLED" ? (
                      <span className="custom-dropdown">
                        <select
                          className="no-border"
                          onChange={(e) => setServiceCompleted(e.target.value)}
                          value={serviceCompleted}
                          style={{ width: "100%" }} // Ensure dropdown takes full width
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </span>
                    ) : (
                      <span
                        style={{
                          visibility: "hidden",
                          width: "100%",
                          display: "inline-block", // Ensures the placeholder takes up space
                        }}
                      >
                        -
                      </span> // Placeholder to maintain width
                    )}
                  </td>
                )}
              </tr>

              {/* Update Button Row */}
              <tr>
                <td
                  colSpan="2"
                  className="text-center"
                  style={{ border: "1px solid #E6E6E6" }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateStatus}
                    style={{
                      marginTop: "10px",
                      width: "90%",
                      borderRadius: "14px",
                      backgroundColor: "#0076CE",
                      marginBottom: "10px",
                    }}
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
