import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import addWorker from "../assets/addWorker.jpg";
import "../styles/AddWorker.css";
import Header from "./Header";
import api from "../api";
import Select from "react-select";

const EditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clickedButtons, setClickedButtons] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    workExperience: "",
    dateOfBirth: "",
    gender: "",
    houseNumber: "",
    town: "",
    pincode: "",
    nearbyLandmark: "",
    district: "",
    state: "",
    aadharNumber: "",
    drivingLicenseNumber: "",
    joiningDate: "",
    econtactNumber: "",
    role: [],
    specification: [],
    language: [],
    profilePic: null,
  });
  const [previewImage, setPreviewImage] = useState(addWorker);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDrivingLicenseFocused, setIsDrivingLicenseFocused] = useState(false);

  // Language options for dropdown
  const languageOptions = [
    { value: "Tamil", label: "Tamil" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
  ];

  // Role to specification mapping
  const roleSpecificationMap = {
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
      "Windows",
      "Drill & Hang",
      "Furniture",
    ],
    Plumbing: [
      "Washbasin Installation",
      "Blockage Removal",
      "Shower",
      "Toilet",
      "Tap, Pipe works",
      "Watertank & Motor",
    ],
    "Vehicle service": [
      "Batteries",
      "Health checkup",
      "Water Wash",
      "Denting & Painting",
      "Tyre Service",
      "Vehicle AC",
    ],
    "Care Taker": [
      "Child Care",
      "PhysioTheraphy",
      "Old Age Care",
      "Companion Support",
      "Home Nursing",
    ],
    Cleaning: ["Cleaning"],
    CCTV: ["CCTV"],
  };

  // Validation functions
  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  };

  const validateContactNumber = (number) => {
    const regex = /^\d{10}$/;
    return regex.test(number);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateLanguage = (languages) => {
    return languages && languages.length > 0;
  };

  const validatePincode = (pincode) => {
    const regex = /^\d{6}$/;
    return regex.test(pincode);
  };

  const validateDistrict = (district) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(district);
  };

  const validateState = (state) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(state);
  };

  const validateAadhar = (aadhar) => {
    const regex = /^\d{12}$/;
    return regex.test(aadhar);
  };

  const validateDrivingLicense = (license) => {
    if (!license) return true; // Optional field
    const regex = /^[a-zA-Z0-9]{15}$/;
    return regex.test(license);
  };

  const validateDate = (dateString, isDOB = false) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();

    // For DOB, check if the person is at least 18 years old
    if (isDOB) {
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 18);
      return date <= minDate;
    }

    return date <= today;
  };

  // Fetch worker data and initialize form
  // Update the initial preview image state in the useEffect
  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const response = await api.get(`/workers/view/${id}`);
        const data = response.data;

        // Initialize formData
        setFormData({
          ...data,
          role: data.role ? data.role.split(",") : [],
          specification: data.specification
            ? data.specification.split(",")
            : [],
          language: data.language ? data.language.split(",") : [],
          econtactNumber: data.eContactNumber || "",
        });

        // Initialize clickedButtons based on specification
        const initialClickedButtons = {};
        if (data.specification) {
          data.specification.split(",").forEach((item) => {
            initialClickedButtons[item] = true;
          });
        }
        setClickedButtons(initialClickedButtons);

        // Set preview image - use the full URL if it's from the server
        // Set preview image - use the full URL if it's from the server
        if (data.profilePicUrl) {
          setPreviewImage(
            data.profilePicUrl.startsWith("http")
              ? data.profilePicUrl
              : `${api.defaults.baseURL}${data.profilePicUrl}`
          );
        } else {
          setPreviewImage(addWorker);
        }
      } catch (error) {
        console.error("Error fetching worker data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch worker details. Please try again.",
        }).then(() => {
          navigate("/worker-details");
        });
      }
    };

    fetchWorkerData();
  }, [id, navigate]);

  const handleDrivingLicenseChange = (e) => {
    const { value } = e.target;

    // Allow complete clearing of the field
    if (value === "") {
      setFormData((prevState) => ({
        ...prevState,
        drivingLicenseNumber: "",
      }));
      setErrors((prev) => ({ ...prev, drivingLicenseNumber: "" }));
      return;
    }

    // Process the input value
    let processedValue = value;
      processedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    

    // Limit to 15 characters after DL-
    if (processedValue.length > 15) {
      processedValue = processedValue.substring(0, 15);
    }

    setFormData((prevState) => ({
      ...prevState,
      drivingLicenseNumber: processedValue,
    }));

    // Validate
    if (processedValue && !validateDrivingLicense(processedValue)) {
      setErrors((prev) => ({
        ...prev,
        drivingLicenseNumber:
          "License should be 15 alphanumeric characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, drivingLicenseNumber: "" }));
    }
  };

  const handleButtonClick = (item, roleHeading) => {
    setClickedButtons((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));

    setFormData((prevState) => {
      // Update specifications
      const updatedSpecifications = prevState.specification.includes(item)
        ? prevState.specification.filter((spec) => spec !== item)
        : [...prevState.specification, item];

      // Get all roles from updated specifications
      const updatedRoles = [];
      updatedSpecifications.forEach((spec) => {
        for (const [role, specs] of Object.entries(roleSpecificationMap)) {
          if (specs.includes(spec)) {
            if (!updatedRoles.includes(role)) {
              updatedRoles.push(role);
            }
            break;
          }
        }
      });

      return {
        ...prevState,
        role: updatedRoles,
        specification: updatedSpecifications,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Validate based on field name
    switch (name) {
      case "name":
        if (!validateName(value)) {
          error = "Name should only contain alphabets and spaces";
        }
        break;
      case "contactNumber":
      case "econtactNumber":
        if (!validateContactNumber(value)) {
          error = "Contact number should be 10 digits";
        }
        break;
      case "email":
        if (value && !validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "pincode":
        if (!validatePincode(value)) {
          error = "Pincode should be 6 digits";
        }
        break;
      case "district":
        if (!validateDistrict(value)) {
          error = "District should only contain alphabets";
        }
        break;
      case "state":
        if (!validateState(value)) {
          error = "State should only contain alphabets";
        }
        break;
      case "aadharNumber":
        if (!validateAadhar(value)) {
          error = "Aadhar number should be 12 digits";
        }
        break;
      case "dateOfBirth":
      case "joiningDate":
        if (value && !validateDate(value)) {
          error = "Date cannot be in the future";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLanguageChange = (selectedOptions) => {
    const languages = selectedOptions.map((option) => option.value);
    setFormData((prevState) => ({
      ...prevState,
      language: languages,
    }));

    // Clear error when languages are selected
    if (selectedOptions.length > 0) {
      setErrors((prev) => ({ ...prev, language: "" }));
    }
  };

  // Update the handleImageUpload function
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profilePic: "Only JPG, PNG images are allowed",
      }));
      return;
    }

    // Check file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePic: "File size should be less than 1MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, profilePic: "" }));
    setFormData((prevState) => ({
      ...prevState,
      profilePic: file,
    }));

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setPreviewImage(addWorker);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Add job title validation
    if (formData.specification.length === 0) {
      newErrors.jobTitle = "Please select at least one job title";
      isValid = false;
    }

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
      isValid = false;
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name should contain only alphabets and spaces";
      isValid = false;
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
      isValid = false;
    } else if (!validateContactNumber(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number should be 10 digits";
      isValid = false;
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.dateOfBirth && !validateDate(formData.dateOfBirth, true)) {
      newErrors.dateOfBirth = "Worker must be at least 18 years old";
      isValid = false;
    }

    if (!validateLanguage(formData.language)) {
      newErrors.language = "Please select at least one language";
      isValid = false;
    }

    if (!formData.houseNumber) {
      newErrors.houseNumber = "House number is required";
      isValid = false;
    }

    if (!formData.town) {
      newErrors.town = "Town is required";
      isValid = false;
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
      isValid = false;
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = "Pincode should be 6 digits";
      isValid = false;
    }

    if (!formData.district) {
      newErrors.district = "District is required";
      isValid = false;
    } else if (!validateDistrict(formData.district)) {
      newErrors.district = "District should only contain alphabets";
      isValid = false;
    }

    if (!formData.state) {
      newErrors.state = "State is required";
      isValid = false;
    } else if (!validateState(formData.state)) {
      newErrors.state = "State should only contain alphabets";
      isValid = false;
    }

    if (!formData.aadharNumber) {
      newErrors.aadharNumber = "Aadhar number is required";
      isValid = false;
    } else if (!validateAadhar(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar number should be 12 digits";
      isValid = false;
    }

    if (
      formData.drivingLicenseNumber &&
      !validateDrivingLicense(formData.drivingLicenseNumber)
    ) {
      newErrors.drivingLicenseNumber =
        "License should be in format DL- followed by 15 alphanumeric characters";
      isValid = false;
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
      isValid = false;
    } else if (!validateDate(formData.joiningDate)) {
      newErrors.joiningDate = "Joining date cannot be in the future";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate job titles first
    if (formData.specification.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select at least one job title before submitting.",
      });
      setIsLoading(false);
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (formData.contactNumber === formData.econtactNumber) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Contact Number and Emergency Contact Number cannot be the same.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "specification" || key === "role") {
          formDataToSend.append(key, formData[key].join(","));
        } else if (key === "econtactNumber") {
          formDataToSend.append("eContactNumber", formData[key]);
        } else if (key === "language") {
          formDataToSend.append("language", formData[key].join(","));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await api.put(`/workers/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Worker updated successfully!",
      }).then(() => {
        navigate(`/worker-details/worker/${id}`);
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update worker. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Style for required field asterisk
  const requiredFieldStyle = {
    color: "#B8141A",
    marginLeft: "2px",
    border: "-1px",
  };

  return (
    <>
      <Header />

      <div className="container" style={{ paddingTop: "80px" }}>
        <div className="d-flex gap-4 mx-2 align-items-center">
          <button
            className="btn btn-light p-2"
            style={{ marginBottom: "-20px" }}
            onClick={() => navigate(`/worker-details/worker/${id}`)}
          >
            <i
              className="bi bi-arrow-left"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            ></i>
          </button>
          <h5
            className="px-3 pb-3 text-black"
            style={{
              borderBottom: "3px solid #000",
              position: "relative",
              marginBottom: "-30px",
            }}
          >
            Edit Worker Details
          </h5>
        </div>
      </div>

      <div
        className="container"
        style={{
          height: "80vh",
          overflowY: "auto",
          overflowX: "hidden",
          marginTop: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Profile Photo */}
          <div
            className="container mt-4"
            style={{ marginLeft: "64px", maxWidth: "100%" }}
          >
            <p>Profile Photo</p>
            <div>
              <img
                src={previewImage}
                alt="profile"
                height={100}
                width={100}
                className="rounded-4"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  console.error("Image failed to load, using fallback");
                  e.target.onerror = null;
                  e.target.src = addWorker;
                }}
              />
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <label
                htmlFor="profilePic"
                className="btn mx-5"
                style={{
                  marginTop: "63px",
                  borderColor: "#0076CE",
                  color: "#0076CE",
                }}
              >
                Upload Photo
              </label>
              <div className="text-muted small mt-1">
                Supported formats: JPG, PNG | Max size: 1MB
              </div>
              {errors.profilePic && (
                <div className="text-danger small">{errors.profilePic}</div>
              )}
            </div>
          </div>

          {/* Main container */}
          <div
            className="container mt-4"
            style={{ marginLeft: "60px", maxWidth: "100%" }}
          >
            {/* Row 1 */}
            <div className="row" style={{ maxWidth: "100%" }}>
              <div className="col-md-2">
                <label htmlFor="name" className="form-label">
                  Full Name <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  name="name"
                  id="name"
                  required
                  placeholder="Enter Name"
                  onChange={handleChange}
                  value={formData.name}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control  shadow-none${
                    errors.email ? "is-invalid" : ""
                  }`}
                  name="email"
                  id="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  value={formData.email}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control shadow-none ${
                    errors.contactNumber ? "is-invalid" : ""
                  }`}
                  name="contactNumber"
                  id="contactNumber"
                  required
                  placeholder="Enter Contact Number"
                  onChange={handleChange}
                  value={formData.contactNumber}
                  maxLength="10"
                />
                {errors.contactNumber && (
                  <div className="invalid-feedback">{errors.contactNumber}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="eContactNumber" className="form-label">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  className={`form-control shadow-none ${
                    errors.econtactNumber ? "is-invalid" : ""
                  }`}
                  name="econtactNumber"
                  id="eContactNumber"
                  placeholder="Enter Emergency Contact Number"
                  onChange={handleChange}
                  value={formData.econtactNumber}
                  maxLength="10"
                />
                {errors.econtactNumber && (
                  <div className="invalid-feedback">
                    {errors.econtactNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="row mt-4">
              <div className="col-md-2">
                <label htmlFor="language" className="form-label shadow-none">
                  Language <span style={requiredFieldStyle}>*</span>
                </label>
                <Select
                  isMulti
                  options={languageOptions}
                  className={`basic-multi-select ${
                    errors.language ? "is-invalid" : ""
                  }`}
                  classNamePrefix="select"
                  onChange={handleLanguageChange}
                  value={languageOptions.filter((option) =>
                    formData.language.includes(option.value)
                  )}
                />
                {errors.language && (
                  <div className="text-danger small">{errors.language}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="workExperience" className="form-label">
                  Work Experience
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.workExperience ? "is-invalid" : ""
                  }`}
                  name="workExperience"
                  id="workExperience"
                  placeholder="Enter Work Experience"
                  onChange={handleChange}
                  value={formData.workExperience}
                />
                {errors.workExperience && (
                  <div className="invalid-feedback">
                    {errors.workExperience}
                  </div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="dateOfBirth" className="form-label">
                  D.O.B
                </label>
                <input
                  type="text"
                  className={`form-control  shadow-none${
                    errors.dateOfBirth ? "is-invalid" : ""
                  }`}
                  name="dateOfBirth"
                  id="dateOfBirth"
                  onChange={handleChange}
                  value={formData.dateOfBirth}
                  placeholder="dd-mm-yyyy"
                  style={{ color: formData.dateOfBirth ? "#000" : "#aaa" }}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                />
                {errors.dateOfBirth && (
                  <div className="invalid-feedback">{errors.dateOfBirth}</div>
                )}
              </div>
              <div className="col-md-2">
                <label htmlFor="gender" className="form-label">
                  Gender <span style={requiredFieldStyle}>*</span>
                </label>{" "}
                <br />
                <div className="form-check form-check-inline mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="Male"
                    onChange={handleChange}
                    checked={formData.gender === "Male"}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="Female"
                    onChange={handleChange}
                    checked={formData.gender === "Female"}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Job Title Section */}
            <div className="row mt-4">
              <p className="fw-bold">
                Job title <span style={requiredFieldStyle}>*</span>
              </p>
              {errors.jobTitle && (
                <div className="text-danger small">{errors.jobTitle}</div>
              )}
            </div>

            {/* Home Appliances */}
            <div className="row">
              <p>Home Appliances</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {[
                  "AC",
                  "Geyser",
                  "Microwave",
                  "Inverter & Stabilizers",
                  "Water Purifier",
                  "TV",
                  "Fridge",
                  "Washing Machine",
                  "Fan",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Home Appliances")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Electrician */}
            <div className="row mt-3">
              <p>Electrician</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {[
                  "Switch & Socket",
                  "Wiring",
                  "Doorbell",
                  "MCB & Submeter",
                  "Light and Wall light",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Electrician")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Carpentry */}
            <div className="row mt-3">
              <p>Carpentry</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {[
                  "Bed",
                  "Cupboard & Drawer",
                  "Door",
                  "Windows",
                  "Drill & Hang",
                  "Furniture",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Carpentry")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Plumbing */}
            <div className="row mt-3">
              <p>Plumbing</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {[
                  "Washbasin Installation",
                  "Blockage Removal",
                  "Shower",
                  "Toilet",
                  "Tap, Pipe works",
                  "Watertank & Motor",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Plumbing")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Service */}
            <div className="row mt-3">
              <p>Vehicle service</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {[
                  "Batteries",
                  "Health checkup",
                  "Water Wash",
                  "Denting & Painting",
                  "Tyre Service",
                  "Vehicle AC",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Vehicle service")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Care Taker */}
            <div className="row mt-3">
              <p>Care Taker</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {[
                  "Child Care",
                  "PhysioTheraphy",
                  "Old Age Care",
                  "Companion Support",
                  "Home Nursing",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Care Taker")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Cleaning */}
            <div className="row mt-3">
              <p>Cleaning</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {["Cleaning"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "Cleaning")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* CCTV */}
            <div className="row mt-3">
              <p>CCTV</p>
            </div>
            <div className="row">
              <div className="d-flex flex-wrap gap-3">
                {["CCTV"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn btn-outline-secondary ${
                      clickedButtons[item] ? "active" : ""
                    }`}
                    onClick={() => handleButtonClick(item, "CCTV")}
                  >
                    {item} {clickedButtons[item] && "✓"}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Details */}
            <div className="row mt-4">
              <p className="fw-bold">Address Details</p>
            </div>
            <div className="row">
              <div className="col-md-3">
                <label htmlFor="houseNumber" className="form-label">
                  House no/ Building name{" "}
                  <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  shadow-none ${
                    errors.houseNumber ? "is-invalid" : ""
                  }`}
                  name="houseNumber"
                  id="houseNumber"
                  required
                  placeholder="Enter House no/ Building name"
                  onChange={handleChange}
                  value={formData.houseNumber}
                />
                {errors.houseNumber && (
                  <div className="invalid-feedback">{errors.houseNumber}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="town" className="form-label">
                  Locality/ Town <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.town ? "is-invalid" : ""
                  }`}
                  name="town"
                  id="town"
                  required
                  placeholder="Enter Locality/ Town"
                  onChange={handleChange}
                  value={formData.town}
                />
                {errors.town && (
                  <div className="invalid-feedback">{errors.town}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="pincode" className="form-label">
                  Pin code <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  shadow-none${
                    errors.pincode ? "is-invalid" : ""
                  }`}
                  name="pincode"
                  id="pincode"
                  required
                  placeholder="Enter Pin code"
                  onChange={handleChange}
                  value={formData.pincode}
                  maxLength="6"
                />
                {errors.pincode && (
                  <div className="invalid-feedback">{errors.pincode}</div>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="row mt-4">
              <div className="col-md-3">
                <label htmlFor="nearbyLandmark" className="form-label">
                  Nearby Landmark <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.nearbyLandmark ? "is-invalid" : ""
                  }`}
                  name="nearbyLandmark"
                  id="nearbyLandmark"
                  required
                  placeholder="Enter Nearby Landmark"
                  onChange={handleChange}
                  value={formData.nearbyLandmark}
                />
                {errors.nearbyLandmark && (
                  <div className="invalid-feedback">
                    {errors.nearbyLandmark}
                  </div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="district" className="form-label">
                  District <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.district ? "is-invalid" : ""
                  }`}
                  name="district"
                  id="district"
                  required
                  placeholder="Enter District"
                  onChange={handleChange}
                  value={formData.district}
                />
                {errors.district && (
                  <div className="invalid-feedback">{errors.district}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="state" className="form-label">
                  State <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.state ? "is-invalid" : ""
                  }`}
                  name="state"
                  id="state"
                  required
                  placeholder="Enter State"
                  onChange={handleChange}
                  value={formData.state}
                />
                {errors.state && (
                  <div className="invalid-feedback">{errors.state}</div>
                )}
              </div>
            </div>

            {/* Identification Details */}
            <div className="row mt-4">
              <p className="fw-bold">Identification & Document</p>
            </div>
            <div className="row mb-4">
              <div className="col-md-3">
                <label htmlFor="aadharNumber" className="form-label">
                  Aadhar number <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.aadharNumber ? "is-invalid" : ""
                  }`}
                  name="aadharNumber"
                  id="aadharNumber"
                  required
                  placeholder="Enter Aadhar number"
                  onChange={handleChange}
                  value={formData.aadharNumber}
                  maxLength="12"
                />
                {errors.aadharNumber && (
                  <div className="invalid-feedback">{errors.aadharNumber}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="drivingLicenseNumber" className="form-label">
                  Driving license number
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${
                    errors.drivingLicenseNumber ? "is-invalid" : ""
                  }`}
                  name="drivingLicenseNumber"
                  id="drivingLicenseNumber"
                  placeholder="DL-XXXXXXXXXXXXXXX"
                  onChange={handleDrivingLicenseChange}
                  onFocus={() => setIsDrivingLicenseFocused(true)}
                  onBlur={() => setIsDrivingLicenseFocused(false)}
                  value={formData.drivingLicenseNumber}
                  maxLength="18"
                />
                {errors.drivingLicenseNumber && (
                  <div className="invalid-feedback">
                    {errors.drivingLicenseNumber}
                  </div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="joiningDate" className="form-label">
                  Joining date <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="date"
                  className={`form-control shadow-none ${
                    errors.joiningDate ? "is-invalid" : ""
                  }`}
                  name="joiningDate"
                  id="joiningDate"
                  required
                  onChange={handleChange}
                  value={formData.joiningDate}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.joiningDate && (
                  <div className="invalid-feedback">{errors.joiningDate}</div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="row mb-4">
              <div className="col">
                <button
                  type="submit"
                  className="btn px-5"
                  style={{ backgroundColor: "#0076CE", color: "white" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Loading...</span>
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditWorker;
