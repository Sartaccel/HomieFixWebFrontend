import React, { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import { useNavigate } from "react-router-dom";
const Worker = () => {

    const [activeTab, setActiveTab] = useState("recent");
    const navigate = useNavigate();

    return (
        <div>
            {/* Navbar */}
            <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
                <h2 className="heading mb-0" style={{ marginLeft: "31px" }}>Worker Details</h2>
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

            <div className="container" style={{ paddingTop: "80px" }}>
                <div className="d-flex gap-4 mx-2 align-items-center">
                    <button className="btn" onClick={() => navigate(-1)}>
                        <span style={{ fontSize: "20px" }}>←</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("recent")}
                    >
                        Worker Details
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Worker;
