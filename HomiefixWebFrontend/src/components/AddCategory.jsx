import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import addWorker from "../assets/addWorker.jpg";
import "../styles/Services.css";
import api from "../api";

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryPhoto: null,
    servicePhoto: null, // Added servicePhoto to state
    categoryName: "",
    serviceDescription: ["", "", ""],
  });
  const [previewImage, setPreviewImage] = useState(addWorker);
  const [servicePreviewImage, setServicePreviewImage] = useState(addWorker); // Separate preview for service
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

  const handleCategoryImageUpload = (e) => {
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

    setFormData(prev => ({ ...prev, categoryPhoto: file }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleServiceImageUpload = (e) => { // Added service image upload handler
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
      setServicePreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Create FormData object for file upload
  //     const submitData = new FormData();
  //     submitData.append("name", formData.categoryName);
      
  //     // Append only category image to save in database
  //     if (formData.categoryPhoto) {
  //       submitData.append("image", formData.categoryPhoto);
  //     }

  //     // Service photo is uploaded but NOT sent to backend
  //     // It's stored in frontend state only for display purposes

  //     // Make API call to add category (only category image is sent)
  //     const response = await api.post("/categories/add", submitData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     // Navigate to AddService page with category data
  //       navigate("/services/add-service", { 
  //         state: { 
  //           categoryId: createdCategory.id,
  //           categoryName: createdCategory.name,
  //           // Pass the category image URL if you want to use it
  //           categoryImage: createdCategory.categoryImage,
  //           // Flag to indicate this is from AddCategory flow
  //           fromAddCategory: true
  //         }
  //       });
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //     alert("Error adding category. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append("name", formData.categoryName);
    
    // Append only category image to save in database
    if (formData.categoryPhoto) {
      submitData.append("image", formData.categoryPhoto);
    }

    // Make API call to add category (only category image is sent)
    const response = await api.post("/categories/add", submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      console.log("Category added successfully:", response.data);
      
      // Get the created category data from response
      const createdCategory = response.data; // This is the created category object
      
      // Navigate to AddService page with category data
      navigate("/services/add-service", { 
        state: { 
          categoryId: createdCategory.id,
          categoryName: createdCategory.name,
          // Pass the category image URL if you want to use it
          categoryImage: createdCategory.categoryImage,
          // Flag to indicate this is from AddCategory flow
          fromAddCategory: true
        }
      });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    
    // More detailed error message
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status:", error.response.status);
      alert(`Error adding category: ${error.response.data?.message || "Please try again."}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("No response from server. Please check your connection.");
    } else {
      console.error("Error:", error.message);
      alert("Error adding category. Please try again.");
    }
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
              <h5 className="mb-0 ms-3">Add Category</h5>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-grow-1 p-4 form-section"  style={{ marginTop:"120px" }}>
            <form onSubmit={handleSubmit}>
              {/* Category Photos in Horizontal Row */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Category photo</label>
                <div className="d-flex align-items-start gap-4">
                  {/* First Photo Upload - Category Photo */}
                  <div className="d-flex align-items-center gap-4">
                    <div className="position-relative">
                      <img
                        src={previewImage}
                        alt="Category"
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
                        id="categoryPhoto1"
                        className="d-none"
                        onChange={handleCategoryImageUpload}
                        accept="image/jpeg, image/png"
                      />
                      <label
                        htmlFor="categoryPhoto1"
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

                  {/* Second Photo Upload - Service Photo */}
                  {/* <div className="d-flex flex-column align-items-start gap-2 ms-5" style={{ marginTop: "-30px" }}>
                    <label className="form-label fw-semibold mb-0">Service photo</label>
                    <div className="d-flex align-items-center gap-4">
                      <div className="position-relative">
                        <img
                          src={servicePreviewImage}
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
                          id="servicePhoto1"
                          className="d-none"
                          onChange={handleServiceImageUpload} // Fixed: changed to handleServiceImageUpload
                          accept="image/jpeg, image/png"
                        />
                        <label
                          htmlFor="servicePhoto1"
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
                  </div> */}
                </div>
              </div>

              {/* Category, Service and Price in same row */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Enter your category</label>
                  <input
                    type="text"
                    name="categoryName"
                    className="form-control"
                    placeholder="Enter your category"
                    style={{ height: "45px" }}
                    value={formData.categoryName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label fw-semibold">Enter your service</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your service"
                    style={{ height: "45px" }}
                  />
                </div> */}
                {/* <div className="col-md-4">
                  <label className="form-label fw-semibold">Enter Price</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1000"
                    style={{ height: "45px" }}
                  />
                </div> */}
              </div>

              {/* Please list what we do */}
              {/* <div className="mb-4">
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
              </div> */}

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
                    marginTop:"200px"
                  }}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCategory;