import React, { useState } from "react";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaUsers, FaBell } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

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
        { month: "Jan", percentage: 40 },
        { month: "Feb", percentage: 55 },
        { month: "Mar", percentage: 35 },
        { month: "Apr", percentage: 65 },
        { month: "May", percentage: 50 },
        { month: "Jun", percentage: 70 },
        { month: "Jul", percentage: 60 },
        { month: "Aug", percentage: 80 },
        { month: "Sep", percentage: 45 },
        { month: "Oct", percentage: 86 },
        { month: "Nov", percentage: 86 },
        { month: "Dec", percentage: 75 },
    ];

    return (
        <div style={{ marginLeft: "250px" }}>
            {/* ✅ Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom p-4">
                <div className="container-fluid">
                    <h4 className="navbar-brand">Dashboard</h4>
                    <div className="d-flex align-items-center">
                        <input type="text" className="form-control me-3" placeholder="Search..." style={{ width: "250px" }} />
                        <FaBell className="text-dark me-3" size={24} />
                        <img
                            src="https://m.media-amazon.com/images/I/61Vr0kW-YtL._AC_UF1000,1000_QL80_.jpg"
                            alt="Profile"
                            className="rounded-circle"
                            width="40"
                            height="40"
                        />
                    </div>
                </div>
            </nav>

            {/* ✅ Dashboard Content */}
            <div className="container p-5">
                {/* ✅ Manage Service Header with Year Dropdown */}
                <div className="d-flex justify-content-between align-items-center mb-4">
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
                <div className="row">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-md-3">
                            <div
                                className="card mb-3 shadow"
                                style={{ borderTop: `4px solid ${stat.borderColor}` }}
                            >
                                <div className="card-body">
                                    <div className="display-6 mb-2">{stat.icon}</div>
                                    <h3 className="mb-1">{stat.count}</h3>
                                    <h5 className="card-title">{stat.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ Two Column Row: Analytics & Most Booking Services */}
                <div className="row mt-4">
                    {/* 🔹 Analytics Section */}
                    <div className="col-md-7">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Analytics</h4>
                            <select
                                className="form-select w-auto"
                                value={analyticsYear}
                                onChange={(e) => setAnalyticsYear(e.target.value)}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="card shadow p-3">
                            <h6 className="mb-3">Highest Service Month: <strong>Oct - Nov 86%, 26 Services</strong></h6>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={areaData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1782D2" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#1782D2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Area type="linear" dataKey="percentage" stroke="#1782D2" fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 🔹 Most Booking Services Section */}
                    <div className="col-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Most Booking Services</h4>
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
                        <div className="card shadow p-3">
                            <p>📅 Most booking services data for {months[mostBookingMonth - 1]}, {mostBookingYear} will be displayed here...</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
