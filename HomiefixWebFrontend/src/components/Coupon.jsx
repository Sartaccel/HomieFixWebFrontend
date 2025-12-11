import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../styles/Coupon.css";
import api from "../api";

// const initialCoupons = [
//   {
//     id: 1,
//     code: "FIRST50",
//     discount: "50%",
//     minOrder: "₹100",
//     // maxDiscount: "₹50",
//     validUntil: "2025-12-31",
//     startDate: "2024-12-01",
//     couponType: "",
//     status: "active",
//   },
//   {
//     id: 2,
//     code: "FIRST50",
//     discount: "50%",
//     minOrder: "₹100",
//     // maxDiscount: "₹50",
//     validUntil: "2025-12-31",
//     startDate: "2024-12-01",
//     couponType: "",
//     status: "active",
//   },
//   {
//     id: 3,
//     code: "FIRST50",
//     discount: "50%",
//     minOrder: "₹100",
//     // maxDiscount: "₹50",
//     validUntil: "2025-12-31",
//     startDate: "2024-12-01",
//     couponType: "",
//     status: "active",
//   },
// ];

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔹 NEW: control showing the add-coupon card
  const [showAddForm, setShowAddForm] = useState(false);
  // whether the popup is in Edit mode or Add mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  // dummy local form state (for layout) — added couponType and startDate
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

  // 🔹 NEW: Fetch coupons from backend on mount
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
        discount: c.discountValue, // raw value; you can format in UI if needed
        minOrder: "-", // backend currently has no minOrder; keep layout
        startDate: c.startDate,
        validUntil: c.validUntil,
        couponType: c.couponType,
        status: c.active ? "active" : "inactive",
        active: c.active,
        maxDiscount: "", // to keep the existing column
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
    // Add mode
    setIsEditMode(false);

    // clear form (includes new fields)
    setFormData({
      title: "",
      code: "",
      discount: "",
      minOrder: "",
      // maxDiscount: "",
      startDate: "",
      validUntil: "",
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


  const handleDeleteClick = async (couponId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!confirmDelete) return;

    try {
      // ✅ call your Spring endpoint
      await api.delete(`/coupons/delete/${couponId}`);

      // ✅ update UI
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (error) {
      console.error("Error deleting coupon", error);
      alert("Failed to delete coupon");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.discount || !formData.couponType) {
      alert("Please fill Code, Discount and Coupon Type");
      return;
    }

    if (!formData.startDate || !formData.validUntil) {
      alert("Please select Start Date and Valid Until");
      return;
    }

    try {
      // 🔹 EDIT MODE
      if (isEditMode && editingCouponId != null) {
        // build payload expected by /coupons/edit (CouponUpdateRequestDTO)
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

        return;
      }

      // 🔹 ADD MODE (your existing logic, unchanged)
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
        alert("Invalid coupon type selected");
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
      alert("Failed to save coupon");
    }
  };


  const handleEditClick = (coupon) => {
    // Edit mode
    setIsEditMode(true);
    setEditingCouponId(coupon.id);

    // pre-fill form with row data (map new fields too)
    setFormData({
      title: coupon.title || "",
      code: coupon.code || "",
      discount: coupon.discount || "",
      minOrder: coupon.minOrder || "",
      // maxDiscount: coupon.maxDiscount || "",
      startDate: coupon.startDate || "",
      validUntil: coupon.validUntil || "",
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Coupons</h5>
          </div>

          {/* 🔹 ADD-COUPON OVERLAY CARD */}
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
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
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
                      onChange={(e) => handleChange("code", e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label add-coupon-label">Choose coupon type</label>

                    <select
                      className="form-select add-coupon-input coupon-type-select"
                      value={formData.couponType}
                      onChange={(e) => handleChange("couponType", e.target.value)}
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
                      onChange={(e) =>
                        handleChange("discount", e.target.value)
                      }
                    />
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
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
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

                  <th>Coupon Code</th>
                  <th>Coupon Discount</th>
                  <th>Coupon Type</th>
                  <th>Start date</th>
                  <th>Valid Until</th>
                  <th>
                    <div className="d-flex align-items-center gap-1">
                      <span>Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select form-select-sm shadow-none border-0 p-0"
                        style={{
                          width: "90px",
                          background: "transparent",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </th>
                  <th className="text-center">Actions</th>
                  <th className="text-center">Delete</th>
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>

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
                        className="btn btn-link p-0 border-0 shadow-none coupon-edit-btn"
                        onClick={() => handleEditClick(coupon)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-link p-0 border-0 shadow-none coupon-delete-btn"
                        onClick={() => handleDeleteClick(coupon.id)}
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
    </div>
  );
};

export default Coupon;
