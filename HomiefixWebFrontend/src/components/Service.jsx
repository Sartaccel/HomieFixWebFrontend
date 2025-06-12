import Header from "./Header";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profile from "../assets/addWorker.jpg";
import { serviceContent } from "../components/serviceContent";
import api from "../api";
import "../styles/Services.css";

const Service = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await api.get(`/products/view/${productId}`);

        // Transform API data to match your component's expected structure
        const transformedData = {
          id: response.data.id,
          name: response.data.name,
          price: response.data.price,
          ratings: response.data.averageRating 
            ? Number(response.data.averageRating).toFixed(1)
            : "0.0",
          bookings: response.data.bookingCount.toString(),
          pic: response.data.productImage || profile, // Fallback to local image if no productImage
          content: serviceContent[response.data.name] || {
            title: `${response.data.name} Service`,
            sections: [],
          },
        };

        setServiceData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [productId]);

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="container-fluid p-0 pt-5 scrollable-container"
          style={{ overflowX: "hidden" }}
        >
          {/* Skeleton Header */}
          <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
            <div className="d-flex gap-4 mx-4 align-items-center">
              <div
                className="skeleton skeleton-btn"
                style={{ width: "120px", height: "35px" }}
              ></div>
            </div>
          </div>

          {/* Skeleton Card */}
          <div className="row px-4 mx-2">
            <div className="col-4">
              <div className="card mt-1 mb-3" style={{ border: "none" }}>
                <div className="card-body d-flex">
                  <div className="skeleton skeleton-image"></div>
                  <div className="ms-3 w-100">
                    <div
                      className="skeleton skeleton-text mb-2"
                      style={{ width: "70%" }}
                    ></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="row mx-5 bg-light">
            {[1, 2, 3].map((box) => (
              <div key={box} className="col-4 border p-3">
                <div
                  className="skeleton skeleton-text mb-2"
                  style={{ width: "60%" }}
                ></div>
                <ul>
                  {[1, 2, 3].map((item) => (
                    <li
                      key={item}
                      className="skeleton skeleton-text"
                      style={{ width: "80%", marginBottom: "8px" }}
                    ></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!serviceData) {
    return <div></div>;
  }

  return (
    <>
      <Header />
      <div
        className="container-fluid p-0 pt-5 scrollable-container"
        style={{ overflowX: "hidden", overflowY: "hidden" }}
      >
        {/* Service Header */}
        <div className="d-flex justify-content-between border-bottom mt-4">
          <div className="d-flex gap-4 mx-4 align-items-center">
            <button
              className="btn btn-light p-2"
              style={{ marginBottom: "2px" }}
              onClick={() => navigate(-1)}
            >
              <i
                className="bi bi-arrow-left"
                style={{ fontSize: "1.5rem", fontWeight: "bold" }}
              ></i>
            </button>
            <button
              className={`tab-btn ${
                activeTab === "recent" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("recent")}
              style={{padding:"15px"}}
            >
              {serviceData.name}
            </button>
          </div>
        </div>

        {/* Service Info */}
        <div className="row px-4 mx-2">
          <div className="col-4">
            <div className="card mt-1 mb-3" style={{ border: "none" }}>
              <div className="card-body d-flex">
                <div>
                  <img
                    src={serviceData.pic}
                    alt={serviceData.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundPosition: "center",
                    }}
                    onError={(e) => {
                      e.target.src = profile; // Fallback to local image if API image fails to load
                    }}
                  />
                </div>
                <div className="ms-3">
                  <p className="card-text">
                    {serviceData.name}{" "}
                    <span
                      className="mx-2 rounded-2 px-1 py-1"
                      style={{ backgroundColor: "#EDF3F7" }}
                    >
                      <span className="bi bi-star-fill text-warning"></span>{" "}
                      {serviceData.ratings}
                    </span>
                  </p>
                  <p className="card-text "> ₹ {serviceData.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="row mx-5 bg-light">
          {serviceData.content.sections.map((section, index) => (
            <div key={index} className="col-4 border p-3">
              <p>{section.title}</p>
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Service;