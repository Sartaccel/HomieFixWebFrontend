import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import "../styles/Reviews.css";
import userProfile from "../assets/user.png";

const Reviews = () => {
    const [activeTab, setActiveTab] = useState("recent");
    const [selectedStar, setSelectedStar] = useState("");

    // Get current year and month
    const currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1; // Months are 0-based, so adding 1

    // Set previous month and year
    let defaultYear = currentYear;
    let defaultMonth = currentMonth - 1;

    if (currentMonth === 1) { // If it's January, previous month should be December and year should decrease
        defaultMonth = 12;
        defaultYear = currentYear - 1;
    }

    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [selectedYear, setSelectedYear] = useState(defaultYear);

    // Generate years dynamically from 2020 to the current year
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
    }

    // Months array
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const reviews = [
        {
            id: 1,
            user: "John Doe",
            service: "Home Cleaning",
            rating: 5,
            review: "Great service, highly recommended!",
            date: "02 Feb 2024",
            profilePic: userProfile
        },
        {
            id: 2,
            user: "Emma Smith",
            service: "Plumbing",
            rating: 4,
            review: "Fixed my leak quickly. Good job!",
            date: "28 Jan 2024",
            profilePic: userProfile
        },
        {
            id: 3,
            user: "David Johnson",
            service: "Electrical Repair",
            rating: 3,
            review: "Okay service, but took longer than expected.",
            date: "15 Jan 2024",
            profilePic: userProfile
        }
    ];

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
            <div className="container pt-5 ">
                <div className="d-flex justify-content-between border-bottom " style={{ marginTop: "50px", marginBottom: "5px" }}>
                    {/* Tabs */}
                    <div className="d-flex gap-4 ">
                        <button
                            className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("recent")}
                        >
                            Recent Reviews
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "all" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Reviews
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="d-flex gap-3 p-2">
                        {/* Star Rating Filter */}
                        <div className="d-flex">
                            <select className="form-select me-2 w-auto" value={selectedStar} onChange={(e) => setSelectedStar(e.target.value)}>
                                <option value="5">⭐️ 5</option>
                                <option value="4">⭐️ 4</option>
                                <option value="3">⭐️ 3</option>
                                <option value="2">⭐️ 2</option>
                                <option value="1">⭐️ 1</option>
                            </select>
                        </div>


                        {/* Month & Year Filters - Now default to previous month and year */}
                        <div className="d-flex">
                            <select
                                className="form-select me-2 w-auto"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {months.map((month, index) => (
                                    <option key={index + 1} value={index + 1}>{month}</option>
                                ))}
                            </select>

                            <select
                                className="form-select w-auto"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Review Content */}
                <div className="mt-4">
                    <div className="row">
                        {reviews.map((review) => (
                            <div key={review.id} className="col-12 mb-4">
                                <div className="card p-2">
                                    <div className="d-flex align-items-center">
                                        {/* Profile Image (No border here) */}
                                        <img src={review.profilePic} alt="User" width="50" className="rounded-circle me-3" />

                                        {/* Service, User, Rating & Date (Border applied here) */}
                                        <div className="d-flex justify-content-between align-items-center w-100 border-bottom pb-2">
                                            <div>
                                            <small className="text-muted">{review.service}</small>
                                                <h6 className="mb-0 ">{review.user}</h6>
                                                
                                            </div>
                                            <div>
                                                <span className="text-dark px-2">{`⭐️ ${review.rating}`}</span>
                                                <small className="ms-2">{review.date}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Row 2: Review Message */}
                                    <p className="mt-2" style={{ marginLeft: "65px" }}>{review.review}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Reviews;
