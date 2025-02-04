import React, { useState } from "react";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaUsers, FaBell, FaSearch } from "react-icons/fa"; // Added FaSearch
import "bootstrap/dist/css/bootstrap.min.css";
import searchIcon from "../assets/search.png"; // Ensure the correct import of the search icon
import notificationIcon from "../assets/Bell.png"; // Ensure the correct import
import profileIcon from "../assets/profile.png"; // Ensure the correct import'
import "../styles/Dashboard.css";

const Dashboard = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

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

    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
    }

    const months = [
        { name: "January", value: "1" },
        { name: "February", value: "2" },
        { name: "March", value: "3" },
        { name: "April", value: "4" },
        { name: "May", value: "5" },
        { name: "June", value: "6" },
        { name: "July", value: "7" },
        { name: "August", value: "8" },
        { name: "September", value: "9" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" },
    ];

    return (
        <div className="dashboard-page" style={{ marginLeft: "250px" }}>
            <header className="header">
                <h2 className="heading">Booking Details</h2>
                <div className="header-right">
                    <div className="search-bar">
                        <input type="text" placeholder="Search" />
                        <img src={searchIcon} alt="Search" className="search-icon" /> {/* Fixed search icon */}
                    </div>
                    <img src={notificationIcon} alt="Notifications" className="icon" /> {/* Fixed notification icon */}
                    <img src={profileIcon} alt="Profile" className="icon" /> {/* Fixed profile icon */}
                </div>
            </header>
            
            <div className="dashboard-content" >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Manage Service</h4>
                    <select className="form-select w-auto" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-md-3">
                            <div className="card mb-3 shadow" style={{ borderTop: `4px solid ${stat.borderColor}` }}>
                                <div className="card-body">
                                    <div className="display-6 mb-2">{stat.icon}</div>
                                    <h3 className="mb-1">{stat.count}</h3>
                                    <h5 className="card-title">{stat.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Analytics</h4>
                            <select className="form-select w-auto" value={analyticsYear} onChange={(e) => setAnalyticsYear(e.target.value)}>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="card shadow p-3">
                            <p>📊 Analytics data for {analyticsYear} will be displayed here...</p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Most Booking Services</h4>
                            <div className="d-flex">
                                <select className="form-select me-2 w-auto" value={mostBookingMonth} onChange={(e) => setMostBookingMonth(e.target.value)}>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>{month.name}</option>
                                    ))}
                                </select>

                                <select className="form-select w-auto" value={mostBookingYear} onChange={(e) => setMostBookingYear(e.target.value)}>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="card shadow p-3">
                            <p>📅 Most booking services data for {months.find(m => m.value === mostBookingMonth)?.name}, {mostBookingYear} will be displayed here...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
