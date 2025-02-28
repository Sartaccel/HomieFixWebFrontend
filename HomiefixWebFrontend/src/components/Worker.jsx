import React, { useState } from "react";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import { useNavigate } from "react-router-dom";
import dop from "../assets/addWorker.png"

const Worker = () => {

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
                    <div className="col-7 mt-4 border" style={{ marginLeft: "-25px" }}>
                        <div className="row">
                            <div className="d-flex mt-3">
                                <p className="border-bottom border-3 border-dark pb-2 px-2">Service Details</p>
                                <p className="mx-5 pb-2 px-2">In Progress</p>
                                <p className="pb-2 px-2">Reviews</p>
                            </div>
                        </div>
                        <div className="row px-3 pb-3">
                            <table>
                                <thead className="">
                                    <tr className="booking-table mt-3 ">
                                        <th className="">S.no</th>
                                        <th>Service</th>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr className="booking-table">
                                        <td >1</td>
                                        <td>Plumber <br /><span style={{ color: "#0076CE" }}>ID: 1</span></td>
                                        <td>John Doe</td>
                                        <td>01-01-2023</td>
                                        <td>4.5</td>
                                    </tr>
                                    <tr className="booking-table">
                                        <td>2</td>
                                        <td>Electrician <br /><span style={{ color: "#0076CE" }}>ID: 2</span></td>
                                        <td>Alen Sam</td>
                                        <td>10-05-2023</td>
                                        <td>4.2</td>
                                    </tr>
                                    <tr className="booking-table">
                                        <td>3</td>
                                        <td>Electrician <br /><span style={{ color: "#0076CE" }}>ID: 3</span></td>
                                        <td>Alen Sam</td>
                                        <td>10-05-2023</td>
                                        <td>4.2</td>
                                    </tr>
                                    <tr className="booking-table">
                                        <td>4</td>
                                        <td>Electrician <br /><span style={{ color: "#0076CE" }}>ID: 4</span></td>
                                        <td>Alen Sam</td>
                                        <td>10-05-2023</td>
                                        <td>4.2</td>
                                    </tr>
                                    <tr className="booking-table">
                                        <td>5</td>
                                        <td>Electrician <br /><span style={{ color: "#0076CE" }}>ID: 5</span></td>
                                        <td>Alen Sam</td>
                                        <td>10-05-2023</td>
                                        <td>4.2</td>
                                    </tr>
                                    <tr className="booking-table">
                                        <td>6</td>
                                        <td>Electrician <br /><span style={{ color: "#0076CE" }}>ID: 6</span></td>
                                        <td>Alen Sam</td>
                                        <td>10-05-2023</td>
                                        <td>4.2</td>
                                    </tr>
                                    <tr className="booking-table">
                                        <td>7</td>
                                        <td>Electrician <br /><span style={{ color: "#0076CE" }}>ID: 7</span></td>
                                        <td>Alen Sam</td>
                                        <td>10-05-2023</td>
                                        <td>4.2</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Worker;
