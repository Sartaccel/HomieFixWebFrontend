import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import addWorker from "../assets/addWorker.jpg";
import "../styles/Services.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditCategory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categoryId, categoryName, categoryImage } = location.state ?? {};
    const [formData, setFormData] = useState({
        categoryPhoto: null,
        servicePhoto: null, // Added servicePhoto to state
        categoryName: "",
        serviceDescription: ["", "", ""],
    });

    const [previewImage, setPreviewImage] = useState(addWorker);
    const [servicePreviewImage, setServicePreviewImage] = useState(addWorker); // Separate preview for service
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categoryName) {
            setFormData(prev => ({
                ...prev,
                categoryName: categoryName,
            }));
        }

        if (categoryImage) {
            setPreviewImage(categoryImage);
        }
    }, [categoryName, categoryImage]);

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append("name", formData.categoryName);

            // only send image if user selected a new one
            if (formData.categoryPhoto) {
                submitData.append("image", formData.categoryPhoto);
            }

            await api.put(`/categories/update/${categoryId}`, submitData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Category updated successfully", {
                position: "top-right",
                autoClose: 1500,
                onClose: () => navigate("/services"),
            });


        } catch (error) {
            console.error("Update category error:", error);
            toast.error(" Failed to update category", {
                position: "top-right",
                autoClose: 2000,
            });

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
                            <h5 className="mb-0 ms-3">Edit Category</h5>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex-grow-1 p-4 form-section" style={{ marginTop: "120px" }}>
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
                                                    marginTop: "50px"
                                                }}
                                            >
                                                Upload photo
                                            </label>
                                        </div>
                                    </div>
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
                                        marginTop: "200px"
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? "Adding..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
            <ToastContainer
                position="top-right"
                closeOnClick
                draggable={false}
            />

        </div>
    );
};

export default EditCategory;