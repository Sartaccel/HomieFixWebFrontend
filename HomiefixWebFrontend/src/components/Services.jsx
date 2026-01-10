import Header from "./Header";
import { useState, useEffect } from "react";
import profile from "../assets/addWorker.jpg";
import "../styles/Services.css";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Services = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);

  const navigate = useNavigate();

  /*  FETCH CATEGORIES + PRODUCTS */
  const fetchCategoriesWithProducts = async () => {
    setLoading(true);
    setError(null);
    setNetworkError(false);
    try {
      const response = await api.get("/categories/all");
      setCategories(response.data.data || []);
    } catch (err) {
      if (err.message === "Network Error") {
        setNetworkError(true);
        setError("No internet connection. Please check your network.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesWithProducts();
  }, []);


  if (loading) {
    return (
      <>
        <Header />
        <div className="container-fluid px-0 pt-5 scrollable-container">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="d-flex justify-content-between border-bottom mt-5 mb-2">
                <div className="d-flex gap-4 mx-4">
                  <button className="tab-btn active-tab">Loading...</button>
                </div>
              </div>
              <div className="row px-4">
                {[1, 2, 3].map((i) => (
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

  /*  ERROR  */
  if (networkError) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={fetchCategoriesWithProducts}>
            Retry
          </button>
        </div>
      </>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

  const handleDeleteCategory = (categoryId) => {
    toast.info(
      <div>
        <p className="fw-semibold mb-3 text-center">
          Delete this category and all its services?
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              try {
                await api.delete(`/categories/delete/${categoryId}`);
                toast.dismiss();

                toast.success(" Category deleted successfully", {
                  autoClose: 1500,
                });

                fetchCategoriesWithProducts();
              } catch (error) {
                toast.dismiss();
                toast.error("Failed to delete category", {
                  autoClose: 2000,
                });
              }
            }}
          >
            Delete
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        className: "confirm-toast",
        icon: false,
        closeOnClick: false,
        draggable: false,
        onOpen: () => document.body.classList.add("toast-dim"),
        onClose: () => document.body.classList.remove("toast-dim"),
      }
    );
  };



  /* UI (UNCHANGED STRUCTURE) */
  return (
    <>
      <Header />

      <div className="container-fluid p-0 pt-5 scrollable-container">
        {/* Add Category Button */}
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
              marginTop: "50px",
            }}
          >
            Add Category
          </button>
        </div>

        {/*  DYNAMIC CATEGORIES  */}
        {categories.map((category) => (
          <div key={category.category_id}>
            {/* Category Header */}
            <div
              className="d-flex justify-content-between align-items-center border-bottom mt-5 mb-2 px-4"
              style={{ marginTop: "-50px" }}
            >
              <div className="d-flex gap-4">
                <button
                  className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""
                    }`}
                  onClick={() => setActiveTab("recent")}
                >
                  {category.category_name}
                </button>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate("/services/edit-category", {
                      state: {
                        categoryId: category.category_id,
                        categoryName: category.category_name,
                        categoryImage: category.category_image,
                      },
                    })
                  }
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Edit Category
                </button>

                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteCategory(category.category_id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Delete Category
                </button>

                <button
                  className="btn action-outline-btn"
                  onClick={() =>
                    navigate("/services/add-service", {
                      state: {
                        categoryId: category.category_id,
                        categoryName: category.category_name,
                      },
                    })
                  }
                  style={{
                    border: "1px solid #0076CE",
                    color: "#0076CE",
                    backgroundColor: "transparent",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Add Service
                </button>

              </div>

            </div>

            {/* Products Grid */}
            <div className="row px-4">
              {category.products && category.products.length > 0 ? (
                category.products.map((service) => (
                  <div className="col-4" key={service.product_id}>
                    <div
                      className="card mt-1 mb-3"
                      onClick={() =>
                        navigate(`/services/${service.product_id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-body d-flex">
                        <img
                          src={service.product_image || profile}
                          alt={service.product_name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="ms-3">
                          <p className="card-text">
                            {service.product_name} - ₹ {service.price}
                          </p>
                          <p className="card-text">
                            <span
                              className="border rounded-2 px-1"
                              style={{ backgroundColor: "#EDF3F7" }}
                            >
                              ⭐ 0.0
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
        ))}
      </div>
      <ToastContainer
        position="top-center"
        closeOnClick={false}
        draggable={false}
      />

    </>
  );
};

export default Services;
