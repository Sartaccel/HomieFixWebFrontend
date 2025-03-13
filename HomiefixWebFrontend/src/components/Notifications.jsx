import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";

import notificationIcon from "../assets/noti.png"; // Image should be in the public folder

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:2222/notifications/recent");
            let notificationsData = response.data;

            const bookingPromises = notificationsData.map(async (notification) => {
                if (notification.bookingId) {
                    try {
                        const bookingResponse = await axios.get(`http://localhost:2222/booking/${notification.bookingId}`);
                        const bookingData = bookingResponse.data;

                        return { 
                            ...notification, 
                            productName: bookingData.productName || "No Product Found",
                            productImage: bookingData.productImage || null
                        };
                    } catch (err) {
                        return { ...notification, productName: "Unknown Product", productImage: null };
                    }
                }
                return notification;
            });

            const enrichedNotifications = await Promise.all(bookingPromises);

            // Sort by most recent first
            enrichedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (JSON.stringify(enrichedNotifications) !== JSON.stringify(notifications)) {
                setNotifications(enrichedNotifications);
            }
            setError(null);
        } catch (err) {
            setError("Error fetching notifications");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        return `${formattedDate}, ${formattedTime}`;
    };

    const getStatusBadge = (type) => {
        return (
            <span
                className="border rounded-2 px-2 py-1 text-nowrap d-inline-block"
                style={{
                    backgroundColor:
                        type === "NEW_BOOKING" ? "#EDF3F7" :
                        type === "CANCELLED_BOOKING" ? "#F7EDED" :
                        type === "DUE" ? "#FFF3CD" : "#D4EDDA",
                    color:
                        type === "NEW_BOOKING" ? "#0076CE" :
                        type === "CANCELLED_BOOKING" ? "#AE1319" :
                        type === "DUE" ? "#856404" : "#155724",
                    fontSize: "14px"
                }}
            >
                {type === "NEW_BOOKING" ? "New" :
                type === "CANCELLED_BOOKING" ? "Cancel" :
                type === "DUE" ? "Due" : "⭐ Rated"}
            </span>
        );
    };

    const getIcon = () => {
        return <img src={notificationIcon} alt="Notification" width={65} />;
    };

    return (
        <Card className="p-3 shadow-sm" style={{ maxWidth: "400px" }}>
            <h5>Notifications</h5>
            <div className="mt-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && !error && notifications.length === 0 && <p>No recent notifications</p>}
                {notifications.map((notification, index) => (
                    <div key={notification.id || index} className="d-flex align-items-start mt-1 p-0 gap-3 border-bottom">
                        <div className="bg-light rounded d-flex align-items-center mt-2">{getIcon()}</div>
                        <div className="w-100 mt-3">
                            {/* Status badge and date-time in same line, properly aligned */}
                            <div className="d-flex align-items-center justify-content-start gap-2">
                                {getStatusBadge(notification.notificationType)}
                                <small className="text-muted text-nowrap">{formatDateTime(notification.createdAt)}</small>
                            </div>
                            <p className="fw-bold">{notification.productName || "No Product"}</p>
                            <p className="mb-0 text-muted">{notification.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Notifications;