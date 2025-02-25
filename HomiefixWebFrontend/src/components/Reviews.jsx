import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import "../styles/Reviews.css";
import userProfile from "../assets/user.png";
import { Link } from "react-router-dom";

const Reviews = () => {
    const [activeTab, setActiveTab] = useState("recent");
    const [selectedStar, setSelectedStar] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    // Generate years dynamically from 2020 to the current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

    // Months array
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const reviews = [
        { id: 1, user: "John Doe", service: "Home Cleaning", rating: 5, review: "Great service, highly recommended!", date: "02 Feb 2025", profilePic: userProfile },
        { id: 2, user: "Emma Smith", service: "Plumbing", rating: 4, review: "Fixed my leak quickly. Good job!", date: "28 Jan 2025", profilePic: userProfile },
        { id: 3, user: "David Johnson", service: "Electrical Repair", rating: 3, review: "Okay service, but took longer than expected.", date: "15 Jan 2025", profilePic: userProfile },
        { id: 4, user: "Sophia Martinez", service: "Plumbing Service", rating: 5, review: "Excellent service! Quick and professional.", date: "20 Dec 2024", profilePic: userProfile },
        { id: 5, user: "James Anderson", service: "Home Cleaning", rating: 4, review: "Good cleaning service, but missed a few spots.", date: "25 Nov 2024", profilePic: userProfile },
        { id: 6, user: "Emily Carter", service: "AC Maintenance", rating: 2, review: "Not satisfied, had to call them again to fix the issue.", date: "30 Jan 2025", profilePic: userProfile }
    ];

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split(" ");
        return new Date(parseInt(year), months.findIndex(m => m.startsWith(month)), parseInt(day));
    };

    const getMonthYear = (dateString) => {
        const [_, month, year] = dateString.split(" ");
        return { month, year };
    };

    const getMonthNumber = (monthName) => months.findIndex(m => m.startsWith(monthName)) + 1;

    const filteredReviews = reviews.filter((review) => {
        const { month, year } = getMonthYear(review.date);
        const monthNumber = getMonthNumber(month);
        const reviewDate = parseDate(review.date);

        return (
            (!selectedStar || review.rating === Number(selectedStar)) &&
            (!selectedMonth || monthNumber === Number(selectedMonth)) &&
            (!selectedYear || year === String(selectedYear)) &&
            (activeTab === "recent" ? reviewDate >= oneMonthAgo : true)
        );
    });

    const recentReviewCount = reviews.filter((review) => {
        const reviewDate = parseDate(review.date);
        return (
            reviewDate >= oneMonthAgo &&
            (!selectedStar || review.rating === Number(selectedStar)) &&
            (!selectedMonth || getMonthNumber(getMonthYear(review.date).month) === Number(selectedMonth)) &&
            (!selectedYear || getMonthYear(review.date).year === String(selectedYear))
        );
    }).length;

    return (
        <div>
            {/* Navbar */}
            <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
                <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Customers Review</h2>
                <div className="header-right d-flex align-items-center gap-3">
                    <div className="input-group" style={{ width: "300px" }}>
                        <input type="text" className="form-control search-bar" placeholder="Search" />
                        <span className="input-group-text">
                            <img src={search} alt="Search" width="20" />
                        </span>
                    </div>
                    <img src={notification} alt="Notifications" width="40" className="cursor-pointer" />
                    <img src={profile} alt="Profile" width="40" className="cursor-pointer" />
                </div>
            </header>

            {/* Main Content */}
            <div className="container-fluid p-0 pt-5">
            <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
                    {/* Tabs */}
                    <div className="d-flex gap-4 mx-4">
                        <button className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`} onClick={() => setActiveTab("recent")}>
                            Recent Reviews <span className="badge bg-dark">{recentReviewCount}</span>
                        </button>
                        <button className={`tab-btn ${activeTab === "all" ? "active-tab" : ""}`} onClick={() => setActiveTab("all")}>
                            All Reviews
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="d-flex gap-2 p-2">
                        <select className="form-select w-auto" value={selectedStar} onChange={(e) => setSelectedStar(e.target.value)}>
                            <option value="">All Ratings</option>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <option key={star} value={star}>⭐ {star}</option>
                            ))}
                        </select>

                        <select className="form-select w-auto" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="">All Months</option>
                            {months.map((month, index) => (
                                <option key={index + 1} value={index + 1}>{month}</option>
                            ))}
                        </select>

                        <select className="form-select w-auto" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">All Years</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-4 p-3" >
                    <div className="row scrollable-reviews">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div key={review.id} className="col-12 mb-4">
                                    <div className="card p-2">
                                        <div className="d-flex align-items-center">
                                            <img src={review.profilePic} alt="User" width="50" className="rounded-circle me-3" />
                                            <div className="d-flex justify-content-between w-100 border-bottom pb-2">
                                                <div>
                                                    <small className="text-muted">{review.service}</small>
                                                    <h6 className="mb-0">
                                                        <Link to={`/reviews/customer-review/${review.id}`} className="text-dark text-decoration-none">
                                                            {review.user}
                                                        </Link>
                                                    </h6>
                                                </div>
                                                <div>
                                                    <span className="text-dark px-2"><i className="bi bi-star-fill text-warning mx-1"></i> {review.rating}</span>
                                                    <small className="ms-2">{review.date}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-muted" style={{ marginLeft: "65px" }}>{review.review}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No reviews found for the selected filters.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
