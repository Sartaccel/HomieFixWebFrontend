import Header from "./Header";
import { useState } from "react";
import profile from "../assets/addWorker.jpg";
import '../styles/Services.css';
import { useNavigate } from "react-router-dom";


const Services = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  const services = [
    { id: 1, name: "Ac", price: "100", ratings: "4.5", bookings: "10", pic: profile },
    { id: 2, name: "Geyser", price: "100", ratings: "4", bookings: "5", pic: profile },
    { id: 3, name: "Microwave", price: "100", ratings: "3.5", bookings: "7", pic: profile },
    { id: 4, name: "Refrigerator", price: "100", ratings: "4.2", bookings: "8", pic: profile },
    { id: 5, name: "Washing Machine", price: "100", ratings: "4.8", bookings: "9", pic: profile },
    { id: 6, name: "TV", price: "100", ratings: "4.3", bookings: "6", pic: profile },

  ];

  return (
    <>
      <Header />

      <div className="container-fluid p-0 pt-5 scrollable-container " style={{ overflowX: "hidden" }}>

        {/* Tabs for Home Appliances */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Home appliances
            </button>
          </div>
        </div>

        {/* Scrollable content */}

        <div className="row px-4" >
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }} />
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for Electrician */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Electrician
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }} />
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for Carpentry */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2 ">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Carpentry
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}/>
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for Plumbing */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2 ">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Plumbing
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}/>
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for Vehicle Service */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2 ">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Vehicle Service
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}/>
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for Care Taker */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2 ">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Care Taker
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}/>
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for CCTV */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2 ">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              CCTV
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}/>
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs for Cleaning */}
        <div className="d-flex justify-content-between border-bottom mt-5 mb-2 ">
          <div className="d-flex gap-4 mx-4">
            <button
              className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Cleaning
            </button>
          </div>
        </div>

        <div className="row px-4">
          {services.map((service) => (
            <div className="col-4" key={service.id}>
              <div className="card mt-1 mb-3" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: "pointer" }}>
                <div className="card-body d-flex">
                  <div>
                    <img src={service.pic} alt={service.name} style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}/>
                  </div>
                  <div className="ms-3">
                    <p className="card-text">{service.name} - ₹ {service.price}</p>
                    <p className="card-text">
                      <span style={{ backgroundColor: "#EDF3F7" }}>
                        <span className="bi bi-star-fill text-warning"></span> {service.ratings}
                      </span>
                      <span className="mx-2"> bookings: {service.bookings}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default Services;
