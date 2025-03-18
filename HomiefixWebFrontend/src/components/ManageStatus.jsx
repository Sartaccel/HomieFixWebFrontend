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

  // Helper function to format date and time
  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return "Not Assigned";

    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
                    {formatDateTime(booking.bookingDate, booking.bookingTime)}
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
                    width: "60px",
                  }}
                ></td>
              </tr>

              {booking.rescheduleReason && (
                <tr
                  style={{
                    height: "40px",
                    ...(booking.bookingStatus === "RESCHEDULED"
                      ? getHighlightStyle("RESCHEDULED")
                      : {}),
                  }}
                >
                  <td
                    className="text-start border-right"
                    style={{ border: "1px solid #E6E6E6" }}
                  >
                    <span style={{ color: "grey" }}>
                      {formatDateTime(
                        booking.rescheduleDate,
                        booking.rescheduleTime
                      )}
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
                          {booking.bookedDate
                            ? new Date(booking.bookedDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                          {" | "}
                          {booking.timeSlot || "N/A"}
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
                      {formatDateTime(
                        booking.serviceCompletedDate,
                        booking.serviceCompletedTime
                      )}
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
                      width: "60px",
                    }}
                  ></td>
                </tr>
              )}

              {/* Worker Assigned Row */}
              <tr
                style={{
                  height: "40px",
                  width: "500px",
                  ...getHighlightStyle("ASSIGNED"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{
                    border: "1px solid #E6E6E6",
                    height: "60px",
                    verticalAlign: "middle",
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <>
                      <span style={{ color: "grey" }}>
                        {formatDateTime(
                          booking.workerAssignDate,
                          booking.workerAssignTime
                        )}
                      </span>
                      <br />
                      <span style={{ color: "black" }}>Worker Assigned</span>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px",
                        width: "100%",
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
                    width: "60px",
                  }}
                ></td>
              </tr>

              {/* Service Started Row */}
              <tr
                style={{
                  height: "40px",
                  width: "500px",
                  ...getHighlightStyle("STARTED"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{
                    border: "1px solid #E6E6E6",
                    height: "60px",
                    verticalAlign: "middle",
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <>
                      <span style={{ color: "grey" }}>
                        {serviceStarted === "Yes"
                          ? formatDateTime(
                              booking.serviceStartedDate,
                              booking.serviceStartedTime
                            )
                          : "Not Assigned"}
                      </span>
                      <br />
                      <span style={{ color: "black" }}>Service Started</span>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px",
                        width: "100%",
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
                    width: "60px",
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" &&
                  booking.bookingStatus !== "COMPLETED" ? (
                    <span
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "100%",
                      }}
                    >
                      <select
                        onChange={(e) => setServiceStarted(e.target.value)}
                        value={serviceStarted}
                        style={{
                          border: "none",
                          background: "transparent",
                          fontSize: "14px",
                          outline: "none",
                          appearance: "none", // Hides default arrow
                          paddingRight: "20px",
                        }}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      <span
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      >
                        ▼
                      </span>
                    </span>
                  ) : (
                    <span
                      style={{
                        visibility: "hidden",
                        width: "100%",
                        display: "inline-block",
                      }}
                    >
                      -
                    </span>
                  )}
                </td>
              </tr>

              {/* Service Completed Row */}
              <tr
                style={{
                  height: "40px",
                  width: "500px",
                  ...getHighlightStyle("COMPLETED"),
                }}
              >
                <td
                  className="text-start border-right"
                  style={{
                    border: "1px solid #E6E6E6",
                    height: "60px",
                    verticalAlign: "middle",
                  }}
                >
                  {booking.bookingStatus !== "CANCELLED" ? (
                    <>
                      <span style={{ color: "grey" }}>
                        {serviceCompleted === "Yes"
                          ? formatDateTime(
                              booking.serviceCompletedDate,
                              booking.serviceCompletedTime
                            )
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px",
                        width: "100%",
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
                      width: "80px",
                    }}
                  >
                    {booking.bookingStatus !== "CANCELLED" ? (
                      <span
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <select
                          onChange={(e) => setServiceCompleted(e.target.value)}
                          value={serviceCompleted}
                          style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "14px",
                            outline: "none",
                            appearance: "none",
                            paddingRight: "20px",
                          }}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                        <span
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        >
                          ▼
                        </span>
                      </span>
                    ) : (
                      <span
                        style={{
                          visibility: "hidden",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        -
                      </span>
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
                    onClick={
                      booking.bookingStatus !== "CANCELLED"
                        ? handleUpdateStatus
                        : undefined
                    }
                    disabled={booking.bookingStatus === "CANCELLED"}
                    style={{
                      marginTop: "10px",
                      width: "90%",
                      border: "none",
                      borderRadius: "14px",
                      backgroundColor:
                        booking.bookingStatus === "CANCELLED"
                          ? "#A0A0A0"
                          : "#0076CE", // Grey for disabled
                      marginBottom: "10px",
                      cursor:
                        booking.bookingStatus === "CANCELLED"
                          ? "not-allowed"
                          : "pointer",
                      opacity: booking.bookingStatus === "CANCELLED" ? 0.6 : 1,
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
