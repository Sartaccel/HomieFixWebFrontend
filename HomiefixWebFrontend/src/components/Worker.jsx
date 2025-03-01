import React from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import { useNavigate } from "react-router-dom";
import dop from "../assets/addWorker.png";
import { useState } from "react";

const Worker = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("serviceDetails");

    const workerData = {
        roles: ["Plumber", "Electrician"],
        photo: dop,
        name: "Alen Sam",
        phone: "1234567890",
        rating: 4,
        address: "23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582",
        joiningDate: "Jan 25 2025",
        aadhar: "123456789012",
        languages: ["Tamil", "Malayalam", "English"],
        totalServices: 30,
    };

    const serviceDetailsData = [
        { id: 1, service: "Plumber", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.5, status: "Completed" },
        { id: 2, service: "Electrician", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.2, status: "Completed" },
        { id: 3, service: "Plumber", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.5, status: "Completed" },
        { id: 4, service: "Electrician", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.2, status: "Completed" },
        { id: 5, service: "Plumber", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.5, status: "Completed" },
        { id: 6, service: "Electrician", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.2, status: "Completed" },
        { id: 7, service: "Plumber", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.5, status: "Completed" },
        { id: 8, service: "Electrician", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", rating: 4.2, status: "Completed" },

    ];

    const inProgressData = [
        { id: 1, service: "Plumber", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", status: "STARTED" },
        { id: 2, service: "Electrician", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", status: "ASSIGNED" },
        { id: 3, service: "Plumber", name: "John Doe", phone: "1234567890", date: "Jan 25, 2023", status: "RESCHEDULED" },

    ];

    const reviewData = [
        { id: 1, name: "John Doe", service: "Plumber", rating: 4.5, feedback: "Excellent service!", profile: "https://via.placeholder.com/80" }
    ];


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
                <div className="d-flex border-bottom mx-2 align-items-center w-100 mt-3">
                    <button className="btn d-flex align-items-center" onClick={() => navigate(-1)}>
                        <span style={{ fontSize: "20px" }}>←</span>
                        <h5 className="px-3 pb-2 text-black mx-3"
                            style={{
                                borderBottom: "4px solid #000",
                                position: "relative",
                                marginBottom: "-11px"
                            }}>
                            Worker Details
                        </h5>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="container">
                <div className="row">
                    <div className="col-4 border p-4 mt-4 mx-5 rounded align-self-start h-auto d-flex flex-column">
                        {/* Role Section */}
                        <div className="d-flex justify-content-between">
                            <div className="d-flex">
                                <p>Role:</p>
                                {workerData.roles.map((role, index) => (
                                    <p key={index} className="border border-dark rounded-pill mx-2 px-2">
                                        {role}
                                    </p>
                                ))}
                            </div>
                            <div>
                                <a className="text-decoration-none" style={{ color: "#0076CE" }} href="#">
                                    Edit
                                </a>
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div className="row">
                            <div className="d-flex">
                                <div>
                                    <img className="rounded" src={workerData.photo} alt="workerData" height={100} width={100} />
                                </div>
                                <div className="mx-4">
                                    <p><i className="bi bi-person mx-1"></i>{workerData.name}</p>
                                    <p><i className="bi bi-telephone mx-1"></i>{workerData.phone}</p>
                                    <p className="mx-1">Rating:
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <i key={i} className={`bi bi-star-fill ${i < workerData.rating ? "text-warning" : "text-muted"} mx-1`}></i>
                                        ))}
                                        {workerData.rating}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="row">
                            <div className="d-flex">
                                <i className="bi bi-geo-alt mx-1"></i>
                                <p>{workerData.address}</p>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="row">
                            <div className="col-5">
                                <p>Joining Date</p>
                                <p>Aadhar Number</p>
                                <p>Language</p>
                                <p>Total Service</p>
                            </div>
                            <div className="col-7">
                                <p>: {workerData.joiningDate}</p>
                                <p>: **** **** {workerData.aadhar.slice(-4)}</p>
                                <p>: {workerData.languages.join(", ")}</p>
                                <p>: {workerData.totalServices}</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-7 mt-4 border px-3 rounded">
                        {/* Header Section with Active Border */}
                        <div className="row">
                            <div className="d-flex mt-3 pb-2">
                                <p
                                    className={`px-4 pb-2 ${activeTab === "serviceDetails" ? "border-bottom border-3 border-dark" : ""}`}
                                    onClick={() => setActiveTab("serviceDetails")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Service Details
                                </p>
                                <p
                                    className={`mx-5 px-4 pb-2 ${activeTab === "inProgress" ? "border-bottom border-3 border-dark" : ""}`}
                                    onClick={() => setActiveTab("inProgress")}
                                    style={{ cursor: "pointer" }}
                                >
                                    In Progress
                                </p>
                                <p
                                    className={`px-4 pb-2 ${activeTab === "reviews" ? "border-bottom border-3 border-dark" : ""}`}
                                    onClick={() => setActiveTab("reviews")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Reviews
                                </p>
                            </div>
                        </div>

                        {/* Dynamic Content Section */}
                        <div className="row pb-3">
                            <div className="table-responsive" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                {activeTab === "serviceDetails" && (
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light border" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                            <tr>
                                                <th>S.no</th>
                                                <th>Service</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th>Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceDetailsData.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {item.service} <br />
                                                        <span style={{ color: "#0076CE" }}>ID: {item.id}</span>
                                                    </td>
                                                    <td>{item.name} <br /> {item.phone}</td>
                                                    <td>{item.date} <br /> {item.status}</td>
                                                    <td>
                                                        <i className="bi bi-star-fill text-warning"></i> {item.rating}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {activeTab === "inProgress" && (
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light border" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                                            <tr>
                                                <th>S.no</th>
                                                <th>Service</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inProgressData.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.service}<br />
                                                        <span style={{ color: "#0076CE" }}>ID: {item.id}</span>
                                                    </td>
                                                    <td>{item.name}<br /> {item.phone}</td>
                                                    <td>{item.date} <br /> Service pending</td>
                                                    <td>
                                                        <span className={`badge ${item.status === "STARTED" ? "bg-warning" :
                                                            item.status === "RESCHEDULED" ? "bg-danger" :
                                                                item.status === "ASSIGNED" ? "bg-secondary" : "bg-success"}`}>
                                                            {item.status}
                                                        </span>

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="d-flex flex-wrap">
                                        <h1 className="text-center w-100">No reviews yet</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Worker;