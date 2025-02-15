import React from "react";
import "../styles/ServicePage.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
const ServiceDetail = () => {
 
  return (
   <div className="container-fluid m-0 p-0 vh-100 w-100">
         <div className="row m-0 p-0 vh-100">
           <main className="col-12 p-0 m-0 d-flex flex-column">
             <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100">
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
             
           
          </main>
          </div>
          </div>
  )
}
export default ServiceDetail;