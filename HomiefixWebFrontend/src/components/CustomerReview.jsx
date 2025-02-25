import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import userProfile from "../assets/user.png";
import search from "../assets/Search.png";
import { useState } from "react";

const reviews = [
    {
        id: 1, user: "John Doe", phone: "1234567890", serviceType: "Home Cleaning", rating: 5, review: "BEST Home Service is excellent! They offer subsidies for their services, making it affordable for everyone. I highly recommend them for their great work and commitment to helping the community.",
        bookingDate: "02 Feb 2025", serviceDate: "05 Feb 2025", serviceTime: "09:00AM - 11:00AM", worker: "John Doe", profilePic: userProfile, address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582", status: "Completed", totalAmout: "$ 500"
    },
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
            <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
                <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Customers Review</h2>
                <div className="header-right d-flex align-items-center gap-3">
                    <div className="input-group" style={{ width: "300px" }}>
                        <input type="text" className="form-control search-bar" placeholder="Search" />
                        <span className="input-group-text">
                            <img src={search} alt="Search" width="20" />
                        </span>
                    </div>
                </div>
            </header>

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

                <div className="p-2">
                    {/* Customer Details Section */}
                    <div className="row mt-4" style={{ marginLeft: "40px", marginRight: "40px" }}>
                        <div className="col-md-6 p-3 border border-bottom rounded-top">
                            <h4>Customer</h4>
                            <div className="d-flex">
                                <img src={review.profilePic} alt={review.user} className="rounded-circle" width="80" height="80" />
                                <div className="flex-column mx-3">
                                    <p> <i className="bi bi-person"></i> {review.user}</p>
                                    <p> <i className="bi bi-telephone"></i> {review.phone}</p>
                                    <div className="d-flex">
                                        <i className="bi bi-geo-alt"></i>
                                        <p className="mx-1">{review.address}</p>
                                    </div>
                                </div>
                            </div>
                            <h5 className="fw-normal">Customer Review <i className="bi bi-star-fill text-warning mx-3"></i>{review.rating}</h5>
                            <p className="text-muted">{review.review}</p>
                        </div>

                        {/* Service Details */}
                        <div className="col-md-5 p-3 border-end border-start border-top rounded-top" style={{ marginLeft: "20px" }}  >
                            <h4>Service Details</h4>
                            <div className="d-flex justify-content-between">
                                <p className="text-muted">Booking Date</p>
                                <p>{review.bookingDate}</p>
                            </div>

                            <div className="d-flex justify-content-between">
                                <p className="text-muted">Service Type</p>
                                <p>{review.serviceType}</p>
                            </div>

                            <div className="d-flex justify-content-between">
                                <p className="text-muted">Service Date & Time</p>
                                <p>{review.serviceDate}, {review.serviceTime}</p>
                            </div>

                            <div className="d-flex justify-content-between">
                                <p className="text-muted">Status</p>
                                <p style={{ color: "#0076CE" }}>{review.status}</p>
                            </div>

                            <div className="d-flex justify-content-between">
                                <p className="text-muted">Total Amount</p>
                                <p>{review.totalAmout}</p>
                            </div>
                        </div>
                    </div>


                    {/* Worker Details */}
                    <div className="row " style={{ marginLeft: "40px", marginRight: "40px" }}>
                        <div className="col-md-6 p-3 border-bottom border-start border-end rounded-bottom">
                            <h4 className="mt-4 mb-4">Worker Details</h4>
                            <div className="d-flex">
                                <img src={review.profilePic} alt={review.user} className="" width="80" height="80" />
                                <div className="flex-column mx-3 mb-3">
                                    <p> <i className="bi bi-person"></i> {review.user}</p>
                                    <p> <i className="bi bi-telephone"></i> {review.phone}</p>
                                    <div className="d-flex">
                                        <i className="bi bi-geo-alt"></i>
                                        <p className="mx-1">{review.address}</p>
                                    </div>
                                    <button className="btn" style={{ backgroundColor: "#0076CE", color: "white", width: "100%" }}>View Details</button>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-5 p-3 border-bottom border-end rounded-bottom border-start" style={{ marginLeft: "20px", marginTop: "-60px" }}>
                            <div>
                                <p>{review.bookingDate}</p>
                                <p className="" style={{ marginTop: "-14px" }}>Your Booking is Confirmed. Our Team will Contact You Soon.</p>
                            </div>

                            <div className="mt-5">
                                <p>{review.bookingDate}</p>
                                <p className="" style={{ marginTop: "-14px" }} >Confirmation Call</p>
                            </div>

                            <div className="mt-5">
                                <p>{review.bookingDate}</p>
                                <p className="" style={{ marginTop: "-14px" }} >Service Completed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReview;
