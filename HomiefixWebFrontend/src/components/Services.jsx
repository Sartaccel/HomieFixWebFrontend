import Header from "./Header";
import { useState, useEffect } from "react";
import profile from "../assets/addWorker.jpg";
import "../styles/Services.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Services = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const navigate = useNavigate();

  // Group products by category
  const productCategories = {
    "Home Appliances": [
      "AC",
      "Geyser",
      "Microwave",
      "Inverter & Stabilizers",
      "Water Purifier",
      "TV",
      "Fridge",
      "Washing Machine",
      "Fan",
    ],
    Electrician: [
      "Switch & Socket",
      "Wiring",
      "Doorbell",
      "MCB & Submeter",
      "Light and Wall light",
    ],
    Carpentry: [
      "Bed",
      "Cupboard & Drawer",
      "Door",
      "Window",
      "Drill & Hang",
      "Furniture",
    ],
    Plumbing: [
      "WashBasin Installation",
      "Blockage Removal",
      "Shower",
      "Toilet",
      "Tap, Pipe works",
      "Watertank & Motor",
    ],
    "Vehicle Service": [
      "Batteries",
      "Vehicle Checkup",
      "Water Wash",
      "Denting & Painting",
      "Tyre Service",
      "Vehicle AC",
    ],
    "Care Taker": [
      "Child Care",
      "PhysioTherapy",
      "Old Age Care",
      "Companion Support",
      "Home Nursing",
    ],
    Cleaning: ["Cleaning"],
    CCTV: ["CCTV"],
  };


  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/list");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setNetworkError(false);
    try {
      const response = await api.get("/products/booking-counts");
      setProducts(response.data);
      // Fetch categories after products
      await fetchCategories();
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.message === "Network Error") {
        setNetworkError(true);
        setError(
          "No internet connection. Please check your network and try again."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by category
  const getProductsByCategory = (category) => {
    const categoryItems = productCategories[category] || [];
    return products.filter((product) =>
      categoryItems.includes(product.productName)
    );
  };

  // Get category ID by name
  const getCategoryIdByName = (categoryName) => {
    const category = categories.find(cat =>
      cat.name && cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  };


  if (loading) {
    return (
      <>
        <Header />
        <div
          className="container-fluid px-0 pt-5 scrollable-container"
          style={{ overflowX: "hidden" }}
        >
          {Object.keys(productCategories).map((category, index) => (
            <div key={index}>
              <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
                <div className="d-flex gap-4 mx-4">
                  <button className="tab-btn active-tab">{category}</button>
                </div>
              </div>
              <div className="row px-4">
                {[1, 2, 3].map((skeleton, i) => (
                  <div className="col-4" key={i}>
                    <div className="skeleton-card">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div
        className="container-fluid p-0 pt-5 scrollable-container"
        style={{ overflowX: "hidden" }}
      >
        {/* Main Add Category Button at Top Right */}
        <div className="d-flex justify-content-end mb-4 px-4">
          <button
            className="btn"
            onClick={() => navigate("/services/add-category")}
            style={{
              backgroundColor: "#0076CE",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "500",
              marginTop: "50px"
            }}
          >
            Add Category
          </button>
        </div>

        {networkError ? (
          <div
            className="text-center mt-5"
            style={{ width: "60%", margin: "auto" }}
          >
            <div className="alert alert-danger">
              <div className="mb-3">
                <i className="bi bi-wifi-off" style={{ fontSize: "2rem" }}></i>
              </div>
              <p>{error}</p>
              <button
                className="btn btn-primary mt-2"
                onClick={fetchProducts}
                style={{ backgroundColor: "#0076CE", color: "white" }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="text-center mt-5 text-danger">Error: {error}</div>
        ) : (
          /* Render each category section */
          Object.keys(productCategories).map((category) => {
            const categoryProducts = getProductsByCategory(category);

            return (
              <div key={category}>

                {/* Category Tab with Add Service Button */}
                <div className="d-flex justify-content-between align-items-center border-bottom mt-5 mb-2 px-4 " style={{ marginTop: "-50px" }}>
                  <div className="d-flex gap-4">
                    <button
                      className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""
                        }`}
                      onClick={() => setActiveTab("recent")}
                    >
                      {category}
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn"
                      onClick={() => {
                        // First, check if categories are loaded
                        if (categories.length === 0) {
                          alert("Categories are still loading. Please wait a moment and try again.");
                          return;
                        }

                        // Get the category ID
                        const foundCategory = categories.find(cat =>
                          cat.name && cat.name.toLowerCase() === category.toLowerCase()
                        );

                        if (foundCategory && foundCategory.id) {
                          console.log("Navigating to AddService with categoryId:", foundCategory.id);
                          navigate("/services/add-service", {
                            state: {
                              categoryId: foundCategory.id,
                              categoryName: category
                            }
                          });
                        } else {
                          alert(`Category "${category}" not found in database. Please create it first by clicking the "Add Category" button at the top.`);
                        }
                      }}
                      style={{
                        border: "1px solid #0076CE",
                        color: "#0076CE",
                        backgroundColor: "transparent",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}
                    >
                      Add service
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="row px-4">
                  {categoryProducts.length > 0 ? (
                    categoryProducts.map((service) => (
                      <div className="col-4" key={service.productId}>
                        <div
                          className="card mt-1 mb-3"
                          onClick={() =>
                            navigate(`/services/${service.productId}`, {
                              state: { serviceName: service.productName },
                            })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-body d-flex">
                            <div>
                              <img
                                src={service.productImage || profile}
                                alt={service.productName}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  backgroundPosition: "center",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div className="ms-3">
                              <p className="card-text">
                                {service.productName} - ₹ {service.price}
                              </p>
                              <p className="card-text">
                                <span
                                  className="border rounded-2 px-1  text-nowrap d-inline-block"
                                  style={{ backgroundColor: "#EDF3F7" }}
                                >
                                  <span className="bi bi-star-fill text-warning"></span>{" "}
                                  {service.averageRating
                                    ? Number(service.averageRating).toFixed(1)
                                    : "0.0"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center text-muted py-3">
                      No services added yet
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Services;