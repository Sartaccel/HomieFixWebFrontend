import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import "../styles/Reviews.css";

const Reviews = () => {
    const [activeTab, setActiveTab] = useState("recent");
    const [selectedStar, setSelectedStar] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const years = Array.from({ length: new Date().getFullYear() - 2019 + 1 }, (_, i) => 2020 + i);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
                <div className="d-flex justify-content-between border-bottom " style={{ marginTop: "50px",marginBottom:"5px" }}>
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

                        {/* Month Filter */}
                        <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="">Filter by Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>

                        {/* Year Filter */}
                        <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">Filter by Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
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
