import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Placeholder } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../assets/noti.png";
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


            return {
              ...notification,
              productName: bookingData.productName || "No Product Found",
              productImage: bookingData.productImage || null,
              bookingStatus: bookingData.bookingStatus || null,
            };
          } catch (err) {
            return {
              ...notification,
              productName: "Unknown Product",
              productImage: null,
              bookingStatus: null,
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


    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  const getStatusBadge = (type) => {
    return (
      <span
        className="border rounded-2 px-2 py-1 text-nowrap d-inline-block"
        style={{
          backgroundColor:
            type === "NEW_BOOKING"
              ? "#EDF3F7"
              : type === "CANCELLED_BOOKING"
              ? "#F7EDED"
              : type === "DUE"
              ? "#FFF3CD"
              : "#D4EDDA",
          color:
            type === "NEW_BOOKING"
              ? "#0076CE"
              : type === "CANCELLED_BOOKING"
              ? "#AE1319"
              : type === "DUE"
              ? "#856404"
              : "#155724",
          fontSize: "14px",
        }}
      >
        {type === "NEW_BOOKING"
          ? "New"
          : type === "CANCELLED_BOOKING"
          ? "Cancel"
          : type === "DUE"
          ? "Due"
          : "⭐ Rated"}
      </span>
    );
  };


  const getIcon = () => {
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
    <Card className="p-3 shadow-sm" style={{ maxWidth: "400px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notifications</h5>
        {refreshing && <small className="text-muted">Updating...</small>}
      </div>


      <div className="mt-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
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
                {getIcon()}
              </div>
              <div className="w-100 mt-3">
                <div className="d-flex align-items-center justify-content-start gap-2">
                  {getStatusBadge(notification.notificationType)}
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
