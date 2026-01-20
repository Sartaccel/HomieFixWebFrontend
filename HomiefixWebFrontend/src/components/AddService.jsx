import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import addWorker from "../assets/addWorker.jpg";
import "../styles/Services.css";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const sanitizeText = (value) => {
  // Remove leading spaces
  const noLeadingSpace = value.replace(/^\s+/, "");

  // Prevent only-spaces value
  if (noLeadingSpace.trim() === "") return "";

  return noLeadingSpace;
};

const AddService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceContent, setServiceContent] = useState({
    title: "",
    sections: [
      { title: "", items: [""] },
      // { title: "", items: [""] },
      // { title: "", items: [""] },
    ],
  });

  // Get category ID and name from navigation state
  const { categoryId, categoryName } = location.state || {};

  const [formData, setFormData] = useState({
    servicePhoto: null,
    serviceName: "",
    price: "",
    serviceDescription: ["", ""],
  });
  const [previewImage, setPreviewImage] = useState(addWorker);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      if (!/^\d*$/.test(value)) return; // blocks letters & symbols
      if (value.length > 4) return;     // max 4 digits
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // AUTO SET SERVICE CONTENT TITLE
    if (name === "serviceName") {
      setServiceContent((prev) => ({
        ...prev,
        title: value ? `${value} Service` : "",
      }));
    }
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.serviceDescription];
    newDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      serviceDescription: newDescriptions
    }));
  };


  const addWhatWeDoField = () => {
    setFormData(prev => ({
      ...prev,
      serviceDescription: [...prev.serviceDescription, ""],
    }));
  };

  const removeWhatWeDoField = (index) => {
    setFormData(prev => ({
      ...prev,
      serviceDescription: prev.serviceDescription.filter((_, i) => i !== index),
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
        toast.error("Category ID is missing. Please go back and try again.", {
          position: "top-right",
          autoClose: 1000,
        });

        setLoading(false);
        return;
      }

      if (!formData.serviceName.trim()) {
        toast.error("Service name is required", {
          position: "top-right",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }

      if (!formData.price) {
        toast.error("Price is required", {
          position: "top-right",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }

      if (formData.serviceName.trim().length < 3) {
        toast.error("Service name must be at least 3 characters");
        setLoading(false);
        return;
      }

      if (formData.serviceName.length > 30) {
        toast.error("Service name cannot exceed 30 characters");
        setLoading(false);
        return;
      }

      if (formData.serviceDescription.some(d => d.trim().length > 150)) {
        toast.error("Each description must be under 150 characters");
        setLoading(false);
        return;
      }


      if (!/^\d{1,4}$/.test(formData.price)) {
        toast.error("Price must be a 4-digit number only", {
          position: "top-right",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }


      // Create FormData for the product
      const productData = new FormData();
      productData.append("name", formData.serviceName);
      productData.append("price", parseFloat(formData.price));
      productData.append("categoryId", categoryId);

      // Append image if available
      if (formData.servicePhoto) {
        productData.append("image", formData.servicePhoto);
      }

      //  Save Product
      const response = await api.post("/products/add", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const savedProduct = response.data;
      const productId = savedProduct.id;
      //  Save service content grid
      await api.put(
        `/products/${productId}/service-content`,
        serviceContent
      );

      //  Save "What We Do" for this product
      const whatWeDoList = formData.serviceDescription
        .filter(desc => desc.trim() !== "");

      for (let desc of whatWeDoList) {
        await api.post("/products/details/whatwedo/add", {
          productId: productId,
          description: desc,
        });
      }
      toast.success("Service added successfully", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/services", {
          state: { categoryAdded: true },
        });
      }, 1000);

    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Error adding service. Please try again.", {
        position: "top-right",
        autoClose: 1000,
      });

    } finally {
      setLoading(false);
    }
  };
  const updateSectionTitle = (index, value) => {
    const sections = [...serviceContent.sections];
    sections[index].title = sanitizeText(value);

    setServiceContent({ ...serviceContent, sections });
  };

  const updateItem = (sIndex, iIndex, value) => {
    const sections = [...serviceContent.sections];
    sections[sIndex].items[iIndex] = sanitizeText(value);

    setServiceContent({ ...serviceContent, sections });
  };

  const addItem = (index) => {
    const sections = [...serviceContent.sections];
    sections[index].items.push("");
    setServiceContent({ ...serviceContent, sections });
  };

  const removeItem = (sIndex, iIndex) => {
    const sections = [...serviceContent.sections];
    sections[sIndex].items.splice(iIndex, 1);
    setServiceContent({ ...serviceContent, sections });
  };

  const addSection = () => {
    setServiceContent({
      ...serviceContent,
      sections: [...serviceContent.sections, { title: "", items: [""] }],
    });
  };

  const removeSection = (index) => {
    const sections = [...serviceContent.sections];
    sections.splice(index, 1);
    setServiceContent({ ...serviceContent, sections });
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Validate required fields
  //     if (!categoryId) {
  //       alert("Category ID is missing. Please go back and try again.");
  //       setLoading(false);
  //       return;
  //     }

  //     if (!formData.serviceName.trim()) {
  //       alert("Service name is required");
  //       setLoading(false);
  //       return;
  //     }

  //     if (!formData.price) {
  //       alert("Price is required");
  //       setLoading(false);
  //       return;
  //     }

  //     // Create FormData for the product
  //     const productData = new FormData();
  //     productData.append("name", formData.serviceName);
  //     productData.append("price", parseFloat(formData.price));
  //     productData.append("categoryId", categoryId); // Use the categoryId from state

  //     // Append the description as a single string
  //     const descriptionString = formData.serviceDescription
  //       .filter(desc => desc.trim() !== "")
  //       .join(" || ");

  //     if (descriptionString) {
  //       productData.append("description", descriptionString);
  //     }

  //     // Append image if available
  //     if (formData.servicePhoto) {
  //       productData.append("image", formData.servicePhoto);
  //     }

  //     // Make API call to save the product
  //     const response = await api.post("/products/add", productData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       console.log("Service added successfully:", response.data);
  //       alert("Service added successfully!");
  //       navigate("/services");
  //     }
  //   } catch (error) {
  //     console.error("Error adding service:", error);
  //     alert("Error adding service. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 h-100">
        {/* Sidebar */}
        <div className="col-auto p-0 m-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main
          className="col p-0 m-0 d-flex flex-column"
          style={{ overflowY: "auto", height: "100vh" }}
        >
          <Header />

          {/* Navigation Bar */}
          <div
            className="navigation d-flex align-items-center py-2 px-4 bg-white border-bottom"
            style={{ width: "87%", margin: "0 auto" }}
          >

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
          <div className="flex-grow-1 p-4 form-section" style={{ marginTop: "120px" }}>
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
                        marginTop: "50px"
                      }}
                    >
                      Upload photo
                    </label>
                  </div>
                </div>
              </div>

              {/* Category, Service and Price in same row */}
              <div className="row mb-4 g-3">
                <div className="col-md-3">
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

                {/* SERVICE CONTENT TITLE */}
                {/* <div className="col-md-3">
                  <label className="form-label fw-semibold">Enter the title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter service content title"
                    value={serviceContent.title}
                    onChange={(e) =>
                      setServiceContent({
                        ...serviceContent,
                        title: e.target.value,
                      })
                    }
                    style={{ height: "45px" }}
                  />

                </div> */}

                <div className="col-md-3">
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
                    minLength={3}
                    maxLength={30}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Enter Price</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Eg: 1000"
                    style={{ height: "45px" }}
                    required
                  />

                </div>
              </div>

              {/* Please list what we do */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Please list what we do:</label>

                <div className="border rounded p-3" style={{ width: "380px" }}>
                  {formData.serviceDescription.map((description, index) => (
                    <div key={index} className="d-flex align-items-start mb-3">
                      <span className="me-2 mt-1">•</span>

                      <textarea
                        className="form-control border-0 bg-transparent p-2"
                        value={description}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        placeholder="Describe what we do"
                        maxLength={150}
                        minLength={3}
                        style={{
                          fontSize: "14px",
                          boxShadow: "none",
                          resize: "none",
                          minHeight: "20px",
                          width: "100%",
                        }}
                        rows={1}
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                      />

                      {formData.serviceDescription.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => removeWhatWeDoField(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={addWhatWeDoField}
                  >
                    + Add What We Do
                  </button>
                </div>
              </div>
              {/* SERVICE CONTENT GRID */}
              <div className="row mt-4 bg-light">
                <div className="ms-2 mt-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={addSection}
                  >
                    <i className="bi bi-plus-lg"></i> Add Grid
                  </button>
                </div>

                {serviceContent.sections.map((section, index) => (
                  <div
                    key={index}
                    className="col-4 border p-3 position-relative"
                    style={{ minHeight: "210px" }}
                  >
                    <div
                      className="position-absolute grid-action-icons"
                      style={{ top: "6px", right: "6px" }}
                    >

                      <button
                        className="btn btn-sm btn-light me-1"
                        onClick={() => addItem(index)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => removeSection(index)}
                      >
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                    </div>

                    <input
                      className="form-control mb-2"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(index, e.target.value)}
                      placeholder="Section title"
                      maxLength={40}
                      minLength={3}
                    />

                    <ul>
                      {section.items.map((item, i) => (
                        <li key={i} className="d-flex justify-content-between">
                          <input
                            className="form-control border-2"
                            value={item}
                            onChange={(e) =>
                              updateItem(index, i, e.target.value)
                            }
                            placeholder="Item"
                            maxLength={60}
                          />

                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => removeItem(index, i)}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
                    marginLeft: "1000px",
                    // marginTop: "-80px"
                  }}
                  disabled={loading || !categoryId}
                >
                  {loading ? "Adding..." : "Add Service"}
                </button>
              </div>
              <ToastContainer />

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddService;