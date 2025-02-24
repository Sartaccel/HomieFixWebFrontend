import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import userProfile from "../assets/user.png";
import search from "../assets/Search.png";
import { useState } from "react";

const reviews = [
    { id: 1, user: "John Doe", service: "Home Cleaning", rating: 5, review: "Great service, highly recommended!", date: "02 Feb 2025", profilePic: userProfile },
    { id: 2, user: "Emma Smith", service: "Plumbing", rating: 4, review: "Fixed my leak quickly. Good job!", date: "28 Jan 2025", profilePic: userProfile },
    { id: 3, user: "David Johnson", service: "Electrical Repair", rating: 3, review: "Okay service, but took longer than expected.", date: "15 Jan 2025", profilePic: userProfile },
    { id: 4, user: "Sophia Martinez", service: "Plumbing Service", rating: 5, review: "Excellent service! Quick and professional.", date: "20 Dec 2024", profilePic: userProfile },
    { id: 5, user: "James Anderson", service: "Home Cleaning", rating: 4, review: "Good cleaning service, but missed a few spots.", date: "25 Nov 2024", profilePic: userProfile },
    { id: 6, user: "Emily Carter", service: "AC Maintenance", rating: 2, review: "Not satisfied, had to call them again to fix the issue.", date: "30 Jan 2025", profilePic: userProfile }
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

                <div className="row mt-4">
                    <div className="col-md-6 p-3 border d-flex justify-content-between">
                        <div>
                            <h4>Customer Details</h4>
                            <img src={review.profilePic} alt={review.user} className="rounded-circle" width="80" height="80" />
                        </div>
                        <div className="flex-column">
                            <p>{review.user}</p>
                            <p>{review.date}</p>
                            <p>⭐ 5</p>
                        </div>
                    </div>
                    <div className="col-md-6 p-3 border">
                        <h4>Service Details</h4>
                        <p><strong>Service:</strong> {review.service}</p>
                        <p><strong>Review:</strong> {review.review}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReview;
