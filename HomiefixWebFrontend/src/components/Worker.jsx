import React, { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import { useNavigate } from "react-router-dom";
import dop from "../assets/addWorker.png"

const Worker = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("recent");

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

            <div className="container" style={{ paddingTop: "80px", paddingLeft: "0px", paddingRight: "0px", marginLeft: "-10px" }}>
                <div className="d-flex mx-2 align-items-center border-bottom w-100 mt-3">
                    <button className="btn" onClick={() => navigate(-1)}>
                        <span style={{ fontSize: "20px" }}>←</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""} `}
                        onClick={() => setActiveTab("recent")}
                    >
                        Worker Details
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="container">
                <div className="row">
                    <div className="col-4 border p-4 mt-4 mx-5 rounded">
                        <div className=" d-flex justify-content-between">
                            <div className="d-flex">
                                <p>Role:</p>
                                <p className="border border-dark rounded-pill mx-2 px-2">Plumber</p>
                                <p className="border border-dark rounded-pill px-2">Electrician</p>
                            </div>
                            <div>
                                <a className="text-decoration-none" style={{ color: "#0076CE" }} href="">Edit</a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="d-flex ">
                                <div>
                                    <img className="rounded" src={dop} alt="photo" height={100} width={100} />
                                </div>
                                <div className="mx-4">
                                    <p><i className="bi bi-person mx-1"></i>Alen sam</p>
                                    <p><i className="bi bi-telephone mx-1"></i>9327363763</p>
                                    <p className="mx-1">Rating:
                                        <i className="bi bi-star-fill text-warning mx-1"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning mx-1"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-muted mx-1"></i>
                                        4
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="d-flex">
                                <i className="bi bi-geo-alt mx-1"></i>
                                <p>23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <p>Joining Date</p>
                                <p>Aadhar Number</p>
                                <p>Language</p>
                                <p>Total Service</p>
                            </div>
                            <div className="col-7">
                                <p>: Jan 25 2025</p>
                                <p>: **** **** 4567</p>
                                <p>: Tamil, Malayalam, English</p>
                                <p>: 30</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-7 mt-4">
                        <div className="row">
                            <div className="d-flex mt-1 border">
                                <p className="border-bottom border-3 border-dark pb-2 px-2">Service Details</p>
                                <p className="mx-5 pb-2 px-2">In Progress</p>
                                <p className="pb-2 px-2">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Worker;
