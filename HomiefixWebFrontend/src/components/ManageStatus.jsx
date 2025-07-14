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
  const [localServiceStarted, setLocalServiceStarted] = useState({
    date: null,
    time: null,
  });
  const [localServiceCompleted, setLocalServiceCompleted] = useState({
    date: null,
    time: null,
  });
  const [forceUpdate, setForceUpdate] = useState(0);

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
    reassignmentReason: null,
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
    if (safeBooking.bookingDate) {
      const serviceDate = new Date(`${safeBooking.bookedDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setIsServiceDateFuture(serviceDate > today);
    }

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

      setLocalServiceStarted({
        date: safeBooking.serviceStartedDate,
        time: safeBooking.serviceStartedTime,
      });

      setLocalServiceCompleted({
        date: safeBooking.serviceCompletedDate,
        time: safeBooking.serviceCompletedTime,
      });
    }

    return () => clearTimeout(timer);
  }, [safeBooking, forceUpdate]);

  const handleUpdateStatus = async () => {
    if (serviceCompleted === "Yes" && serviceStarted === "No") {
      setErrorMessage("Service must be started before it can be completed.");
      return;
    }

    if (serviceCompleted === "Yes" && isServiceDateFuture) {
      setErrorMessage("Cannot mark as completed before the service date.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0].substring(0, 8);

      let newStatus = safeBooking.bookingStatus;
      let startedDate = localServiceStarted.date;
      let startedTime = localServiceStarted.time;
      let completedDate = localServiceCompleted.date;
      let completedTime = localServiceCompleted.time;

      if (
        serviceStarted === "Yes" &&
        safeBooking.bookingStatus !== "STARTED" &&
        safeBooking.bookingStatus !== "COMPLETED"
      ) {
        newStatus = "STARTED";
        startedDate = currentDate;
        startedTime = currentTime;
      } else if (
        serviceCompleted === "Yes" &&
        safeBooking.bookingStatus !== "COMPLETED"
      ) {
        newStatus = "COMPLETED";
        completedDate = currentDate;
        completedTime = currentTime;
        if (serviceStarted === "No") {
          setServiceStarted("Yes");
          startedDate = currentDate;
          startedTime = currentTime;
        }
      } else if (
        serviceStarted === "No" &&
        safeBooking.bookingStatus === "STARTED"
      ) {
        newStatus = "ASSIGNED";
        startedDate = null;
        startedTime = null;
      } else if (
        serviceCompleted === "No" &&
        safeBooking.bookingStatus === "COMPLETED"
      ) {
        newStatus = "STARTED";
        completedDate = null;
        completedTime = null;
      }

      setLocalServiceStarted({ date: startedDate, time: startedTime });
      setLocalServiceCompleted({ date: completedDate, time: completedTime });

      await onStatusUpdate(
        newStatus,
        startedDate,
        startedTime,
        completedDate,
        completedTime
      );

      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating status:", error);
      setErrorMessage("Failed to update status. Please try again.");
      setLocalServiceStarted({
        date: safeBooking.serviceStartedDate,
        time: safeBooking.serviceStartedTime,
      });
      setLocalServiceCompleted({
        date: safeBooking.serviceCompletedDate,
        time: safeBooking.serviceCompletedTime,
      });
    } finally {
      setLoading(false);
    }
  };

  const getHighlightStyle = (rowType) => {
    const highlightStyles = {
      BOOKING_SUCCESSFUL: { borderLeft: "4px solid black" },
      CANCELLED: { borderLeft: "4px solid #B8141A" },
      RESCHEDULED: { borderLeft: "4px solid #C14810" },
      ASSIGNED: { borderLeft: "4px solid black" },
      REASSIGNED: { borderLeft: "4px solid #F4B400" },
      STARTED: { borderLeft: "4px solid black" },
      COMPLETED: { borderLeft: "4px solid #2FB467" },
    };

    if (rowType === safeBooking.bookingStatus) {
      return highlightStyles[rowType] || {};
    }

    if (rowType === "RESCHEDULED" && safeBooking.rescheduleReason) {
      return highlightStyles.RESCHEDULED || {};
    }

    if (rowType === "REASSIGNED" && safeBooking.rescheduleReason) {
      return highlightStyles.REASSIGNED || {};
    }

    return {};
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return "Not Assigned";

    try {
      const date = new Date(`${dateString}T${timeString}+05:30`);
      if (isNaN(date.getTime())) return "Not Assigned";

      const formattedDate = date.toLocaleDateString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      
      return `${formattedDate} | ${formattedTime}`;
    } catch (e) {
      return "Not Assigned";
    }
  };

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

  const renderStatusDropdown = (value, onChange, isStartDropdown = false) => {
    const disabled =
      isServiceDateFuture && (isStartDropdown || !isStartDropdown);
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <select
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);

            if (newValue === "Yes" && !disabled) {
              const now = new Date();
              const currentDate = now.toISOString().split("T")[0];
              const currentTime = now
                .toTimeString()
                .split(" ")[0]
                .substring(0, 8);

              if (onChange === setServiceStarted) {
                setLocalServiceStarted({
                  date: currentDate,
                  time: currentTime,
                });
              } else if (onChange === setServiceCompleted) {
                setLocalServiceCompleted({
                  date: currentDate,
                  time: currentTime,
                });
              }
            } else if (newValue === "No") {
              if (onChange === setServiceStarted) {
                setLocalServiceStarted({ date: null, time: null });
              } else if (onChange === setServiceCompleted) {
                setLocalServiceCompleted({ date: null, time: null });
              }
            }
          }}
          value={value}
          disabled={disabled || safeBooking.bookingStatus === "CANCELLED"}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontSize: "14px",
            outline: "none",
            appearance: "none",
            padding: "4px 20px 4px 8px",
            textAlign: "center",
            color:
              disabled || safeBooking.bookingStatus === "CANCELLED"
                ? "#ccc"
                : "inherit",
            cursor:
              disabled || safeBooking.bookingStatus === "CANCELLED"
                ? "not-allowed"
                : "pointer",
          }}
        >
          <option value="No">No</option>
          <option value="Yes" disabled={disabled}>
            {disabled && value === "Yes" ? "Yes (Not available yet)" : "Yes"}
          </option>
        </select>
        <span
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            fontSize: "10px",
            color:
              disabled || safeBooking.bookingStatus === "CANCELLED"
                ? "#ccc"
                : "inherit",
          }}
        >
          ▼
        </span>
      </div>
    );
  };
  const isReassigned = safeBooking.bookingStatus === "REASSIGNED";

  const bookingInfo = {
    label: isReassigned ? "Reassigned Service On" : "Rescheduled Service On",
    color: isReassigned ? "#F4B400" : "#C14810",
    date: safeBooking.rescheduledDate,
    timeSlot: safeBooking.rescheduledTimeSlot,
    reason: safeBooking.rescheduleReason,
    dateLabel: safeBooking.rescheduleDate,
    timeLabel: safeBooking.rescheduleTime,
  };

  return (
    <div>
      <div
        className="card rounded p-3"
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
        <div className="p-2">
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
                          "en-IN",
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
                    width: "80px",
                  }}
                ></td>
              </tr>


              {bookingInfo.date && bookingInfo.timeSlot && (
                <tr
                  style={{
                    color: "grey",
                    borderLeft: `4px solid ${bookingInfo.label.includes("Rescheduled") ? "#C14810" : "#F4B400"}`,
                  }}
                >
                  <td className="text-start border-right" style={{ border: "1px solid #E6E6E6" }}>
                    {isLoading ? (
                      <>
                        <SkeletonLoader width="60%" height="12px" />
                        <SkeletonLoader
                          width="80%"
                          height="16px"
                          style={{ marginTop: "4px" }} />
                      </>
                    ) : (
                      <>
                        <span>
                          {formatDateTime(bookingInfo.dateLabel, bookingInfo.timeLabel)}
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
                            <span style={{ color: bookingInfo.color }}>
                              {bookingInfo.label}{" "}
                              {bookingInfo.date
                                ? new Date(bookingInfo.date).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                                : "Not Assigned"}{" "}
                              | {bookingInfo.timeSlot || "Not Assigned"}
                            </span>
                          </span>
                          <span style={{ fontSize: "14px" }}>
                            {bookingInfo.reason?.split(" ").length > 7
                              ? bookingInfo.reason.split(" ").slice(0, 7).join(" ") + "..."
                              : bookingInfo.reason}
                          </span>
                        </span>
                      </>
                    )}
                  </td>
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
                      width: "80px",
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
                    width: "80px",
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
                            localServiceStarted.date,
                            localServiceStarted.time
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
                    width: "80px",
                    padding: "0 8px",
                  }}
                >
                  {isLoading ? (
                    <SkeletonLoader width="40px" height="24px" />
                  ) : safeBooking.bookingStatus !== "CANCELLED" &&
                    safeBooking.bookingStatus !== "COMPLETED" ? (
                    renderStatusDropdown(
                      serviceStarted,
                      setServiceStarted,
                      true
                    )
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
                            localServiceCompleted.date,
                            localServiceCompleted.time
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

                <td
                  className="text-center"
                  style={{
                    backgroundColor: "#FAFAFA",
                    border: "1px solid #E6E6E6",
                    width: "80px",
                    padding: "0 8px",
                  }}
                >
                  {isLoading ? (
                    <SkeletonLoader width="40px" height="24px" />
                  ) : safeBooking.bookingStatus !== "CANCELLED" &&
                    safeBooking.bookingStatus !== "COMPLETED" ? (
                    renderStatusDropdown(
                      serviceCompleted,
                      setServiceCompleted,
                      false
                    )
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
                      onClick={handleUpdateStatus}
                      disabled={
                        safeBooking.bookingStatus === "CANCELLED" ||
                        loading ||
                        safeBooking.bookingStatus === "COMPLETED"
                      }
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        height: "40px",
                        border: "none",
                        borderRadius: "12px",
                        backgroundColor:
                          safeBooking.bookingStatus === "CANCELLED" ||
                            loading ||
                            safeBooking.bookingStatus === "COMPLETED"
                            ? "#A0A0A0"
                            : "#0076CE",
                        marginBottom: "10px",
                        cursor:
                          safeBooking.bookingStatus === "CANCELLED" ||
                            loading ||
                            safeBooking.bookingStatus === "COMPLETED"
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          safeBooking.bookingStatus === "CANCELLED" ||
                            loading ||
                            safeBooking.bookingStatus === "COMPLETED"
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
                      ) : safeBooking.bookingStatus === "COMPLETED" ? (
                        "Completed"
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
