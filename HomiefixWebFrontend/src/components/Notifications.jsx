import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Placeholder } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../assets/noti.png";
import notificationFeedback from "../assets/feedback.svg";
import api from "../api";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => fetchNotifications(false), 5000);
    return () => clearInterval(interval);
  }, []);


  const fetchNotifications = async (isInitialLoad) => {
    try {
      if (isInitialLoad) {
        setInitialLoading(true);
      } else {
        setRefreshing(true);
      }


      const response = await api.get("/notifications/recent");
      let notificationsData = response.data;


      const bookingPromises = notificationsData.map(async (notification) => {
        if (notification.bookingId) {
          try {
            const bookingResponse = await api.get(
              `/booking/${notification.bookingId}`
            );
            const bookingData = bookingResponse.data;


            // Initialize rating as null
            let rating = null;
           
            // Only fetch rating if it's a feedback notification
            if (notification.notificationType === "FEEDBACK_BOOKING") {
              try {
                const ratingResponse = await api.get(
                  `/feedback/byBooking/${notification.bookingId}`
                );
                // Check if response is an array with at least one item
                if (Array.isArray(ratingResponse.data) && ratingResponse.data.length > 0) {
                  rating = ratingResponse.data[0].rating;
                }
              } catch (err) {
                console.error("Error fetching rating:", err);
                rating = null;
              }
            }


            return {
              ...notification,
              productName: bookingData.productName || "No Product Found",
              productImage: bookingData.productImage || null,
              bookingStatus: bookingData.bookingStatus || null,
              rating: rating
            };
          } catch (err) {
            return {
              ...notification,
              productName: "Unknown Product",
              productImage: null,
              bookingStatus: null,
              rating: null
            };
          }
        }
        return notification;
      });


      const enrichedNotifications = await Promise.all(bookingPromises);


      enrichedNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );


      if (
        JSON.stringify(enrichedNotifications) !== JSON.stringify(notifications)
      ) {
        setNotifications(enrichedNotifications);
      }
      setError(null);
    } catch (err) {
      setError("No internet connection. Please check your network.");
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };


  const formatDateTime = (dateString) => {
    const utcDate = new Date(dateString);
 
    // Offset IST is +5:30 => 330 minutes
    const istOffset = 330; // in minutes
    const istDate = new Date(utcDate.getTime() + istOffset * 60000);
 
    return istDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
 


  const getStatusBadge = (type, rating) => {
    return (
      <span
        className="border rounded-2 px-2 py-1 text-nowrap d-inline-block"
        style={{
          backgroundColor:
            type === "NEW_BOOKING"
              ? "#EDF3F7"
              : type === "CANCELLED_BOOKING"
              ? "#F7EDED"
              : type === "BOOKING_TODAY"
              ? "#F3EDF7"
              : type === "RESCHEDULE_BOOKING"
              ? "#FBDED0"
              : type === "WORKER_REASSIGNED"
              ? "#FFFFE0" : "#EDF3F7",
          color:
            type === "NEW_BOOKING"
              ? "#0076CE"
              : type === "CANCELLED_BOOKING"
              ? "#AE1319"
              : type === "BOOKING_TODAY"
              ? "#6D15A1"
              : type === "RESCHEDULE_BOOKING"
              ? "#EC692B"
              : type === "WORKER_REASSIGNED"
              ? "#E5A900"
              : "#000000",
          fontSize: "14px",
        }}
      >
        {type === "NEW_BOOKING"
          ? "New"
          : type === "CANCELLED_BOOKING"
          ? "Cancel"
          : type === "BOOKING_TODAY"
          ? "Due"
          : type === "RESCHEDULE_BOOKING"
          ? "Rescheduled"
          : type === "WORKER_REASSIGNED"
          ? "ReAssigned"
          : `⭐ ${rating !== null ? rating : ''}`}
      </span>
    );
  };


  const getIcon = (type) => {
    if (type === "FEEDBACK_BOOKING") {
      return <img src={notificationFeedback} alt="Feedback" width={65} />;
    }
    return <img src={notificationIcon} alt="Notification" width={65} />;
  };
 


  const handleNotificationClick = async (notification) => {
    if (!notification.bookingId) return;


    try {
      const bookingResponse = await api.get(
        `/booking/${notification.bookingId}`
      );
      const bookingData = bookingResponse.data;


      if (bookingData.bookingStatus === "PENDING") {
        navigate(`/booking-details/assign-bookings/${notification.bookingId}`, {
          state: { booking: bookingData },
        });
      } else {
        navigate(`/booking-details/view-bookings/${notification.bookingId}`, {
          state: { booking: bookingData },
        });
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);


      // Fallback navigation if API fails
      navigate(`/booking-details/assign-bookings/${notification.bookingId}`, {
        state: {
          booking: {
            id: notification.bookingId,
            productName: notification.productName,
            productImage: notification.productImage,
            bookingStatus: "PENDING",
            userProfile: {
              fullName: notification.name,
              mobileNumber: { mobileNumber: notification.contact },
            },
          },
        },
      });
    }
  };


  const NotificationSkeleton = () => (
    <div className="d-flex align-items-start mt-1 p-0 gap-3 border-bottom">
      <div className="bg-light rounded d-flex align-items-center mt-2">
        <Placeholder
          as="div"
          animation="wave"
          style={{ width: 65, height: 65 }}
        />
      </div>
      <div className="w-100 mt-3">
        <div className="d-flex align-items-center justify-content-start gap-2">
          <Placeholder
            as="span"
            animation="wave"
            style={{ width: 50, height: 24 }}
          />
          <Placeholder
            as="small"
            animation="wave"
            style={{ width: 100, height: 14 }}
          />
        </div>
        <Placeholder
          as="p"
          animation="wave"
          style={{ width: "80%", height: 20 }}
          className="mt-2"
        />
        <Placeholder
          as="p"
          animation="wave"
          style={{ width: "100%", height: 16 }}
          className="mb-2"
        />
      </div>
    </div>
  );


  return (
    <Card className="p-3 shadow-sm" style={{ minWidth: "400px", marginLeft: "-40px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notifications</h5>
        {/* {refreshing && <small className="text-muted">Updating...</small>} */}
      </div>


      <div className="mt-3" style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
        {initialLoading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : notifications.length === 0 ? (
          <p>No recent notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={notification.id || index}
              className="d-flex align-items-start mt-1 p-0 gap-3 border-bottom cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="bg-light rounded d-flex align-items-center mt-2">
              {getIcon(notification.notificationType)}


              </div>
              <div className="w-100 mt-3">
                <div className="d-flex align-items-center justify-content-start gap-2">
                  {getStatusBadge(notification.notificationType, notification.rating)}
                  <small className="text-muted text-nowrap">
                    {formatDateTime(notification.createdAt)}
                  </small>
                </div>
                <p className="fw-bold">
                  <span style={{ color: "#0076CE" }}>
                    ID: {notification.bookingId}
                  </span>{" "}
                  - {notification.productName || "No Product"}
                </p>
                <p className="mb-2">{notification.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};


export default Notifications;

