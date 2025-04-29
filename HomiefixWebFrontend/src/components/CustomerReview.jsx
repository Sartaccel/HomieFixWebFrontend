import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import userProfile from "../assets/user.png";
import { useState } from "react";
import Header from "./Header";

const reviews = [
    { id: 1, user: "John Doe", service: "Home Cleaning", rating: 4.5, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.", bookingDate: "Feb 02, 2025", bookedDate: "Jan 25, 2025", bookedTime: "10:00AM - 12:00AM", profilePic: userProfile, phoneNumber: "9999999999", address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", amount: "500" },
    { id: 2, user: "Emma Smith", service: "Plumbing", rating: 4, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.", bookingDate: "28 Jan 2025", bookedDate: "Jan 25th 2025", bookedTime: "10:00AM - 12:00AM", profilePic: userProfile, phoneNumber: "8888888888", address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", amount: "500" },
    { id: 3, user: "David Johnson", service: "Electrical Repair", rating: 3, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.", bookingDate: "15 Jan 2025", bookedDate: "Jan 25th 2025", bookedTime: "10:00AM - 12:00AM", profilePic: userProfile, phoneNumber: "7777777777", address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", amount: "500" },
    { id: 4, user: "Sophia Martinez", service: "Plumbing Service", rating: 5, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.", bookingDate: "20 Dec 2024", bookedDate: "Jan 25th 2025", bookedTime: "10:00AM - 12:00AM", profilePic: userProfile, phoneNumber: "6666666666", address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", amount: "500" },
    { id: 5, user: "James Anderson", service: "Home Cleaning", rating: 4, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.", bookingDate: "25 Nov 2024", bookedDate: "Jan 25th 2025", bookedTime: "10:00AM - 12:00AM", profilePic: userProfile, phoneNumber: "5555555555", address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", amount: "500" },
    { id: 6, user: "Emily Carter", service: "AC Maintenance", rating: 2, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.", bookingDate: "30 Jan 2025", bookedDate: "Jan 25th 2025", bookedTime: "10:00AM - 12:00AM", profilePic: userProfile, phoneNumber: "4444444444", address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", amount: "500" }
];

const CustomerReview = () => {
    const { id } = useParams();
    const review = reviews.find((r) => r.id === Number(id));
    const [activeTab, setActiveTab] = useState("recent");
    const navigate = useNavigate();

    if (!review) {
        return <h2 className="text-center text-muted">Review not found</h2>;
    }

    return (
        <div>
            <Header />

            <div className="container" style={{ paddingTop: "80px" }}>
                <div className="d-flex gap-4 mx-2 align-items-center">
                    <button className="btn" onClick={() => navigate(-1)}>
                        <span style={{ fontSize: "20px" }}>←</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("recent")}
                    >
                        Recent Reviews
                    </button>
                </div>

                <div className="row mx-2">
                    <div className="col-md-6">
                        <div className="card mt-4">
                            <div className="card-body mb-3">
                                <h5 className="card-title">Customer</h5>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <img
                                            src={review.profilePic}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: "69px", height: "65px" }}
                                        />
                                    </div>
                                    <div className="ms-3 mt-2">
                                        <p className="card-text mb-1"> <span className="bi bi-person"></span> {review.user}</p>
                                        <p className="card-text mb-1"> <span className="bi bi-telephone"></span> {review.phoneNumber}</p>
                                        <div className="d-flex">
                                            <i className="bi bi-geo-alt"></i>
                                            <p className="card-text mb-1 mx-1"> {review.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <p>Customer Review <span className="bi bi-star-fill text-warning mx-2"> </span> {review.rating}</p>
                                </div>

                                <div className="row  border-bottom">
                                    <p className="text-muted">{review.review}</p>
                                </div>

                                <h5 className="card-title mt-4">Worker Details</h5>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <img
                                            src={review.profilePic}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: "69px", height: "65px" }}
                                        />
                                    </div>
                                    <div className="ms-3 mt-2">
                                        <p className="card-text mb-1"> <span className="bi bi-person"></span> {review.user}</p>
                                        <p className="card-text mb-1"> <span className="bi bi-telephone"></span> {review.phoneNumber}</p>
                                        <div className="d-flex">
                                            <i className="bi bi-geo-alt"></i>
                                            <p className="card-text mb-1 mx-1"> {review.address}</p>
                                        </div>
                                        <button className="btn w-100 mt-1" style={{ backgroundColor: "#0076CE", color: "white" }}>View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card mb-3 mt-4 p-3">
                            <div className="card-body">
                                <h5 className="card-title">Service Details</h5>
                                <div className="row">
                                    <div className="col-md-4">
                                        <p className="card-text text-muted">Booking Date</p>
                                        <p className="card-text text-muted">Service Type</p>
                                        <p className="card-text text-muted">Service date & time</p>
                                        <p className="card-text text-muted">Status</p>
                                        <p className="card-text text-muted">Total amount</p>
                                    </div>
                                    <div className="col-md-8">
                                        <p className="card-text text-end">{review.bookingDate}</p>
                                        <p className="card-text text-end">{review.service}</p>
                                        <p className="card-text text-end">{review.bookedDate}, {review.bookedTime}</p>
                                        <p className="card-text text-end" style={{ color: "#0076CE" }}>{review.status}</p>
                                        <p className="card-text text-end">₹ {review.amount}</p>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-md-12 mt-4">
                                        <div className="d-flex">
                                            {/* Timeline/Process bar */}
                                            <div className="d-flex flex-column align-items-center me-3 mt-3">
                                                <div className="rounded-circle" style={{ width: "12px", height: "12px", backgroundColor: "#0076CE" }}></div>
                                                <div className="vr" style={{ height: "50px", marginLeft: "4.3px", width: "3px", backgroundColor: "#0076CE", opacity: "100%" }}></div>
                                                <div className="rounded-circle" style={{ width: "12px", height: "12px", backgroundColor: "#0076CE" }}></div>
                                                <div className="vr" style={{ height: "50px", marginLeft: "4.3px", width: "3px", backgroundColor: "#0076CE", opacity: "100%" }}></div>
                                                <div className="rounded-circle" style={{ width: "12px", height: "12px", backgroundColor: "#0076CE" }}></div>
                                            </div>

                                            {/* Timeline content */}
                                            <div className="flex-grow-1">
                                                <div className="mb-3">
                                                    <p className="card-text mb-1">{review.bookingDate}</p>
                                                    <p className="text-muted mb-0">Your booking is confirmed. Our team will contact you soon.</p>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="card-text mb-1">{review.bookingDate}</p>
                                                    <p className="text-muted mb-0">Confirmation call</p>
                                                </div>
                                                <div>
                                                    <p className="card-text mb-1">{review.bookedDate}</p>
                                                    <p className="text-muted mb-0">Service Completed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-md-12 d-flex justify-content-end">
                                        <button className="btn" style={{ backgroundColor: "#0076CE", color: "white" }}>Share</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReview;
