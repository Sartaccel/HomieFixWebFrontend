import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ManageStatus = ({ booking, onStatusUpdate, onReschedule, onCancel }) => {
  const { id } = useParams();
  const [serviceStarted, setServiceStarted] = useState("No");
  const [serviceCompleted, setServiceCompleted] = useState("No");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isServiceDateFuture, setIsServiceDateFuture] = useState(false);

  const handleClick = async () => {
    setLoading(true); // Start loading
    await handleUpdateStatus(); // Call your function
    setLoading(false); // Stop loading
  };

  // Initialize a safeBooking object to prevent null reference errors
  const safeBooking = booking || {
    bookingStatus: "",
    rescheduleReason: null,
    bookingDate: null,
    bookingTime: null,
    bookedDate: null,
    timeSlot: null,
    rescheduleDate: null,
    rescheduleTime: null,
    rescheduledDate: null,
    rescheduledTimeSlot: null,
    cancelledDate: null,
    cancelledTime: null,
    cancelReason: null,
    workerAssignDate: null,
    workerAssignTime: null,
    serviceStartedDate: null,
    serviceStartedTime: null,
    serviceCompletedDate: null,
    serviceCompletedTime: null,
  };

  useEffect(() => {
    // Check if service date is in the future
    if (safeBooking.bookingDate) {
      const serviceDate = new Date(`${safeBooking.bookedDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setIsServiceDateFuture(serviceDate > today);
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (safeBooking.bookingStatus) {
      setServiceStarted(
        safeBooking.bookingStatus === "STARTED" ||
          safeBooking.bookingStatus === "COMPLETED"
          ? "Yes"
          : "No"
      );
      setServiceCompleted(
        safeBooking.bookingStatus === "COMPLETED" ? "Yes" : "No"
      );
    }

    return () => clearTimeout(timer);
  }, [safeBooking]);

  const handleUpdateStatus = async () => {
    if (serviceCompleted === "Yes" && serviceStarted === "No") {
      setErrorMessage("Service must be started before it can be completed.");
      return;
    }

    if (serviceCompleted === "Yes" && isServiceDateFuture) {
      setErrorMessage("Cannot mark as completed before the service date.");
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
      CANCELLED: { borderLeft: "4px solid #B8141A" },
      RESCHEDULED: { borderLeft: "4px solid #C14810" },
      ASSIGNED: { borderLeft: "4px solid black" },
      STARTED: { borderLeft: "4px solid black" },
      COMPLETED: { borderLeft: "4px solid #2FB467" },
    };

    // Only highlight the row if it matches the current status or scenario
    if (rowType === safeBooking.bookingStatus) {
      return highlightStyles[rowType] || {};
    }

    // Highlight the rescheduled row only if the status is RESCHEDULED
    if (rowType === "RESCHEDULED" && safeBooking.rescheduleReason) {
      return highlightStyles.RESCHEDULED || {};
    }
    // No highlight for other rows
    return {};
  };

  // Helper function to format date and time
  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return "Not Assigned";

    const date = new Date(`${dateString}T${timeString}`);

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} | ${formattedTime}`;
  };

  // Skeleton loader component
  const SkeletonLoader = ({
    width = "100%",
    height = "16px",
    className = "",
  }) => (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    ></div>
  );

  return (
    <div>
      <div
        className="card rounded p-4"
        style={{
          marginTop: "47px",
          minHeight: "300px",
          maxWidth: "560px",
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
                  {isLoading ? (
                    <>
                      <SkeletonLoader width="60%" height="12px" />
                      <SkeletonLoader
                        width="80%"
                        height="16px"
                        style={{ marginTop: "4px" }}
                      />
                    </>
                  ) : (
                    <>
                      <span style={{ color: "grey" }}>
                        {formatDateTime(
                          safeBooking.bookingDate,
                          safeBooking.bookingTime
                        )}
                      </span>
                      <br />
                      Booking Successful on{" "}
                      {safeBooking.bookedDate
                        ? new Date(safeBooking.bookedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )
                        : "Not Assigned"}
                      {safeBooking.timeSlot ? ` | ${safeBooking.timeSlot}` : ""}
                    </>
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

              {safeBooking.rescheduleReason && (
                <tr
                  style={{
                    height: "40px",
                    ...(safeBooking.bookingStatus === "RESCHEDULED"
                      ? getHighlightStyle("RESCHEDULED")
                      : {}),
                  }}
                >
                  <td
                    className="text-start border-right"
                    style={{ border: "1px solid #E6E6E6" }}
                  >
                    {isLoading ? (
                      <>
                        <SkeletonLoader width="60%" height="12px" />
                        <SkeletonLoader
                          width="80%"
                          height="16px"
                          style={{ marginTop: "4px" }}
                        />
                      </>
                    ) : (
                      <>
                        <span style={{ color: "grey" }}>
                          {formatDateTime(
                            safeBooking.rescheduleDate,
                            safeBooking.rescheduleTime
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
                              {safeBooking.rescheduledDate
                                ? new Date(
                                  safeBooking.rescheduledDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                                : "Not Assigned"}
                              {" | "}
                              {safeBooking.rescheduledTimeSlot ||
                                "Not Assigned"}
                            </span>
                          </span>
                          <span style={{ fontSize: "14px" }}>
                            {safeBooking.rescheduleReason
                              ? safeBooking.rescheduleReason.split(" ").length >
                                7
                                ? safeBooking.rescheduleReason
                                  .split(" ")
                                  .slice(0, 7)
                                  .join(" ") + "..."
                                : safeBooking.rescheduleReason
                              : ""}
                          </span>
                        </span>
                      </>
                    )}
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
              {safeBooking.bookingStatus === "CANCELLED" && (
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
                    {isLoading ? (
                      <>
                        <SkeletonLoader width="60%" height="12px" />
                        <SkeletonLoader
                          width="80%"
                          height="16px"
                          style={{ marginTop: "4px" }}
                        />
                      </>
                    ) : (
                      <>
                        <span style={{ color: "grey" }}>
                          {formatDateTime(
                            safeBooking.cancelledDate,
                            safeBooking.cancelledTime
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
                            {safeBooking.cancelReason
                              ? safeBooking.cancelReason.split(" ").length > 7
                                ? safeBooking.cancelReason
                                  .split(" ")
                                  .slice(0, 7)
                                  .join(" ") + "..."
                                : safeBooking.cancelReason
                              : ""}
                          </span>
                        </span>
                      </>
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
                  {isLoading ? (
                    <>
                      <SkeletonLoader width="60%" height="12px" />
                      <SkeletonLoader
                        width="80%"
                        height="16px"
                        style={{ marginTop: "4px" }}
                      />
                    </>
                  ) : safeBooking.bookingStatus !== "CANCELLED" ? (
                    <>
                      <span style={{ color: "grey" }}>
                        {formatDateTime(
                          safeBooking.workerAssignDate,
                          safeBooking.workerAssignTime
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
                  {isLoading ? (
                    <>
                      <SkeletonLoader width="60%" height="12px" />
                      <SkeletonLoader
                        width="80%"
                        height="16px"
                        style={{ marginTop: "4px" }}
                      />
                    </>
                  ) : safeBooking.bookingStatus !== "CANCELLED" ? (
                    <>
                      <span style={{ color: "grey" }}>
                        {serviceStarted === "Yes"
                          ? formatDateTime(
                            safeBooking.serviceStartedDate,
                            safeBooking.serviceStartedTime
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
                  {isLoading ? (
                    <SkeletonLoader width="40px" height="24px" />
                  ) : safeBooking.bookingStatus !== "CANCELLED" &&
                    safeBooking.bookingStatus !== "COMPLETED" ? (
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
                  {isLoading ? (
                    <>
                      <SkeletonLoader width="60%" height="12px" />
                      <SkeletonLoader
                        width="80%"
                        height="16px"
                        style={{ marginTop: "4px" }}
                      />
                    </>
                  ) : safeBooking.bookingStatus !== "CANCELLED" ? (
                    <>
                      <span style={{ color: "grey" }}>
                        {serviceCompleted === "Yes"
                          ? formatDateTime(
                            safeBooking.serviceCompletedDate,
                            safeBooking.serviceCompletedTime
                          )
                          : "Not Assigned"}
                      </span>
                      <br />
                      <span
                        style={{
                          color:
                            safeBooking.bookingStatus === "COMPLETED"
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

                {safeBooking.status !== "COMPLETED" && (
                  <td
                    className="text-center"
                    style={{
                      backgroundColor: "#FAFAFA",
                      border: "1px solid #E6E6E6",
                      width: "80px",
                    }}
                  >
                    {isLoading ? (
                      <SkeletonLoader width="40px" height="24px" />
                    ) : safeBooking.bookingStatus !== "CANCELLED" ? (
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
                          disabled={isServiceDateFuture}
                          style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "14px",
                            outline: "none",
                            appearance: "none",
                            paddingRight: "20px",
                            color: isServiceDateFuture ? "#ccc" : "inherit",
                          }}
                        >
                          <option value="No">No</option>
                          <option value="Yes" disabled={isServiceDateFuture}>
                            {isServiceDateFuture ? "Yes (Not available yet)" : "Yes"}
                          </option>
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
                  {isLoading ? (
                    <SkeletonLoader
                      width="90%"
                      height="36px"
                      style={{ margin: "10px auto" }}
                    />
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={
                        safeBooking.bookingStatus !== "CANCELLED"
                          ? handleClick
                          : undefined
                      }
                      disabled={
                        safeBooking.bookingStatus === "CANCELLED" || loading
                      }
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        height: "40px",
                        border: "none",
                        borderRadius: "12px",
                        backgroundColor:
                          safeBooking.bookingStatus === "CANCELLED" || loading
                            ? "#A0A0A0"
                            : "#0076CE",
                        marginBottom: "10px",
                        cursor:
                          safeBooking.bookingStatus === "CANCELLED" || loading
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          safeBooking.bookingStatus === "CANCELLED" || loading
                            ? 0.6
                            : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Update"
                      )}
                    </button>
                  )}


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
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};

export default ManageStatus;