import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import "../styles/Reviews.css";

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
                        <select className="form-select" value={selectedStar} onChange={(e) => setSelectedStar(e.target.value)}>
                            <option value="">Filter by Stars</option>
                            <option value="5">★★★★★ (5 Stars)</option>
                            <option value="4">★★★★☆ (4 Stars)</option>
                            <option value="3">★★★☆☆ (3 Stars)</option>
                            <option value="2">★★☆☆☆ (2 Stars)</option>
                            <option value="1">★☆☆☆☆ (1 Star)</option>
                        </select>

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
                    {activeTab === "recent" ? (
                        <div className="card p-3">
                            <h5>Recent Reviews</h5>
                            <p>Displaying recent reviews...</p>
                        </div>
                    ) : (
                        <div className="card p-3">
                            <h5>All Reviews</h5>
                            <p>Displaying all reviews...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reviews;
