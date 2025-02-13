import React, { useState } from "react";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaUsers, FaBell } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Dashboard.css";

import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";


const Dashboard = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Month is 0-based

    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [analyticsYear, setAnalyticsYear] = useState(currentYear.toString());
    const [mostBookingYear, setMostBookingYear] = useState(currentYear.toString());
    const [mostBookingMonth, setMostBookingMonth] = useState(currentMonth.toString());

    const stats = [
        { title: "Total Booking", count: 120, icon: <FaClipboardList />, borderColor: "#EA6C6E" },
        { title: "Completed", count: 90, icon: <FaCheckCircle />, borderColor: "#EFA066" },
        { title: "Cancelled", count: 15, icon: <FaTimesCircle />, borderColor: "#31DDFC" },
        { title: "Total Workers", count: 25, icon: <FaUsers />, borderColor: "#1FA2FF" },
    ];

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

    // Sample data for Area Chart
    const areaData = [
        { month: "Jan", percentage: 10 },
        { month: "Feb", percentage: 55 },
        { month: "Mar", percentage: 35 },
        { month: "Apr", percentage: 65 },
        { month: "May", percentage: 50 },
        { month: "Jun", percentage: 70 },
        { month: "Jul", percentage: 60 },
        { month: "Aug", percentage: 80 },
        { month: "Sep", percentage: 45 },
        { month: "Oct", percentage: 78 },
        { month: "Nov", percentage: 65 },
        { month: "Dec", percentage: 90 },
    ];

    // Custom Tooltip for Area Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const currentData = payload[0].payload;
            const index = areaData.findIndex((data) => data.month === label);

            let previousPercentage = index > 0 ? areaData[index - 1].percentage : currentData.percentage;
            let isUp = currentData.percentage >= previousPercentage;
            let arrowColor = isUp ? "#22EC07" : "#F00";

            return (
                <div className="custom-tooltip p-2" style={{ backgroundColor: "white", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <div>
                        {isUp ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
                                <path d="M3.64645 0.646446C3.84171 0.451184 4.15829 0.451184 4.35355 0.646446L7.53553 3.82843C7.7308 4.02369 7.7308 4.34027 7.53553 4.53553C7.34027 4.7308 7.02369 4.7308 6.82843 4.53553L4 1.70711L1.17157 4.53553C0.97631 4.7308 0.659728 4.7308 0.464466 4.53553C0.269203 4.34027 0.269203 4.02369 0.464466 3.82843L3.64645 0.646446ZM3.5 15L3.5 1L4.5 1L4.5 15L3.5 15Z" fill={arrowColor} />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
                                <path d="M3.64645 14.3536C3.84171 14.5488 4.15829 14.5488 4.35355 14.3536L7.53553 11.1716C7.7308 10.9763 7.7308 10.6597 7.53553 10.4645C7.34027 10.2692 7.02369 10.2692 6.82843 10.4645L4 13.2929L1.17157 10.4645C0.97631 10.2692 0.659728 10.2692 0.464466 10.4645C0.269203 10.6597 0.269203 10.9763 0.464466 11.1716L3.64645 14.3536ZM3.5 0L3.5 14L4.5 14L4.5 0L3.5 0Z" fill={arrowColor} />
                            </svg>
                        )}
                        <span className="ms-2">{currentData.percentage}%</span>, <span>{currentData.services} Services</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div >
            {/* ✅ Navbar */}
            <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
                <h2 className="heading align-items-center mb-0" style={{marginLeft:"31px"}}>Dashboard</h2>
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

            {/* ✅ Dashboard Content */}
            <div className="container p-5" >
                {/* ✅ Manage Service Header with Year Dropdown */}
                <div className="d-flex justify-content-between align-items-center mb-3" style={{ marginTop: "50px" }}>
                    <h4>Manage Service</h4>
                    <select
                        className="form-select w-auto"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* ✅ Cards Section */}
                <div className="row mb-0">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-md-3">
                            <div
                                className="card mb-2" // Reduced bottom margin slightly
                                style={{ borderTop: `4px solid ${stat.borderColor}`, height: "140px" }} // Adjust height
                            >
                                <div className="card-body p-2"> {/* Reduced padding */}
                                    <div className="display-6 mb-1">{stat.icon}</div> {/* Reduced margin */}
                                    <h3 className="mb-1">{stat.count}</h3>
                                    <h6 className="card-title fw-normal">{stat.title}</h6> {/* Reduced font size */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* ✅ Two Column Row: Analytics & Most Booking Services */}
                <div className="row mt-2">
                    {/* 🔹 Analytics Section */}
                    <div className="col-md-7">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 >Analytics</h4>
                            <select
                                className="form-select w-auto mb-2"
                                value={analyticsYear}
                                onChange={(e) => setAnalyticsYear(e.target.value)}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        {/* Area Chart */}
                        <div className="card " style={{height: "325px"}}>
                            <h6 className="mb-3 text-muted ms-5">Highest Service Month: <strong>Oct - Nov 86%, 26 Services</strong></h6>
                            <ResponsiveContainer width="120%" height={340}>
                                <AreaChart data={areaData} margin={{ top: 10}} style={{height: "280px", marginLeft: "-70px"}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1782D2" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#1782D2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                        interval={0}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="linear" dataKey="percentage" stroke="#1782D2" fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 🔹 Most Booking Services Section */}
                    <div className="col-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h4 className="fs-5">Most Booking Services</h4>
                            <div className="d-flex">
                                <select
                                    className="form-select me-2 w-auto"
                                    value={mostBookingMonth}
                                    onChange={(e) => setMostBookingMonth(e.target.value)}
                                >
                                    {months.map((month, index) => (
                                        <option key={index + 1} value={index + 1}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    className="form-select w-auto"
                                    value={mostBookingYear}
                                    onChange={(e) => setMostBookingYear(e.target.value)}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Table for Most Booking Services */}
                        <div className="card p-2" style={{ height: "325px", overflow: "hidden" }}>
                            <div style={{ height: "290px"}}>
                                <table className="table table-borderless" style={{ width: "100%" }}>
                                    <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
                                        <tr style={{ lineHeight: "0.7" }}> {/* Reduced further */}
                                            <th className="text-muted">Service Name</th>
                                            <th className="text-muted">Services</th>
                                            <th className="text-muted">Booking (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>1. Plumbing</td>
                                            <td>35</td>
                                            <td>78%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>2. Electrical</td>
                                            <td>26</td>
                                            <td>82%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>3. Cleaning</td>
                                            <td>18</td>
                                            <td>65%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>4. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>5. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>6. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>7. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>8. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>9. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                        <tr style={{ lineHeight: "0.9" }}>
                                            <td>10. Painting</td>
                                            <td>15</td>
                                            <td>90%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;