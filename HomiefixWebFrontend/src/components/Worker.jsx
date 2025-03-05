import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";

import Swal from "sweetalert2";

const Worker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("serviceDetails");

    // State for worker data
    const [workerData, setWorkerData] = useState(null);

    // State for bookings
    const [serviceDetailsData, setServiceDetailsData] = useState([]);
    const [inProgressData, setInProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch worker data
    useEffect(() => {
        axios.get(`http://localhost:2222/workers/view/${id}`)
            .then(response => {
                setWorkerData(response.data);
            })
            .catch(error => {
                console.error("Error fetching worker data:", error);
            });
    }, [id]);

    // Fetch worker bookings
    useEffect(() => {
        if (!workerData) return; // Ensure workerData is available

        const fetchWorkerBookings = async () => {
            try {
                const response = await fetch(`http://localhost:2222/booking/worker/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

                // Filter data based on booking status
                const completedBookings = data.filter(booking => booking.bookingStatus === "COMPLETED");
                const inProgressBookings = data.filter(booking =>
                    booking.bookingStatus === "ASSIGNED" ||
                    booking.bookingStatus === "STARTED" ||
                    booking.bookingStatus === "RESCHEDULED"
                );

                // Map backend data to frontend format
                const mappedCompletedBookings = completedBookings.map(booking => ({
                    id: booking.id,
                    service: booking.worker?.role || "N/A",
                    name: booking.worker?.name || "N/A",
                    phone: booking.worker?.contactNumber || "N/A",
                    date: booking.bookedDate,
                    rating: booking.worker?.averageRating || 0,
                    status: booking.bookingStatus
                }));

                const mappedInProgressBookings = inProgressBookings.map(booking => ({
                    id: booking.id,
                    service: booking.worker?.role || "N/A",
                    name: booking.worker?.name || "N/A",
                    phone: booking.worker?.contactNumber || "N/A",
                    date: booking.bookedDate,
                    status: booking.bookingStatus
                }));

                // Update state
                setServiceDetailsData(mappedCompletedBookings);
                setInProgressData(mappedInProgressBookings);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching worker bookings:", error);
                setLoading(false);
            }
        };

        fetchWorkerBookings();
    }, [id, workerData]); // Add workerData as a dependency

    const handleDeleteWorker = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:2222/workers/${id}`);
                    Swal.fire("Deleted!", "Worker has been removed.", "success");
                    navigate(-1);
                } catch (error) {
                    Swal.fire("Error!", "Failed to delete worker.", "error");
                }
            }
        });
    };

    if (!workerData || loading) {
        return <p>Loading...</p>;
    }

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
                    <button className="btn d-flex align-items-center" onClick={() => navigate( `/worker-details`)}>
                        <span style={{ fontSize: "20px" }}>←</span>
                        <h5 className="px-3 pb-2 text-black mx-5"
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
                    <div className="col-4 border p-3 mt-4 rounded align-self-start h-auto d-flex flex-column" style={{ marginLeft: "70px", marginRight: "10px" }}>
                        {/* Role Section */}
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-wrap">
                                <p>Role:</p>
                                {workerData.role.split(',').map((role, index) => (
                                    <p key={index} className="border border-dark rounded-pill mx-1 px-2 ">
                                        {role.trim()}
                                    </p>
                                ))}
                            </div>
                            <div>
                                <a className="text-decoration-none" style={{ color: "#0076CE" }} href={`/worker-details/worker/edit/${id}`}>Edit</a>
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div className="row">
                            <div className="d-flex">
                                <div>
                                    <img className="rounded" src={workerData.profilePicUrl} alt="workerData" height={100} width={100} />
                                </div>
                                <div className="mx-4">
                                    <p><i className="bi bi-person mx-1"></i>{workerData.name}</p>
                                    <p><i className="bi bi-telephone mx-1"></i>{workerData.contactNumber}</p>
                                    <p className="mx-1">Rating:
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <i key={i} className={`bi bi-star-fill ${i < (workerData.averageRating || 0) ? "text-warning" : "text-secondary"} mx-1`}></i>
                                        ))}
                                        {workerData.averageRating || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="row">
                            <div className="d-flex">
                                <i className="bi bi-geo-alt mx-1"></i>
                                <p>{workerData.houseNumber}, {workerData.town}, {workerData.district}, {workerData.state} - {workerData.pincode}</p>
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
                                <p>: **** **** {workerData.aadharNumber?.slice(-4)}</p>
                                <p>: {workerData.language}</p>
                                <p>: {workerData.totalWorkAssigned}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table content */}
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
                                    className={`mx-1 px-4 pb-2 ${activeTab === "inProgress" ? "border-bottom border-3 border-dark" : ""}`}
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

                                <p
                                    className="border border-danger rounded px-2" style={{ marginLeft: "100px", paddingTop: "3px", cursor: "pointer" }} onClick={handleDeleteWorker}>
                                    <i className="bi bi-trash text-danger mx-1"></i>
                                    Remove worker
                                </p>
                            </div>
                        </div>

                        {/* Dynamic Content Section */}
                        <div className="row">
                            <div className="table-responsive custom-table" style={{ maxHeight: "550px" }}>
                                {activeTab === "serviceDetails" && (
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 3, backgroundColor: 'white', borderBottom: '1px solid #dee2e6', boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.1)' }}>
                                            <tr className="border">
                                                <th>S.no</th>
                                                <th>Service</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th>Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ maxHeight: "500px", overflowY: "auto", display: "table-row-group", backgroundColor: 'white' }}>
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
                                        <thead className="table-light border" style={{ position: "sticky", top: 0, zIndex: 3, backgroundColor: 'white', borderBottom: '1px solid #dee2e6', boxShadow: '0 0px 2px 1px rgba(0, 0, 0, 0.1)' }}>
                                            <tr>
                                                <th>S.no</th>
                                                <th>Service</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ maxHeight: "500px", overflowY: "auto", display: "table-row-group", backgroundColor: 'white' }}>
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