import React, { useState, useEffect } from "react";
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
    const [showFilter, setShowFilter] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [activeTab, setActiveTab] = useState('service');
    const [workers, setWorkers] = useState([]);
    const [showAddWorker, setShowAddWorker] = useState(false);

    // Fetch worker data from the API
    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch("http://localhost:2222/workers/view");
                const data = await response.json();
                const formattedWorkers = data.map(worker => ({
                    name: worker.name,
                    service: worker.role,
                    contact: worker.contactNumber,
                    rating: worker.averageRating,
                    address: `${worker.town}, ${worker.district}, ${worker.state} - ${worker.pincode}`,
                    joinDate: worker.joiningDate,
                    image: worker.profilePicUrl || alenSamImg, // Fallback to default image if no URL is provided
                    aadhaar: worker.aadharNumber,
                    languages: [], // Add languages if available in the API response
                    totalService: worker.workExperience, // Assuming workExperience represents total services
                }));
                setWorkers(formattedWorkers);
            } catch (error) {
                console.error("Error fetching worker data:", error);
            }
        };

        fetchWorkers();
    }, []);

    return (
        <div>
            {/* Navbar */}
            <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
                <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Worker Details</h2>
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
                {/* Header with Filter and Add Worker Button */}
                <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                    <h4 className="mb-0" style={{ borderBottom: "3px solid #000", paddingBottom: "8px" }}>Worker Details</h4>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" onClick={() => setShowAddWorkerForm(true)}>
                            Add Worker
                        </button>
                        <button className="btn btn-light" onClick={() => setShowFilter(true)}>
                            Filter <i className="bi bi-funnel" />
                        </button>
                    </div>
                </div>

                <div className="container mt-4">
                    {/* Worker Form - Shown when Add Worker is clicked */}
                    {showAddWorker ? (
                        <div className="card p-4">
                            {/* Add Worker Heading */}
                            <h5 className="mb-3 text-center">Add Worker</h5>
                        </div>
                    ) : (
                        // Worker List (Placeholder for Existing Content)
                        <p>Select a worker to view details or click "Add Worker" to add a new one.</p>
                    )}
                </div>

                {/* Worker Table */}
                {!selectedWorker ? (
                    <div style={{ border: '1px solid #ddd', maxHeight: '500px', minHeight: '0', overflow: 'auto' }} className="table-responsive">
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
                                <div className="w-50 p-3">
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
                                                            <tr></tr>
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