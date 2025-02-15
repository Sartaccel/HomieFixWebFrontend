import React, { useState } from "react";
import "../styles/ServicePage.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import StarRating from "../components/StarRating";

import Ac from "../assets/Ac.png";
import Inverter from "../assets/Inverter.png";
import Fridge from "../assets/Fridge.png";

const Services = () => {
  const [activeTab, setActiveTab] = useState("home appliances");
  const [filteredHomeappliances, setFilteredHomeappliances] = useState([]);
  



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
                Home appliances <span className="badge bg-dark ms-1">{filteredHomeappliances.length}</span>
              </div>
            </div>

            <table 
             className="appliances table bg-white rounded align-items-center" 
  
                >
               <tbody>
                <tr>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <div className="image">
               <img src={Ac} alt="Ac" className="Ac-image" />
              </div>
              <div style={{  display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{fontSize:"16px",marginLeft:"2px",marginTop: "-5px"}}>Air Conditioning (AC) - ₹500</div>
            
            
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
                    <StarRating rating={4.5} />
                    <span style={{ fontSize: "14px", color: "#555" }}>Bookings: 12</span>
                  </div>
                </div>
           
           </td>
    </tr>
  </tbody>
</table>

<table 
  className="home table bg-white rounded align-items-center" 
  
>
  <tbody>
    <tr>
         <td style={{ textAlign: "center", verticalAlign: "middle" }}>
            <div className="image">
           <img src={Inverter} alt="Inverter" className="Inverter-image" />
            </div>
            <div style={{  display: "flex", flexDirection: "column", justifyContent: "center" }}>
             <div style={{fontSize:"16px",marginLeft:"2px",marginTop: "-5px"}}>  Inverter && Stabilizers - ₹500</div>
            
            
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
                    <StarRating rating={4.5} />
                    <span style={{ fontSize: "14px", color: "#555" }}>Bookings: 12</span>
                  </div>
                </div>
           
           </td>
    </tr>
  </tbody>
</table>
                   <table className="home table bg-white rounded align-items-center" >
                 <tbody>
                <tr>
                   <td style={{ textAlign: "center", verticalAlign: "middle" }}>
           <div className="image">
           <img src={Fridge} alt="Fridge" className="Fridge-image" />
           </div>
          <div style={{  display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{fontSize:"16px",marginLeft:"2px",marginTop: "-5px"}}>  Fridge - ₹500</div>
            
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
                    <StarRating rating={4.5} />
                    <span style={{ fontSize: "14px", color: "#555" }}>Bookings: 12</span>
                  </div>
                </div>
           
           </td>
    </tr>
  </tbody>
</table>
          </main>
        </div>
      </div>
    </>
  );
};

export default Services;
