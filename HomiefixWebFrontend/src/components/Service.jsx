import Header from "./Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/addWorker.jpg";
const Service = () => {


   const [activeTab, setActiveTab] = useState("recent");
   const navigate = useNavigate();


   const services = [
       { id: 1, name: "Ac", price: "100", ratings: "4.5", bookings: "10", pic: profile }
   ];






   return (
       <>
           <Header />
           <div className="container-fluid p-0 pt-5 scrollable-container " style={{ overflowX: "hidden" }}>


               {/* Tabs for Home Appliances */}
               <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
                   <div className="d-flex gap-4 mx-4 align-items-center">
                       <span className="bi bi-arrow-left fs-5" onClick={() => navigate(-1)} style={{ cursor: "pointer" }}></span>
                       <button
                           className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
                           onClick={() => setActiveTab("recent")}
                       >
                           Air Conditioning (AC)
                       </button>
                   </div>
               </div>


               <div className="row px-4 mx-2" >
                   {services.map((service) => (
                       <div className="col-4" key={service.id}>
                           <div className="card mt-1 mb-3" style={{ border: "none" }}>
                               <div className="card-body d-flex">
                                   <div>
                                       <img src={service.pic} alt={service.name} style={{
                                           width: "60px",
                                           height: "60px",
                                           backgroundPosition: "center",
                                       }} />
                                   </div>
                                   <div className="ms-3">
                                       <p className="card-text">{service.name} <span className="mx-2" style={{ backgroundColor: "#EDF3F7" }}>
                                           <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                                       </span></p>
                                       <p className="card-text "> ₹ {service.price}</p>
                                   </div>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>


               <div className="row mx-5 bg-light">
                   <div className="col-4 border p-3">
                       <p>1. Inspection & Diagnostics</p>
                       <ul>
                           <li>Installation of AC</li>
                           <li>Repair of AC</li>
                           <li>Uninstallation of AC</li>
                           <li>Replacement of AC</li>
                       </ul>
                   </div>
                   <div className="col-4 border-top border-bottom p-3">
                       <p>2. Cleaning of Key Components</p>
                       <ul>
                           <li>Filter Cleaning</li>
                           <li>Condenser Cleaning</li>
                           <li>Evaporator Cleaning</li>
                           <li>Compressor Cleaning</li>
                       </ul>
                   </div>
                   <div className="col-4 border p-3">
                       <p>3. Refrigerant Check</p>
                       <ul>
                           <li>Refrigerant Level Check</li>
                           <li>Refrigerant Pressure Check</li>
                           <li>Refrigerant Temperature Check</li>
                           <li>Refrigerant Level Check</li>
                       </ul>
                   </div>


                   <div className="col-4 border p-3">
                       <p>4. Inspection & Diagnostics</p>
                       <ul>
                           <li>Installation of AC</li>
                           <li>Repair of AC</li>
                           <li>Uninstallation of AC</li>
                           <li>Replacement of AC</li>
                       </ul>
                   </div>
                   <div className="col-4 border-top border-bottom p-3">
                       <p>5. Cleaning of Key Components</p>
                       <ul>
                           <li>Filter Cleaning</li>
                           <li>Condenser Cleaning</li>
                           <li>Evaporator Cleaning</li>
                           <li>Compressor Cleaning</li>
                       </ul>
                   </div>
                   <div className="col-4 border p-3">
                       <p>6. Refrigerant Check</p>
                       <ul>
                           <li>Refrigerant Level Check</li>
                           <li>Refrigerant Pressure Check</li>
                           <li>Refrigerant Temperature Check</li>
                           <li>Refrigerant Level Check</li>
                       </ul>
                   </div>
               </div>
           </div>
       </>
   );
}


export default Service;
