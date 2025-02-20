import React, { useState } from "react";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaUsers, FaBell } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Dashboard.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import alenSamImg from "../assets/home1.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const FilterModal = ({ show, handleClose }) => {
    return (
        <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Filter Options</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex flex-wrap gap-3">
                            <div className="card p-2">
                                <h6>Home appliances</h6>
                                {['AC', 'Geyser', 'Microwave', 'Inverter', 'Water purifier', 'TV', 'Fridge', 'Washing machine', 'Fan'].map(item => (
                                    <div key={item}>
                                        <input type="checkbox" id={item} /> <label htmlFor={item}>{item}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="card p-2">
                                <h6>Electrician</h6>
                                {['Switch & Socket', 'Wiring', 'Doorbell', 'Appliance', 'MCB', 'Light'].map(item => (
                                    <div key={item}>
                                        <input type="checkbox" id={item} /> <label htmlFor={item}>{item}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};



const WorkerDetails = () => {


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

    const [showFilter, setShowFilter] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [activeTab, setActiveTab] = useState('service');


    const workers = [
        {
            name: 'Alen Sam',
            service: 'Plumber',
            contact: '9753368997',
            rating: 4,
            address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
            aadhaar: '**** **** 4567',
            languages: ['Tamil', 'Malayalam', 'English'],
            totalService: 30,
            joinDate: 'Jan 25, 2025',
            image: alenSamImg

        },
        {
            name: 'John Doe',
            service: 'Architect',
            contact: '9887654321',
            rating: 5,
            address: 'Beverly Hills, California, USA 90210',
            joinDate: 'Mar 15, 2023',
            image: alenSamImg
        },
        {
            name: 'Emma Smith',
            service: 'teacher',
            contact: '9234567890',
            rating: 4.5,
            address: 'Londan Uk',
            joinDate: 'Aug 10, 2024',
            image: alenSamImg
        },
        {
            name: 'Carlos Gonzalez',
            service: 'Software Engineer',
            contact: '9556677889',
            rating: 4,
            address: 'Madrid, Spain',
            joinDate: 'Nov 5, 2023',
            image: alenSamImg
        },
        {
            name: 'Anna Patel',
            service: 'Doctor',
            contact: '9442221111',
            rating: 4.8,
            address: 'Mumbai, India',
            joinDate: 'Feb 20, 2024',
            image: alenSamImg
        },
        {
            name: 'Liam Wilson',
            service: 'Graphic Designer',
            contact: '9334455667',
            rating: 4.2,
            address: 'New York City, USA 10001',
            joinDate: 'Jun 30, 2023',
            image: alenSamImg
        },
        {
            name: 'Sophie Brown',
            service: 'Chef',
            contact: '9778889990',
            rating: 4.7,
            address: 'Paris, France',
            joinDate: 'Sep 12, 2024',
            image: alenSamImg
        }
    ];

    const [showAddWorker, setShowAddWorker] = useState(false);

    return (
        <div>
            {/* ✅ Navbar */}
            <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
                <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Dashboard</h2>
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
            <div className="container pt-5" style={{ paddingTop: "80px" }}>
                {/* Header with Filter Button */}
                <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                    <h4 className="mb-0">Worker Details</h4>
                    <div className="d-flex gap-2">
                        {!showAddWorker && (
                            <button className="btn btn-primary" onClick={() => setShowAddWorker(true)}>
                                Add Worker
                            </button>
                        )}
                        <button className="btn btn-light" onClick={() => setShowFilter(true)}>
                            Filter <i className="bi bi-funnel" />
                        </button>
                    </div>
                </div>

                <div className="container mt-4">


                    {/* Worker Form - Shown when Add Worker is clicked */}
                    {showAddWorker ? (
                        <div className="card p-4">
                            <button className="btn btn-outline-secondary mb-3" onClick={() => setShowAddWorker(false)}>
                                ← Back
                            </button>

                            {/* Add Worker Heading */}
                            <h5 className="mb-3 text-center">Add Worker</h5>

                            {/* Upload Profile Section BELOW the Heading */}
                            <div className="col-md-12 text-center mb-3">
                                <div className="border p-3 d-inline-block">
                                    <div className="bg-light" style={{ width: "100px", height: "100px", borderRadius: "5px" }}></div>
                                    <button className="btn btn-sm btn-primary mt-2">Upload Profile</button>
                                </div>
                            </div>

                            {/* Worker Form UI */}
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" placeholder="Enter name" />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Email ID</label>
                                    <input type="email" className="form-control" placeholder="Enter email ID" />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Contact Number</label>
                                    <input type="text" className="form-control" placeholder="Enter contact number" />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Emergency Contact Number</label>
                                    <input type="text" className="form-control" placeholder="Enter emergency contact number" />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Work Experience</label>
                                    <input type="text" className="form-control" placeholder="Enter work experience" />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Date of Birth</label>
                                    <input type="date" className="form-control" />
                                </div>

                                {/* Gender */}
                                <div className="col-md-6">
                                    <label className="form-label">Gender</label>
                                    <div className="d-flex gap-3">
                                        <div>
                                            <input type="radio" id="male" name="gender" className="form-check-input" />
                                            <label htmlFor="male" className="ms-1">Male</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="female" name="gender" className="form-check-input" />
                                            <label htmlFor="female" className="ms-1">Female</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="col-12 mt-3">
                                    <button className="btn btn-primary w-100">Submit</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Worker List (Placeholder for Existing Content)
                        <p>Select a worker to view details or click "Add Worker" to add a new one.</p>
                    )}
                </div>

                {/* Worker Table */}
                {!selectedWorker ? (
                    <div style={{ border: '1px solid #ddd', maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table table-hover">
                            <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                <tr>
                                    <th>Name</th>
                                    <th>Service</th>
                                    <th>Contact</th>
                                    <th>Rating</th>
                                    <th>Address</th>
                                    <th>Joining Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map((worker, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => setSelectedWorker(worker)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>
                                            <img
                                                src={worker.image}
                                                alt={worker.name}
                                                className="square-circle me-2"
                                                width="40"
                                                height="40"
                                            />
                                            {worker.name}
                                        </td>
                                        <td>{worker.service}</td>
                                        <td>{worker.contact}</td>
                                        <td>
                                            <i className="bi bi-star-fill text-warning me-1"></i>{worker.rating}
                                        </td>
                                        <td>{worker.address}</td>
                                        <td>{worker.joinDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Worker Details Section
                    <div className="card mt-4">
                        <div className="card-body">
                            <button
                                className="btn btn-sm btn-outline-secondary mb-2"
                                onClick={() => setSelectedWorker(null)}
                            >
                                ← Back
                            </button>

                            {/* Layout with Flexbox */}
                            <div className="d-flex">
                                {/* Left: Worker Profile */}
                                <div className="w-50 pe-3">
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={selectedWorker.image}
                                            alt={selectedWorker.name}
                                            className="square-circle me-3"
                                            width="100"
                                            height="100"
                                        />
                                        <div>
                                            <h5>{selectedWorker.name}</h5>
                                            <p><strong>Role:</strong> {selectedWorker.service}</p>
                                            <p><strong>Contact:</strong> {selectedWorker.contact}</p>
                                            <p><strong>Address:</strong> {selectedWorker.address}</p>
                                            {selectedWorker.languages && (
                                                <p><strong>Languages:</strong> {selectedWorker.languages.join(', ')}</p>
                                            )}
                                            {selectedWorker.totalService && (
                                                <p><strong>Total Services:</strong> {selectedWorker.totalService}</p>
                                            )}
                                            <p><strong>Joining Date:</strong> {selectedWorker.joinDate}</p>
                                            {selectedWorker.aadhaar && (
                                                <p><strong>Aadhaar Number:</strong> {selectedWorker.aadhaar}</p>
                                            )}
                                            <p>
                                                <strong>Rating:</strong>
                                                <i className="bi bi-star-fill text-warning mx-1"></i>
                                                {selectedWorker.rating}
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {/* Right: Tabs Section */}
                                <div className="w-50  p-3">
                                    {/* Section Tabs */}
                                    <div className="d-flex border-bottom mb-3">
                                        <button
                                            className={`btn ${activeTab === 'service' ? 'btn-primary' : 'btn-light'} me-2`}
                                            onClick={() => setActiveTab('service')}
                                        >
                                            Service Details
                                        </button>
                                        <button
                                            className={`btn ${activeTab === 'inProgress' ? 'btn-primary' : 'btn-light'} me-2`}
                                            onClick={() => setActiveTab('inProgress')}
                                        >
                                            In Progress
                                        </button>
                                        <button
                                            className={`btn ${activeTab === 'reviews' ? 'btn-primary' : 'btn-light'}`}
                                            onClick={() => setActiveTab('reviews')}
                                        >
                                            Reviews
                                        </button>
                                    </div>

                                    {/* Section Content */}
                                    <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                                        {/* Service Tab: Table + Details */}
                                        {activeTab === 'service' && (
                                            <div>

                                                <table className="table table-bordered">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Service</th>
                                                            <th>Name</th>
                                                            <th>Date</th>
                                                            <th>Rating</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedWorker.services?.length > 0 ? (
                                                            selectedWorker.services.map((service, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{service}</td>
                                                                    <td>{selectedWorker.name}</td>
                                                                    <td>
                                                                        <i className="bi bi-star-fill text-warning me-1"></i>
                                                                        {selectedWorker.rating}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>

                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>


                                            </div>
                                        )}

                                        {/* In Progress Tab */}
                                        {activeTab === 'inProgress' && (
                                            <div>

                                                {selectedWorker.inProgress?.length > 0 ? (
                                                    selectedWorker.inProgress.map((task, idx) => (
                                                        <li key={idx}>{task}</li>
                                                    ))
                                                ) : (
                                                    <table className="table table-bordered">
                                                        <thead className='table-light'>
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Service</th>
                                                                <th>Name</th>
                                                                <th>Date</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                )}

                                            </div>
                                        )}


                                        {/* Reviews Tab */}
                                        {activeTab === 'reviews' && (
                                            <ul>
                                                {selectedWorker.reviews?.length > 0 ? (
                                                    selectedWorker.reviews.map((review, idx) => (
                                                        <li key={idx}>{review}</li>
                                                    ))
                                                ) : (
                                                    <p>No reviews available.</p>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
                {/* Filter Modal */}
                <FilterModal show={showFilter} handleClose={() => setShowFilter(false)} />
            </div>

        </div>

    );

};

export default WorkerDetails;