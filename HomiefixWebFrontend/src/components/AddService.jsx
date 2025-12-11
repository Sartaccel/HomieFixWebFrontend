import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import addWorker from "../assets/addWorker.jpg";
import "../styles/Services.css";
import api from "../api";

const AddService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get category ID and name from navigation state
  const { categoryId, categoryName } = location.state || {};

  const [formData, setFormData] = useState({
    servicePhoto: null,
    serviceName: "",
    price: "",
    serviceDescription: ["", "", ""],
  });
  const [previewImage, setPreviewImage] = useState(addWorker);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.serviceDescription];
    newDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      serviceDescription: newDescriptions
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG images are allowed");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("File size should be less than 1MB");
      return;
    }

    setFormData(prev => ({ ...prev, servicePhoto: file }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!categoryId) {
        alert("Category ID is missing. Please go back and try again.");
        setLoading(false);
        return;
      }

      if (!formData.serviceName.trim()) {
        alert("Service name is required");
        setLoading(false);
        return;
      }

      if (!formData.price) {
        alert("Price is required");
        setLoading(false);
        return;
      }

      // Create FormData for the product
      const productData = new FormData();
      productData.append("name", formData.serviceName);
      productData.append("price", parseFloat(formData.price));
      productData.append("categoryId", categoryId); // Use the categoryId from state
      
      // Append the description as a single string
      const descriptionString = formData.serviceDescription
        .filter(desc => desc.trim() !== "")
        .join(" || ");
      
      if (descriptionString) {
        productData.append("description", descriptionString);
      }
      
      // Append image if available
      if (formData.servicePhoto) {
        productData.append("image", formData.servicePhoto);
      }

      // Make API call to save the product
      const response = await api.post("/products/add", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Service added successfully:", response.data);
        alert("Service added successfully!");
        navigate("/services");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        {/* Sidebar */}
        <div className="col-auto p-0 m-0">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <main className="col p-0 m-0 d-flex flex-column">
          <Header />
          
          {/* Navigation Bar */}
          <div className="navigation d-flex align-items-center py-2 px-4 bg-white border-bottom w-100 ">
            <div className="d-flex gap-2 align-items-center w-100">
              <button
                className="btn btn-light p-0"
                style={{ height: "30px", width: "30px" }}
                onClick={() => navigate("/services")}
              >
                <i
                  className="bi bi-arrow-left"
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                ></i>
              </button>
              <h5 className="mb-0 ms-3">Add Service to {categoryName || "Category"}</h5>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-grow-1 p-4 form-section"  style={{ marginTop:"120px" }}>
  <form onSubmit={handleSubmit}>
    {/* Add Service Section */}

    {/* Service Photo */}
    <div className="mb-4">
      <label className="form-label fw-semibold">Service photo</label>
      <div className="d-flex align-items-center gap-4">
        <div className="position-relative">
          <img
            src={previewImage}
            alt="Service"
            className="rounded"
            style={{ 
              width: "100px", 
              height: "100px", 
              objectFit: "cover",
            }}
          />
        </div>
        <div>
          <input
            type="file"
            id="servicePhoto"
            className="d-none"
            onChange={handleImageUpload}
            accept="image/jpeg, image/png"
          />
          <label
            htmlFor="servicePhoto"
            className="btn"
            style={{ 
              border: "1px solid #0076CE", 
              color: "#0076CE",
              backgroundColor: "transparent",
              marginTop:"50px"
            }}
          >
            Upload photo
          </label>
        </div>
      </div>
    </div>

    {/* Category, Service and Price in same row */}
    <div className="row mb-4">
      <div className="col-md-4">
        <label className="form-label fw-semibold">Category Name</label>
        <input
          type="text"
          className="form-control"
          value={categoryName || "Category not selected"}
          readOnly
          style={{ 
            height: "45px",
            backgroundColor: "#f8f9fa",
            cursor: "not-allowed"
          }}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label fw-semibold">Enter your service</label>
        <input
          type="text"
          className="form-control"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          placeholder="Enter your service"
          style={{ height: "45px" }}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label fw-semibold">Enter Price</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Eg: 1000"
          style={{ height: "45px" }}
          required
          min="0"
          step="0.01"
        />
      </div>
    </div>

    {/* Please list what we do */}
  <div className="mb-4">
  <label className="form-label fw-semibold">Please list what we do:</label>
  <div className="border rounded p-3" style={{ width: "460px" }}>
    {formData.serviceDescription.map((description, index) => (
      <div key={index} className="d-flex align-items-start mb-3">
        <span className="me-2 mt-1">•</span>
        <textarea
          className="form-control border-0 bg-transparent p-2"
          value={description}
          onChange={(e) => handleDescriptionChange(index, e.target.value)}
          placeholder="We begin by conducting a detailed inspection of your AC unit, checking for any issues."
          style={{ 
            fontSize: "14px", 
            boxShadow: "none",
            resize: "none",
            minHeight: "40px",
            overflow: "visible",
            lineHeight: "1.2",
            width: "100%"
          }}
          rows={2}
          wrap="soft"
          onInput={(e) => {
            // Auto-resize height based on content
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
      </div>
    ))}
  </div>
</div>
    {/* Submit Button */}
    <div className="d-flex justify-content-center mt-4">
      <button
        type="submit"
        className="btn px-5"
        style={{ 
          backgroundColor: "#0076CE", 
          color: "white",
          height: "45px",
          minWidth: "150px",
          marginLeft:"1000px",
          marginTop:"-80px"
        }}
        disabled={loading || !categoryId}
      >
        {loading ? "Adding..." : "Add Service"}
      </button>
    </div>
  </form>
</div>
        </main>
      </div>
    </div>
  );
};

export default AddService;