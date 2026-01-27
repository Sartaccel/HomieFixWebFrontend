import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../styles/Coupon.css";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isBlank = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim().length === 0);

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const today = new Date().toISOString().split("T")[0];
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discount: "",
    minOrder: "",
    // maxDiscount: "",
    startDate: "",
    validUntil: "",
    couponType: "", // default value
    active: true,
  });

  //Fetch coupons from backend on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons/view");
      // Map backend Coupon -> frontend shape your table expects
      const mapped = response.data.map((c) => ({
        id: c.id,
        title: c.title,
        code: c.code,
        discount: c.discountValue,
        minOrder: "-",
        startDate: c.startDate,
        validUntil: c.validUntil,
        couponType: c.couponType,
        status: c.active ? "active" : "inactive",
        active: c.active,
        maxDiscount: "",
      }));
      setCoupons(mapped);
    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  };

  const filteredCoupons =
    statusFilter === "all"
      ? coupons
      : coupons.filter((c) => c.status === statusFilter);

  const handleAddCoupon = () => {
    setIsEditMode(false);

    setFormData({
      title: "",
      code: "",
      discount: "",
      minOrder: "",
      // maxDiscount: "",
      startDate: today,
      validUntil: today,
      couponType: "",
      active: true,
    });
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (couponId) => {
    const toastId = toast.info(
      () => (
        <div>
          <p className="fw-semibold text-center mb-3">
            Are you sure you want to delete this coupon?
          </p>

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={async () => {
                try {
                  await api.delete(`/coupons/delete/${couponId}`);
                  toast.dismiss(toastId);
                  toast.success("Coupon deleted successfully", {
                    autoClose: 1500,
                  });

                  setCoupons((prev) =>
                    prev.filter((c) => c.id !== couponId)
                  );
                } catch (error) {
                  toast.dismiss(toastId);
                  toast.error("Failed to delete coupon");
                }
              }}
            >
              Delete
            </button>

            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        closeOnClick: false,
        draggable: false,
        autoClose: 3000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlank(formData.title)) {
      toast.warning("Coupon title cannot be empty");
      return;
    }

    if (isBlank(formData.code)) {
      toast.warning("Coupon code cannot be empty");
      return;
    }

    if (isBlank(formData.couponType)) {
      toast.warning("Please select a coupon type");
      return;
    }

    if (isBlank(formData.discount)) {
      toast.warning("Discount value is required");
      return;
    }

    if (!/^\d+$/.test(formData.discount)) {
      toast.warning("Discount must contain only numbers");
      return;
    }

    const discountValue = Number(formData.discount);

    if (formData.couponType === "percentage") {
      if (discountValue < 0 || discountValue > 100) {
        toast.warning("Percentage discount must be between 0 and 100");
        return;
      }
    }

    if (formData.couponType === "fixed") {
      if (discountValue <= 0) {
        toast.warning("Fixed discount must be greater than 0");
        return;
      }
    }

    if (!formData.startDate || !formData.validUntil) {
      toast.warning("Please select Start Date and Valid Until");
      return;
    }

    if (new Date(formData.validUntil) < new Date(formData.startDate)) {
      toast.warning("Valid Until date cannot be before Start Date");
      return;
    }

    if (!formData.code || !formData.discount || !formData.couponType) {
      toast.warning("Please fill Code, Discount and Coupon Type");
      return;
    }

    if (!formData.startDate || !formData.validUntil) {
      toast.warning("Please select Start Date and Valid Until");
      return;
    }

    try {
      //  EDIT MODE
      if (isEditMode && editingCouponId != null) {
        const updatePayload = {
          couponId: editingCouponId,
          title: formData.title,
          code: formData.code,
          discountValue: Number(formData.discount),
          couponType:
            formData.couponType === "percentage"
              ? "PERCENTAGE"
              : "FIXED_AMOUNT",
          startDate: formData.startDate,   // yyyy-MM-dd
          validUntil: formData.validUntil, // yyyy-MM-dd
          active: formData.active,
        };

        console.log("Update payload:", updatePayload);
        const response = await api.put("/coupons/edit", updatePayload);

        // controller returns ApiResponse<Coupon>, so data may be inside .data
        const updated = response.data.data || response.data;

        // map back into table shape
        const updatedRow = {
          id: updated.id,
          title: updated.title,
          code: updated.code,
          discount: updated.discountValue,
          minOrder: "-", // keep same layout
          startDate: updated.startDate,
          validUntil: updated.validUntil,
          couponType: updated.couponType,
          status: updated.active ? "active" : "inactive",
          active: updated.active,
          maxDiscount: "",
        };

        setCoupons((prev) =>
          prev.map((c) => (c.id === updatedRow.id ? updatedRow : c))
        );

        // reset edit state
        setIsEditMode(false);
        setEditingCouponId(null);
        setShowAddForm(false);
        setFormData({
          title: "",
          code: "",
          discount: "",
          minOrder: "",
          startDate: "",
          validUntil: "",
          couponType: "",
          active: true,
        });
        toast.success("Coupon updated successfully", {
          autoClose: 1000,
        });

        return;
      }

      // ADD MODE (your existing logic, unchanged)
      let endpoint = "";
      let params = {
        code: formData.code,
        rewardType: "DISCOUNT",
        title: formData.title,
        startDate: formData.startDate,
        validUntil: formData.validUntil,
      };

      if (formData.couponType === "percentage") {
        endpoint = "/coupons/create/percentage";
        params.discountPercentage = formData.discount;
      } else if (formData.couponType === "fixed") {
        endpoint = "/coupons/create/fixed";
        params.fixedAmount = formData.discount;
      } else {
        toast.warning("Invalid coupon type selected");

        return;
      }

      const response = await api.post(endpoint, null, {
        params: params,
      });

      const c = response.data;

      const newCoupon = {
        id: c.id,
        title: c.title,
        code: c.code,
        discount: c.discountValue,
        minOrder: formData.minOrder || "-",
        startDate: c.startDate,
        validUntil: c.validUntil,
        couponType: c.couponType,
        status: c.active ? "active" : "inactive",
        active: c.active,
        maxDiscount: "",
      };

      setCoupons((prev) => [...prev, newCoupon]);
      toast.success("Coupon added successfully", {
        autoClose: 1000,
      });

      setShowAddForm(false);
      setFormData({
        title: "",
        code: "",
        discount: "",
        minOrder: "",
        startDate: "",
        validUntil: "",
        couponType: "",
        active: true,
      });

    } catch (error) {
      console.error("Error creating/updating coupon", error);
      toast.error("Failed to save coupon");

    }
  };


  const handleEditClick = (coupon) => {
    setIsEditMode(true);
    setEditingCouponId(coupon.id);

    setFormData({
      title: coupon.title || "",
      code: coupon.code || "",
      discount: coupon.discount || "",
      minOrder: coupon.minOrder || "",
      // maxDiscount: coupon.maxDiscount || "",
      startDate: coupon.startDate || today,
      validUntil: coupon.validUntil || coupon.startDate || today,
      couponType:
        coupon.couponType === "PERCENTAGE"
          ? "percentage"
          : coupon.couponType === "FIXED_AMOUNT"
            ? "fixed"
            : "",
      active: coupon.status === "active",
    });

    setShowAddForm(true);
  };

  return (
    <div className="coupon-page-wrapper">
      <Header />

      <div className="coupon-main container-fluid">
        <div className="coupon-top-bar d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Coupons</h4>
          <button className="coupon-add-btn" onClick={handleAddCoupon}>
            Add Coupon
          </button>
        </div>

        {/* Card that holds table + overlay */}
        <div
          className={`coupon-card mt-3 ${showAddForm ? "coupon-card-overlay-open" : ""
            }`}
        >
          {/* <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Coupons</h5>
          </div> */}

          {/* ADD-COUPON OVERLAY CARD */}
          {showAddForm && (
            <div className="add-coupon-overlay">
              <form onSubmit={handleSubmit} className="add-coupon-card">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="mb-1">
                      {isEditMode ? "Edit Coupon" : "Add coupon"}
                    </h5>
                    <small className="text-muted">
                      {isEditMode ? "Update coupon changes" : "Add coupon Details"}
                    </small>
                  </div>

                  {/* optional close icon/button */}
                  <button
                    type="button"
                    className="btn btn-sm btn-light border-0 shadow-none"
                    onClick={handleCloseForm}
                  >
                    ✕
                  </button>
                </div>

                {/* Coupon title */}
                <div className="mb-3">
                  <label className="form-label add-coupon-label">
                    Coupon Title
                  </label>
                  <input
                    type="text"
                    className="form-control add-coupon-input"
                    value={formData.title}
                    maxLength={50}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                  <small className="text-muted">
                    {formData.title.length}/50 characters
                  </small>
                </div>

                {/* 3-column row: Code, Choose coupon type, Discount */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      className="form-control add-coupon-input"
                      value={formData.code}
                      maxLength={10}
                      onChange={(e) => handleChange("code", e.target.value)}
                    />
                    <small className="text-muted">
                      {formData.code.length}/10 characters
                    </small>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">Choose coupon type</label>

                    <select
                      className="form-select add-coupon-input coupon-type-select"
                      value={formData.couponType}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange("couponType", value);
                        // auto-clear discount when switching type
                        handleChange("discount", "");
                      }}
                    >
                      <option value="" disabled>
                        Coupon type
                      </option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>

                  {/* <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Choose coupon type
                    </label>
                    <select
                      className="form-select add-coupon-input"
                      value={formData.couponType}
                      onChange={(e) => handleChange("couponType", e.target.value)}
                    >                    
                      <option value="flat">Fixed Amount</option>
                      <option value="free_shipping">Percentage</option>
                    </select>
                  </div> */}

                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Coupon Discount
                    </label>
                    <input
                      type="text"
                      className="form-control add-coupon-input"
                      value={formData.discount}
                      maxLength={formData.couponType === "percentage" ? 3 : 5}

                      onChange={(e) =>
                        handleChange("discount", e.target.value)
                      }
                    />
                    <small className="text-muted">
                      {formData.discount.length}/
                      {formData.couponType === "percentage" ? 3 : 5} characters

                    </small>
                  </div>
                </div>

                {/* 3-column row: Min Order, Start date, Valid Until */}
                <div className="row">
                  {/* <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Min Order
                    </label>
                    <input
                      type="text"
                      className="form-control add-coupon-input"
                      value={formData.minOrder}
                      onChange={(e) =>
                        handleChange("minOrder", e.target.value)
                      }
                    />
                  </div> */}

                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Start date
                    </label>
                    <input
                      type="date"
                      className="form-control add-coupon-input"
                      value={formData.startDate}
                      min={today}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange("startDate", value);

                        // auto-fix validUntil if it becomes invalid
                        if (formData.validUntil && value > formData.validUntil) {
                          handleChange("validUntil", value);
                        }
                      }}
                    />

                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      className="form-control add-coupon-input"
                      value={formData.validUntil}
                      min={formData.startDate || today}
                      onChange={(e) =>
                        handleChange("validUntil", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Max Discount row (kept) */}
                {/* <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">
                      Max Discount
                    </label>
                    <input
                      type="text"
                      className="form-control add-coupon-input"
                      value={formData.maxDiscount}
                      onChange={(e) =>
                        handleChange("maxDiscount", e.target.value)
                      }
                    />
                  </div>
                </div> */}

                {/* Active toggle + submit button */}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center">
                    <span className="me-3">Active</span>
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) =>
                          handleChange("active", e.target.checked)
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary add-coupon-submit-btn"
                  >
                    {isEditMode ? "Update Changes" : "Add Coupon"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TABLE (unchanged) */}
          <div className="table-responsive coupon-table-container">
            <table
              className="table align-middle mb-0"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Coupon Title</th>
                  <th>Coupon Code</th>
                  <th>Coupon Discount</th>
                  <th>Coupon Type</th>
                  <th>Start date</th>
                  <th>Valid Until</th>
                  <th>
                    <div className="dropdown">
                      <button
                        className="btn btn-light btn-sm dropdown-toggle"
                        type="button"
                        id="couponStatusDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "2px 8px",
                          fontSize: "13px",
                        }}
                      >
                        Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </button>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="couponStatusDropdown"
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

                  <th className="text-center">Actions</th>
                  {/* <th className="text-center">Delete</th> */}
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="coupon-title-cell">{coupon.title}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}</td>
                    <td>{coupon.couponType}</td>
                    <td>{coupon.startDate}</td>
                    <td>{coupon.validUntil}</td>
                    <td>
                      <span
                        className={`coupon-status-pill ${coupon.status === "active"
                          ? "coupon-status-active"
                          : "coupon-status-inactive"
                          }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-link p-0 border-0 shadow-none coupon-edit-btn me-2"
                        onClick={() => handleEditClick(coupon)}
                        title="Edit Coupon"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="btn btn-link p-0 border-0 shadow-none coupon-delete-btn"
                        onClick={() => handleDeleteClick(coupon.id)}
                        title="Delete Coupon"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                    {/* <td className="text-center"> */}
                    {/* <button
                        className="btn btn-link p-0 border-0 shadow-none coupon-edit-btn"
                        onClick={() => handleEditClick(coupon)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button> */}
                    {/* </td> */}

                  </tr>
                ))}

                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-3">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable
      />
    </div>
  );
};

export default Coupon;
