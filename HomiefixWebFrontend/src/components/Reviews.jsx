import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import "../styles/Reviews.css";
import userProfile from "../assets/addWorker.jpg";
import { Link } from "react-router-dom";
import Header from "./Header";
import api from "../api";

const Reviews = () => {
    const [activeTab, setActiveTab] = useState("recent");
    const [selectedStar, setSelectedStar] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/feedback/all");

                // Fetch booking details for each review in parallel
                const reviewsWithService = await Promise.all(
                    response.data.map(async (review) => {
                        try {
                            // Assuming each feedback has a bookingId field
                            const bookingResponse = await api.get(`/booking/${review.bookingId}`);
                            const serviceName = bookingResponse.data.productName || "General Service";

                            return {
                                id: review.id,
                                user: review.userProfile?.fullName || "Anonymous User",
                                service: serviceName, // Use the productName from booking
                                rating: review.rating,
                                review: review.comment,
                                date: new Date(review.reviewedDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }),
                                profilePic: userProfile
                            };
                        } catch (bookingError) {
                            console.error(`Error fetching booking for review ${review.id}:`, bookingError);
                            // Fallback to worker's role if booking fetch fails
                            return {
                                id: review.id,
                                user: review.userProfile?.fullName || "Anonymous User",
                                service: review.worker?.role || "General Service",
                                rating: review.rating,
                                review: review.comment,
                                date: new Date(review.reviewedDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }),
                                profilePic: userProfile
                            };
                        }
                    })
                );

                setReviews(reviewsWithService.sort((a, b) => b.id - a.id));
            } catch (err) {
                setError("Failed to fetch reviews.");
                console.error("Error fetching reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split(" ");
        return new Date(parseInt(year), months.findIndex(m => m.startsWith(month)), parseInt(day));
    };

    const getMonthYear = (dateString) => {
        const [_, month, year] = dateString.split(" ");
        return { month, year };
    };

    const getMonthNumber = (monthName) => months.findIndex(m => m.startsWith(monthName)) + 1;

    const filteredReviews = [...reviews]  // Create a copy of the array
        .sort((a, b) => b.id - a.id)     // Sort by ID descending
        .filter((review) => {
            if (!review.date) return false;

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
        if (!review.date) return false;

        const reviewDate = parseDate(review.date);
        return (
            reviewDate >= oneMonthAgo &&
            (!selectedStar || review.rating === Number(selectedStar)) &&
            (!selectedMonth || getMonthNumber(getMonthYear(review.date).month) === Number(selectedMonth)) &&
            (!selectedYear || getMonthYear(review.date).year === String(selectedYear))
        );
    }).length;

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }



    return (
        <div>
            {/* Navbar */}
            <Header />

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
                                <option key={star} value={star}> ⭐ {star}</option>
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
                                                    <span className="text-dark px-2"><span className="bi bi-star-fill text-warning"></span> {review.rating}</span>
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