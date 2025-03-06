import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { FaUser, FaPhone, FaMapMarkerAlt, FaStar } from "react-icons/fa";


const FilterModal = ({ show, handleClose }) => {
  return (
    <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>
        <div className="modal-body">
          {/* Scrollable Row */}
          <div className="d-flex flex-nowrap gap-3 overflow-auto">
            {[
              {
                title: "Home appliances",
                items: [
                  "AC", "Geyser (water heater)", "Microwave", "Inverter & Stabilizers",
                  "Water purifier", "TV", "Fridge", "Washing machine", "Fan"
                ]
              },
              {
                title: "Electrician",
                items: ["Switch & Socket", "Wiring", "Doorbell", "Appliance", "MCB", "Light"]
              },
              {
                title: "Carpentry",
                items: ["Bed", "Cupboard & drawer", "Door", "Windows", "Drill & hang", "Furniture repair"]
              },
              {
                title: "Plumbing",
                items: ["Wash basin Installation", "Blockage removal", "Shower", "Toilet", "Tap, pipe", "Water tank and motor"]
              },
              {
                title: "Vehicle service",
                items: ["Batteries", "Health checkup", "Denting & painting", "Wash", "Wheel car", "Vehicle AC", "Cleaning"]
              },
              {
                title: "CCTV",
                items: ["CCTV"]
              },
              
             
            ].map((category, index) => (
              <div key={index} className="card p-2" style={{ minWidth: "200px" }}>
                <h6>{category.title}</h6>
                {category.items.map(item => (
                  <div key={item}>
                    <input type="checkbox" id={item} /> <label htmlFor={item}>{item}</label>
                  </div>
                ))}
              </div>
            ))}
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
      Date: 'Jan 25, 2025',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000107',
      image: alenSamImg
      

    },
    {
      name: 'John Doe',
      service: 'Architect',
      contact: '9887654321',
      rating: 5,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Beverly Hills, California, USA 90210',
      Date: 'Mar 15, 2023',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Emma Smith',
      service: 'teacher',
      contact: '9234567890',
      rating: 4.5,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Londan Uk',
      Date: 'Aug 10, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Carlos Gonzalez',
      service: 'Software Engineer',
      contact: '9556677889',
      rating: 4,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Madrid, Spain',
      Date: 'Nov 5, 2023',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Anna Patel',
      service: 'Doctor',
      contact: '9442221111',
      rating: 4.8,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Mumbai, India',
      Date: 'Feb 20, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Liam Wilson',
      service: 'Graphic Designer',
      contact: '9334455667',
      rating: 4.2,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'New York City, USA 10001',
      Date: 'Jun 30, 2023',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Sophie Brown',
      service: 'Chef',
      contact: '9778889990',
      rating: 4.7,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Paris, France',
      Date: 'Sep 12, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Sophie Brown',
      service: 'Chef',
      contact: '9778889990',
      rating: 4.7,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Paris, France',
      Date: 'Sep 12, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Sophie Brown',
      service: 'Chef',
      contact: '9778889990',
      rating: 4.7,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Paris, France',
      Date: 'Sep 12, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Sophie Brown',
      service: 'Chef',
      contact: '9778889990',
      rating: 4.7,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Paris, France',
      Date: 'Sep 12, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    },
    {
      name: 'Sophie Brown',
      service: 'Chef',
      contact: '9778889990',
      rating: 4.7,
      address: '23 Ocean View Drive, Jambulingam Coral Bay, Kerala, India 695582',
      aadhaar: '**** **** 4567',
      languages: ['Tamil', 'Malayalam', 'English'],
      totalService: 30,
      address: 'Paris, France',
      Date: 'Sep 12, 2024',
      Datestatus:'completed',
      Dateprogress:'Servive pending',
      ID:'SER000127',
      image: alenSamImg
    }
    
  ];

  const [showAddWorker, setShowAddWorker] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      {/* ✅ Navbar */}
      <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
        <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>WorkerDetails</h2>
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
        <div
  className={`d-flex justify-content-between align-items-center mb-3 mt-5 ${
    selectedWorker ? "border-bottom" : ""
  }`}
>
  <h4
    className="mb-0 pb-2 text-black"
    onClick={() => setSelectedWorker(null)}
    style={{
      borderBottom: "3px solid #000", // Always black underline
      cursor: "pointer",
    }}
  >
    {selectedWorker && "←"} Worker Details
  </h4>

  {!selectedWorker && (
    <div className="d-flex gap-2">
      {!showAddWorker && (
        <button
          className="btn text-light"
          onClick={() => navigate("/add-worker")}
          style={{ backgroundColor: "#0076CE" }}
        >
          Add Worker
        </button>
      )}
      <button className="btn btn-light" onClick={() => setShowFilter(true)}>
        Filter <i className="bi bi-funnel" />
      </button>
    </div>
  )}
</div>



        <div className="container mt-4">


          {/* Worker Form - Shown when Add Worker is clicked */}
          
        </div>

       {/* Worker Table */}

       {!selectedWorker ? (
          <div style={{ overflow: 'hidden', padding: '10px 15px' }}>
            <div style={{ maxHeight: '75vh', overflowY: 'auto', border: '1px solid #dee2e6' }}>
              <table className="table table-hover" style={{ width: '100%', marginBottom: '0', tableLayout: 'fixed' }}>
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                  <tr>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Name</th>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Service</th>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Contact</th>
                    <th style={{ width: '10%', padding: '12px', verticalAlign: 'middle' }}>Rating</th>
                    <th style={{ width: '30%', padding: '12px', verticalAlign: 'middle' }}>Address</th>
                    <th style={{ width: '15%', padding: '12px', verticalAlign: 'middle' }}>Joining Date</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker, index) => (
                    <tr key={index} onClick={() => setSelectedWorker(worker)} style={{ cursor: 'pointer' }}>
                      {/* Name Column */}
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={worker.profilePicUrl || alenSamImg}
                            alt={worker.name}
                            className="square-circle me-2"
                            width="40"
                            height="40"
                          />
                          {worker.name}
                        </div>
                      </td>
                      {/* Service Column */}
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>{worker.service}</td>
                      {/* Contact Column */}
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>{worker.contact}</td>
                      {/* Rating Column */}
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {worker.rating || "N/A"}
                      </td>
                      {/* Address Column */}
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        {`${worker.address}`}
                      </td>
                      {/* Joining Date Column */}
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>{worker.Date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        ) : (


          // Worker Details Section

          <div className="row col-12 d-flex justify-content-between ">

            
              {/* <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={() => setSelectedWorker(null)}
              >
                ← Back
              </button> */}



              {/* Layout with Flexbox */}
              
                
              <div className="container">
      <div className="row">
        {/* Worker Profile Card */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            {/* Role and Edit Section */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <h6 className="mb-0 me-2">Role:</h6>
                <button className="btn btn-outline-dark rounded-pill me-1" style={{ fontSize: "13px" }}>
                  Plumber
                </button>
                <button className="btn btn-outline-dark rounded-pill" style={{ fontSize: "13px" }}>
                  Electrician
                </button>
              </div>
              <a href="#" className="text-primary fw-bold small">Edit</a>
            </div>

            {/* Profile Info */}
            <div className="d-flex align-items-center">
              <img
                src={selectedWorker.image}
                alt={selectedWorker.name}
                className="square-circle me-3"
                width="70"
                height="70"
              />
              <div>
                <h6 className="mb-1">
                  <FaUser className="me-1" /> {selectedWorker.name}
                </h6>
                <small>
                  <FaPhone className="me-1" /> {selectedWorker.contact}
                </small>
                <div className="d-flex align-items-center mt-1">
                  <span className="me-1">Rating:</span>
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} className="text-warning small-icon" />
                  ))}
                  <FaStar className="text-secondary small-icon" />
                  <small className="ms-1">{selectedWorker.rating}</small>
                </div>
              </div>
            </div>

            {/* Address */}
            <small className="text-muted d-block mt-2">
              <FaMapMarkerAlt className="me-1" />
              {selectedWorker.address}
            </small>

            {/* Worker Info */}
            <div className="mt-3">
              <small className="text-muted d-block">Joining Date: <strong>{selectedWorker.joinDate}</strong></small>
              <small className="text-muted d-block">Aadhaar: <strong>**** **** {selectedWorker.aadhaar.slice(-4)}</strong></small>
              <small className="text-muted d-block">Language: <strong>{selectedWorker.languages.join(', ')}</strong></small>
              <small className="text-muted d-block">Total Service: <strong>{selectedWorker.totalService}</strong></small>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="col-md-8">
          <div className="card p-3">
            {/* Tabs */}
            <div className="d-flex">
              {["service", "inProgress", "reviews"].map((tab) => (
                <div
                  key={tab}
                  className={`me-2 px-4 py-2 ${activeTab === tab ? "btn-primary " : "btn-light"}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ cursor: "pointer", borderBottom: activeTab === tab ? "3px solid black" : "none" }}
                >
                  {tab === "service" && "Service Details"}
                  {tab === "inProgress" && "In Progress"}
                  {tab === "reviews" && "Reviews"}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="mt-3" style={{ overflow: 'hidden', padding: '10px 15px' }} >
            {activeTab === "service" && (
  <div style={{ maxHeight: '67vh', overflowY: 'auto', border: '1px solid #dee2e6', paddingBottom: '20px' }}>
    <table className="table table-hover" style={{ width: '100%', marginBottom: '0', tableLayout: 'fixed' }}>
      <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
        <tr>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>S.no</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Service</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Name</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Date</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Rating</th>
        </tr>
      </thead>
      <tbody >
        {workers.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              {item.service}
              <div className="text-primary">ID: {item.ID}</div>
            </td>
            <td>
              {item.name}
              <div className="text-muted">{item.contact}</div>
              {item.phone}
            </td>
            <td>
              {item.Date}
              <div className="text-muted">{item.Datestatus}</div>
            </td>
            <td>
              <FaStar color="gold" /> {item.rating}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{activeTab === "inProgress" && (
  <div style={{ maxHeight: '67vh', overflowY: 'auto', border: '1px solid #dee2e6', paddingBottom: '20px' }}>
    <table className="table table-hover" style={{ width: '100%', marginBottom: '0', tableLayout: 'fixed' }}>
      <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
        <tr>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>S.no</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Service</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Name</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Date</th>
          <th style={{ position: "sticky", top: 0, background: "#fff" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {workers.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              {item.service}
              <div className="text-primary">ID:{item.ID}</div>
            </td>
            <td>
              {item.name}
              <div className="text-muted">{item.contact}</div>
              {item.phone}
            </td>
            <td>
              {item.Date}
              <div className="text-muted">{item.Dateprogress}</div>
            </td>
            <td>
        {index === 0 && ( // Only show button for the first row (S.No 1)
          <button className="btn btn-success btn-sm">Started</button>
        )}
      </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

              {activeTab === "reviews" && <h5 className="text-center text-muted">Reviews Content Here</h5>}
            </div>

            

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