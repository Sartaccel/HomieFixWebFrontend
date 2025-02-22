import React, { useState } from "react";
import "../styles/ServicePage.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import StarRating from "../components/StarRating";


import Ac from "../assets/Ac.png";
import Inverter from "../assets/Inverter.png";
import Fridge from "../assets/Fridge.png";
import Geyser from "../assets/Geyser.png";
import waterpurifier from "../assets/water purifier.png";
import washingmachine from "../assets/washingmachine.png";
import microwave from "../assets/microwave.png";
import tv from "../assets/TV.png";
import fan from "../assets/Fan.png";






const Services = () => {
  const [activeTab, setActiveTab] = useState("home appliances");
  
  const servicesData = [
   
     { id: 1, name: "Air Conditioning (AC)", price: 500, image: Ac, bookings: 12 },
    { id: 2, name: "Inverter & Stabilizers", price: 500, image: Inverter, bookings: 12 },
    { id: 3, name: "Fridge",                 price: 500, image: Fridge, bookings: 12 },
    {id: 4,  name: "Geyser(water heater)",   price: 500, image: Geyser, bookings: 12},
    {id: 5,  name: "water purifier",         price: 500, image: waterpurifier, bookings: 12},
     {id: 6,  name: "washingmachine",        price: 500, image: washingmachine, bookings: 12},
     {id: 7,  name: "microwave",              price: 500, image: microwave, bookings: 12},
     {id: 8,  name: "TV",                     price: 500, image: tv, bookings: 12},
     {id: 9,  name: "Fan",                     price: 500, image: fan, bookings: 12}
  ];



  return (
    <>
      <div className="container-fluid m-0 p-0 h-100 w-100">
        <div className="row m-0 p-0 h-100">
          {/* Make main scrollable */}
          <main 
            className="col-12 p-0 m-0 d-flex flex-column flex-grow-1" 
            style={{ paddingTop: "100px", overflowY: "auto", height: "100vh" }}
          >
            {/* Header */}
            <header 
              className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" 
              style={{ zIndex: "1000", top: "0" }}
            >
              <h2 className="heading align-items-center mb-0">Services</h2>
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

            {/* Navigation Bar */}
            <div className="navigation-bar d-flex gap-3 py-3 bg-white border-bottom w-100">
              <div className={`section ${activeTab === "home appliances" ? "active" : ""}`} onClick={() => setActiveTab("home appliances")}>
                Home appliances <span className="badge bg-dark ms-1">{servicesData.length}</span>
              
              </div>
            </div>
            <div className="service-list" >
                {servicesData.map((service) => (
                 <div key={service.id} className="service-card">
    
                   
                        <div className="image-container">
                          <img src={service.image} alt={service.name} className="service-image" />
                        </div>
                        <div className="service-details">
                          <div className="service-name">{service.name} - ₹{service.price}</div>
                          <div className="service-meta">
                            <StarRating rating={4.5} />
                            <span className="bookings">Bookings: {service.bookings}</span>
                          </div>
                        </div>
                    </div>
                
               
                  ))}
                 
                  </div>
                 
               </main>
               
        </div>
      </div>
    </>
  );
};

export default Services;
