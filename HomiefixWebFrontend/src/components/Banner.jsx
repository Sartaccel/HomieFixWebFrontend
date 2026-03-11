import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../styles/Banner.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://admin.homiefix.in/api/banners";
// const API_BASE_URL = "http://localhost:1212/banners";


const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // show / hide Add Banner popup
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  // const imageToastId = toast.warning("Please upload a banner image");

  // Add form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    active: true,
    image: null, // Changed from string to File object
  });

  // show / hide Edit Banner popup
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  // Edit form state
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    active: true,
    image: null,
  });

  // Utility: check empty or spaces-only text
  const isBlank = (value) => !value || value.trim().length === 0;

  const sanitizeInput = (value) => {
    return value
      .replace(/^\s+/g, "")                 // remove starting spaces
      .replace(/[^\w\s]/gi, "")            // remove special chars + emojis
  };


  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/list`);
      if (response.data.status === "success") {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error(" Failed to fetch banners");

    } finally {
      setLoading(false);
    }
  };

  // Filter banners based on status
  const filteredBanners = banners.filter(banner => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return banner.active;
    if (statusFilter === "inactive") return !banner.active;
    return true;
  });

  // Helper to convert active boolean to string status
  const getStatusText = (isActive) => isActive ? "active" : "inactive";

  // Handle Add Banner button click
  const handleAddBanner = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      title: "",
      description: "",
      startDate: today,
      endDate: today,
      active: true,
      image: null,
    });
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    handleChange("image", e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    // Title
    if (isBlank(formData.title)) {
      toast.warning("Banner title cannot be empty");
      hasError = true;
    }

    // Description
    if (isBlank(formData.description)) {
      toast.warning("Description cannot be empty");
      hasError = true;
    }

    // Image
    if (!formData.image) {
      toast.warning("Please upload a banner image");
      hasError = true;
    }

    // Start Date
    if (!formData.startDate) {
      toast.warning("Start date is required");
      hasError = true;
    }

    // End Date
    if (!formData.endDate) {
      toast.warning("End date is required");
      hasError = true;
    }

    // Date comparison
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        toast.warning("End date cannot be before start date");
        hasError = true;
      }
    }

    // Stop submit if ANY validation failed
    if (hasError) return;

    // -------- EXISTING API LOGIC BELOW (UNCHANGED) --------

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append("active", formData.active);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post(`${API_BASE_URL}/add`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        toast.success("Banner added successfully!", { autoClose: 1500 });
        setShowAddForm(false);
        fetchBanners();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add banner");
    }
  };


  // Handle Edit Banner
  const handleEditBanner = (banner) => {
    setSelectedBannerId(banner.id);
    setEditData({
      title: banner.title || "",
      description: banner.description || "",

      startDate: banner.startDate || "",
      endDate: banner.endDate || "",
      active: banner.active || false,
      image: null, // Reset file input
      existingImage: banner.bannerImage || null
    });
    setShowEditForm(true);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedBannerId(null);
  };

  const handleEditFileChange = (e) => {
    setEditData({ ...editData, image: e.target.files[0] });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    //  Validate title
    if (isBlank(editData.title)) {
      toast.warning(" Banner title cannot be empty or spaces only");
      return;
    }

    //  Validate description
    if (isBlank(editData.description)) {
      toast.warning("Description cannot be empty or spaces only");
      return;
    }


    if (!selectedBannerId) {
      toast.warning("No banner selected for editing");

      return;
    }

    // Validate dates
    if (editData.startDate && editData.endDate) {
      if (new Date(editData.endDate) < new Date(editData.startDate)) {
        toast.warning("End date cannot be before start date");

        return;
      }
    }

    // Prepare form data for API
    const formDataToSend = new FormData();
    if (editData.title) formDataToSend.append("title", editData.title);
    if (editData.description) formDataToSend.append("description", editData.description);
    if (editData.startDate) formDataToSend.append("startDate", editData.startDate);
    if (editData.endDate) formDataToSend.append("endDate", editData.endDate);
    formDataToSend.append("active", editData.active);
    if (editData.image) {
      formDataToSend.append("image", editData.image);
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${selectedBannerId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Banner updated successfully!", { autoClose: 1500 });

        setShowEditForm(false);
        fetchBanners(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error(error.response?.data?.message || "Failed to update banner");
    }
  };

  // Handle Status Update
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${id}/status?active=${newStatus}`
      );

      if (response.data.status === "success") {
        // Update local state
        setBanners(banners.map(banner =>
          banner.id === id ? { ...banner, active: newStatus } : banner
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || " Failed to update status");
    }
  };

  // Handle Delete Banner
  const handleDeleteBanner = (id) => {
    toast.info(
      <div>
        <p className="fw-semibold text-center mb-3">
          Are you sure you want to delete this banner?
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={async () => {
              try {
                await axios.delete(`${API_BASE_URL}/delete/${id}`);
                toast.dismiss();
                toast.success("Banner deleted successfully!", {
                  autoClose: 1500,
                });
                fetchBanners();
              } catch (error) {
                toast.dismiss();
                toast.error(
                  error.response?.data?.message || " Failed to delete banner"
                );
              }
            }}
          >
            Delete
          </button>

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        icon: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };


  return (
    <div className="banner-page-wrapper">
      {/* fixed header (same as other pages) */}
      <Header />

      <div className="banner-main container-fluid">
        {/* top bar: title + Add Banner button */}
        <div className="banner-top-bar d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Banner</h4>
          <button className="banner-add-btn" onClick={handleAddBanner}>
            Add Banner
          </button>
        </div>

        {/* Status Filter */}
        {/* <div className="mb-3 d-flex align-items-center">
          <span className="me-2">Status:</span>
          <select
            className="form-select form-select-sm w-auto border-0 p-0 shadow-none"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div> */}

        {/* white card with table */}
        <div className="banner-card mt-3">
          {/* ADD BANNER POPUP */}
          {showAddForm && (
            <div className="banner-add-overlay">
              <form onSubmit={handleSubmit} className="banner-add-card">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">Add Banner</h5>
                    <small className="text-muted">Add Banner Details</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-light border-0 shadow-none"
                    onClick={handleCloseForm}
                  >
                    ✕
                  </button>
                </div>

                {/* ROW 1: Title + Image + Start Date */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      Banner title
                    </label>
                    <input
                      type="text"
                      className="form-control banner-form-input"
                      value={formData.title}
                      maxLength={50}
                      onChange={(e) =>
                        handleChange("title", sanitizeInput(e.target.value))
                      }

                    // required
                    />
                    <small className="text-muted">
                      {formData.title.length}/{50} characters
                    </small>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      Image
                    </label>
                    <input
                      type="file"
                      className="form-control banner-form-input"
                      accept="image"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      Start date
                    </label>
                    <input
                      type="date"
                      className="form-control banner-form-input"
                      value={formData.startDate}
                      min={today}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange("startDate", value);

                        if (formData.endDate && value > formData.endDate) {
                          handleChange("endDate", value);
                        }
                      }}
                    // required
                    />
                  </div>
                </div>

                {/* ROW 2: End Date + Description */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      End date
                    </label>
                    <input
                      type="date"
                      className="form-control banner-form-input"
                      value={formData.endDate}
                      min={formData.startDate || today}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    // required
                    />
                  </div>

                  <div className="col-md-8 mb-3">
                    <label className="form-label banner-form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control banner-form-input"
                      value={formData.description}
                      maxLength={150}
                      onChange={(e) =>
                        handleChange("description", sanitizeInput(e.target.value))
                      }
                    />
                    <small className="text-muted">
                      {formData.description.length}/{150} characters
                    </small>
                  </div>
                </div>




                {/* Active toggle + submit button */}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center">
                    <span className="me-3">Active</span>
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => handleChange("active", e.target.checked)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary banner-add-submit-btn"
                  >
                    Add Banner
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT BANNER POPUP */}
          {showEditForm && (
            <div className="banner-add-overlay">
              <form onSubmit={handleEditSubmit} className="banner-add-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">Edit Banner</h5>
                    <small className="text-muted">Edit Banner Details</small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-light border-0 shadow-none"
                    onClick={closeEditForm}
                  >
                    ✕
                  </button>
                </div>


                {/* ROW 1: Title + Image + Start Date */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      Banner title
                    </label>
                    <input
                      type="text"
                      className="form-control banner-form-input"
                      value={editData.title}
                      maxLength={50}
                      onChange={(e) =>
                        setEditData({ ...editData, title: sanitizeInput(e.target.value) })
                      }

                    />
                    <small className="text-muted">
                      {editData.title.length}/{50} characters
                    </small>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      Image (Leave empty to keep current)
                    </label>
                    <input
                      type="file"
                      className="form-control banner-form-input"
                      accept="image/*"
                      onChange={handleEditFileChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      Start date
                    </label>
                    <input
                      type="date"
                      className="form-control banner-form-input"
                      value={editData.startDate}
                      min={today}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditData({ ...editData, startDate: value });

                        if (editData.endDate && value > editData.endDate) {
                          setEditData({ ...editData, startDate: value, endDate: value });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* ROW 2: End Date + Description */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label banner-form-label">
                      End date
                    </label>
                    <input
                      type="date"
                      className="form-control banner-form-input"
                      value={editData.endDate}
                      min={editData.startDate || today}
                      onChange={(e) =>
                        setEditData({ ...editData, endDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-8 mb-3">
                    <label className="form-label banner-form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control banner-form-input"
                      value={editData.description}
                      maxLength={150}
                      onChange={(e) =>
                        setEditData({ ...editData, description: sanitizeInput(e.target.value) })
                      }

                    />
                    <small className="text-muted">
                      {editData.description.length}/{150} characters
                    </small>
                  </div>
                </div>


                {/* ACTIVE + BUTTON */}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center">
                    <span className="me-3">Active</span>
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={editData.active}
                        onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary banner-add-submit-btn"
                  >
                    Update Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TABLE */}
          <div className="table-responsive banner-table-container">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <table
                className="table table-sm align-middle mb-0"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead>
                  <tr>
                    {/* <th >
                      <input type="checkbox" />
                    </th> */}
                    <th >Banner Title</th>
                    <th >Image</th>
                    <th >Description</th>
                    <th >Start date</th>
                    <th >End date</th>
                    <th>
                      <div className="dropdown">
                        <button
                          className="btn btn-light btn-sm dropdown-toggle"
                          type="button"
                          id="bannerStatusDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "2px 8px",
                          }}
                        >
                          Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}

                        </button>

                        <ul
                          className="dropdown-menu"
                          aria-labelledby="bannerStatusDropdown"
                        >
                          {["all", "active", "inactive"].map((status) => (
                            <li key={status}>
                              <button
                                className="dropdown-item text-capitalize"
                                onClick={() => setStatusFilter(status)}
                              >

                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </th>


                    <th >Actions</th>
                    {/* <th className="text-center">Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredBanners.map((banner) => (
                    <tr key={banner.id}>
                      {/* <td>
                        <input type="checkbox" />
                      </td> */}
                      <td>{banner.title}</td>

                      <td>
                        {banner.bannerImage ? (
                          <a
                            href={banner.bannerImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-link p-0 border-0 shadow-none banner-link-text"
                          >
                            View Image
                          </a>
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </td>

                      <td>{banner.description}</td>

                      <td>{banner.startDate}</td>
                      <td>{banner.endDate}</td>

                      <td>
                        <span
                          className={`banner-status-pill ${banner.active
                            ? "banner-status-active"
                            : "banner-status-inactive"
                            }`}
                        >
                          {getStatusText(banner.active)}
                        </span>
                      </td>
                      <td>
                        <i
                          className="bi bi-pencil-square banner-action-icon me-2"
                          onClick={() => handleEditBanner(banner)}
                          title="Edit Banner"
                        />

                        <i
                          className="bi bi-trash banner-delete-icon"
                          onClick={() => handleDeleteBanner(banner.id)}
                          title="Delete Banner"
                        />
                      </td>


                    </tr>
                  ))}

                  {filteredBanners.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-3">
                        No banners found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          closeOnClick={true}
          draggable={false}
        />

      </div>
    </div>
  );
};

export default Banner;