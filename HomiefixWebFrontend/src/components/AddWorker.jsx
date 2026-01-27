import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import addWorker from "../assets/addWorker.jpg";
import "../styles/AddWorker.css";
import Header from "./Header";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddWorker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Emoji & symbol blocker (covers almost all emojis)
  const containsEmoji = (text) =>
    /[\p{Extended_Pictographic}]/u.test(text);

  // Allowed patterns
  const validHouseAddress = /^[a-zA-Z0-9\s,./#\-()]*$/;
  const validTown = /^[a-zA-Z\s.\-]*$/;
  const validLandmark = /^[a-zA-Z0-9\s,.\-()]*$/;

  // Get worker data from navigation state with better error handling
  const workerDataFromEnquiry = location.state?.workerData || {};

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
    joiningDate: new Date().toISOString().split("T")[0],
    econtactNumber: "",
    role: [],
    specification: [],
    language: "",
    profilePic: null,
  });
  const [previewImage, setPreviewImage] = useState(addWorker);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDrivingLicenseFocused, setIsDrivingLicenseFocused] = useState(false);
  const [hasAutoFilledData, setHasAutoFilledData] = useState(false);
  // Length limits
  const MAX_LENGTHS = {
    name: 30,
    email: 30,
    contactNumber: 10,
    econtactNumber: 10,
    language: 20,
    workExperience: 5,
    houseNumber: 50,
    town: 50,
    nearbyLandmark: 100,
    district: 40,
    state: 40,
    pincode: 6,
    aadharNumber: 12,
    drivingLicenseNumber: 15,
  };

  // Auto-fill data from enquiry when component mounts
  useEffect(() => {
    if (workerDataFromEnquiry.name || workerDataFromEnquiry.contactNumber) {
      setFormData(prev => ({
        ...prev,
        name: workerDataFromEnquiry.name || "",
        contactNumber: workerDataFromEnquiry.contactNumber || "",
        email: workerDataFromEnquiry.email || "",
      }));
      setHasAutoFilledData(true);

      // Show success message for auto-fill
      Swal.fire({
        icon: 'success',
        title: 'Data Auto-filled',
        text: toast.success(
          `Worker data for ${workerDataFromEnquiry.name} has been auto-filled from enquiry.`
        ),

        timer: 1000,
        showConfirmButton: false
      });
    }
  }, [workerDataFromEnquiry]);

  const resetForm = () => {
    setFormData({
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
      joiningDate: new Date().toISOString().split('T')[0],
      econtactNumber: "",
      role: [],
      specification: [],
      language: "",
      profilePic: null,
    });
    setPreviewImage(addWorker);
    setClickedButtons({});
    setErrors({});
    setIsDrivingLicenseFocused(false);
    setHasAutoFilledData(false);
  };

  const validateName = (name) => /^[a-zA-Z\s]*$/.test(name);
  const validateContactNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.com$/.test(email);
  const validateLanguage = (language) => language && language.trim() !== "";
  const validatePincode = (pincode) => /^\d{6}$/.test(pincode);
  const validateDistrict = (district) => /^[a-zA-Z\s]*$/.test(district);
  const validateState = (state) => /^[a-zA-Z\s]*$/.test(state);
  const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
  const validateDrivingLicense = (license) =>
    !license || /[a-zA-Z0-9]{15}$/.test(license);
  const validateWorkExperience = (experience) =>
    /^\d+(\.\d{1,2})?$/.test(experience);
  const validateDate = (dateString, isDOB = false) => {
    if (!dateString) return false;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const today = new Date();

    if (isDOB) {
      const MIN_YEAR = 1966; // 60 years in 2026
      const MAX_YEAR = 2008; // 18 years in 2026

      return year >= MIN_YEAR && year <= MAX_YEAR;
    }

    // For joining date or others
    return date <= today;
  };


  const handleButtonClick = (item, roleHeading) => {
    setClickedButtons((prev) => ({ ...prev, [item]: !prev[item] }));
    setFormData((prev) => ({
      ...prev,
      role: prev.role.includes(roleHeading)
        ? prev.role
        : [...prev.role, roleHeading],
      specification: prev.specification.includes(item)
        ? prev.specification.filter((spec) => spec !== item)
        : [...prev.specification, item],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";


    // Length validation (generic)
    if (MAX_LENGTHS[name] && value.length > MAX_LENGTHS[name]) {
      return;
    }

    //  Block emoji characters for ALL fields
    if (containsEmoji(value)) {
      return;
    }

    // Limit Name field to max 30 characters
    if (name === "name" && value.length > 30) {
      return;
    }

    // Prevent changes to joining date
    if (name === "joiningDate") {
      Swal.fire({
        icon: 'info',
        title: 'Joining Date',
        text: toast.info("Joining date is automatically set to today and cannot be changed."),
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    if (
      name === "language" &&
      (!/^[A-Za-z, ]*$/.test(value) || (value.match(/ /g) || []).length > 3)
    ) {
      return;
    }

    // Block emoji characters for ALL fields
    if (containsEmoji(value)) {
      return;
    }


    setFormData({ ...formData, [name]: value });

    switch (name) {
      case "name":
        error =
          value.length > MAX_LENGTHS.name
            ? "Name cannot exceed 30 characters"
            : !validateName(value)
              ? "Name should only contain alphabets and spaces"
              : "";
        break;

      case "contactNumber":
      case "econtactNumber":
        error =
          value.length !== MAX_LENGTHS.contactNumber
            ? "Contact number should be exactly 10 digits"
            : "";
        break;

      case "workExperience":
        error =
          value.length > MAX_LENGTHS.workExperience
            ? "Work experience is too large"
            : !validateWorkExperience(value)
              ? "Work experience should contain only numbers"
              : "";
        break;

      case "email":
        error =
          value.length > MAX_LENGTHS.email
            ? "Email cannot exceed 50 characters"
            : value && !validateEmail(value)
              ? "Please enter a valid email address"
              : "";
        break;

      case "pincode":
        if (!value) {
          error = "Pincode is required";
        } else if (/[a-zA-Z]/.test(value)) {
          error = "Only numeric digits are allowed in pincode";
        } else if (value.length !== MAX_LENGTHS.pincode) {
          error = "Pincode should be exactly 6 digits";
        } else if (!validatePincode(value)) {
          error = "Pincode should be exactly 6 digits";
        } else {
          error = "";
        }
        break;

      case "district":
        error =
          value.length > MAX_LENGTHS.district
            ? "District cannot exceed 50 characters"
            : !validateDistrict(value)
              ? "District should only contain alphabets"
              : "";
        break;

      case "state":
        error =
          value.length > MAX_LENGTHS.state
            ? "State cannot exceed 50 characters"
            : !validateState(value)
              ? "State should only contain alphabets"
              : "";
        break;

      case "aadharNumber":
        if (!value) {
          error = "Aadhar number is required";
        } else if (/[a-zA-Z]/.test(value)) {
          error = "Only numeric digits are allowed in Aadhar number";
        } else if (value.length !== MAX_LENGTHS.aadharNumber) {
          error = "Aadhar number should be exactly 12 digits";
        } else if (!validateAadhar(value)) {
          error = "Aadhar number should be 12 digits";
        } else {
          error = "";
        }
        break;


      case "drivingLicenseNumber":
        error =
          value.length > MAX_LENGTHS.drivingLicenseNumber
            ? "License cannot exceed 15 characters"
            : value && !validateDrivingLicense(value)
              ? "License should be 15 alphanumeric characters"
              : "";
        break;

      case "dateOfBirth":
      case "joiningDate":
        error =
          value && !validateDate(value) ? "Date cannot be in the future" : "";
        break;
      case "language":
        error =
          value.length > MAX_LENGTHS.language
            ? "Language cannot exceed 30 characters"
            : !validateLanguage(value)
              ? "Language is required"
              : "";
        break;


      case "houseNumber":
        error =
          value.length > MAX_LENGTHS.houseNumber
            ? "House address cannot exceed 100 characters"
            : !validHouseAddress.test(value)
              ? "Only letters, numbers, spaces and , . / # - ( ) are allowed"
              : "";
        break;


      case "town":
        error =
          value.length > MAX_LENGTHS.town
            ? "Town cannot exceed 50 characters"
            : !validTown.test(value)
              ? "Only letters, spaces, dot and hyphen are allowed"
              : "";
        break;


      case "nearbyLandmark":
        error =
          value.length > MAX_LENGTHS.nearbyLandmark
            ? "Nearby landmark cannot exceed 100 characters"
            : !validLandmark.test(value)
              ? "Only letters, numbers, spaces and , . - ( ) are allowed"
              : "";
        break;


    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrivingLicenseChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9]/g, "");
    if (value.length > 18) {
      value = value.substring(0, 18);
    }

    setFormData((prev) => ({ ...prev, drivingLicenseNumber: value }));
    setErrors((prev) => ({
      ...prev,
      drivingLicenseNumber:
        value && !validateDrivingLicense(value)
          ? "License should be 15 alphanumeric characters"
          : "",
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profilePic: "Only JPG, PNG images are allowed",
      }));
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePic: "File size should be less than 1MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, profilePic: "" }));

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onload = (event) => setPreviewImage(event.target.result);
    reader.onerror = () => {
      console.error("Error reading file");
      setPreviewImage(addWorker);
    };
    reader.readAsDataURL(file);
    setFormData((prev) => ({ ...prev, profilePic: file }));
  };

  const checkContactNumberExists = async (contactNumber) => {
    try {
      const response = await api.get(`/workers/check-contact`, {
        params: { contactNumber },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking contact number:", error);
      return false;
    }
  };

  const checkEmailExists = async (email) => {
    try {
      if (!email) return false; // Skip check if email is empty
      const response = await api.get(`/workers/view`);
      const workers = response.data;
      const emailExists = workers.some(
        (worker) =>
          worker.email && worker.email.toLowerCase() === email.toLowerCase()
      );
      return emailExists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Add job title validation
    if (formData.specification.length === 0) {
      newErrors.jobTitle = "Please select at least one job title";
      isValid = false;
    }

    if (
      formData.workExperience &&
      !validateWorkExperience(formData.workExperience)
    ) {
      newErrors.workExperience = "Work experience should contain only numbers";
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
      newErrors.dateOfBirth =
        "Worker age must be between 18 and 60 years";
      isValid = false;
    }


    if (!validateLanguage(formData.language)) {
      newErrors.language = "Please enter at least one language";
      isValid = false;
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = "House number/Building Name is required";
      isValid = false;
    }

    if (!formData.town.trim()) {
      newErrors.town = "Locality/Town is required";
      isValid = false;
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
      isValid = false;
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = "Pincode should be 6 digits";
      isValid = false;
    }

    if (!formData.nearbyLandmark.trim()) {
      newErrors.nearbyLandmark = "Nearby Landmark is required";
      isValid = false;
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
      isValid = false;
    } else if (!validateDistrict(formData.district)) {
      newErrors.district = "District should only contain alphabets";
      isValid = false;
    }

    if (!formData.state.trim()) {
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
        "License should be 15 alphanumeric characters";
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

    // Clear previous errors
    setErrors({});
    if (!formData.profilePic) {
      Swal.fire({
        icon: "error",
        title: "Profile Picture Required",
        text: "Please upload a profile picture before submitting."
      });
      setIsLoading(false);
      return;
    }

    // Validate all fields first
    if (!validateForm()) {
      setIsLoading(false);

      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }

      return;
    }

    // Additional validations
    if (formData.contactNumber === formData.econtactNumber) {
      setErrors(prev => ({
        ...prev,
        econtactNumber: "Contact Number and Emergency Contact Number cannot be the same."
      }));
      setIsLoading(false);

      // Scroll to the error
      const element = document.getElementById("eContactNumber");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    try {
      // Check if email already exists
      if (formData.email) {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          setErrors(prev => ({
            ...prev,
            email: "This email is already associated with another worker."
          }));
          setIsLoading(false);

          // Scroll to the error
          const element = document.getElementById("email");
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
          return;
        }
      }

      // Check if contact number exists
      const isContactNumberAvailable = await checkContactNumberExists(formData.contactNumber);
      if (!isContactNumberAvailable) {
        setErrors(prev => ({
          ...prev,
          contactNumber: "Contact number is already in use by an active worker."
        }));
        setIsLoading(false);

        // Scroll to the error
        const element = document.getElementById("contactNumber");
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
        return;
      }

      // Prepare form data for submission
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "specification" || key === "role") {
          formDataToSend.append(key, formData[key].join(","));
        } else if (key === "econtactNumber") {
          formDataToSend.append("eContactNumber", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      // Submit the form
      const response = await api.post("/workers/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Worker added successfully!",
      }).then(() => {
        navigate("/worker-details");
        resetForm();
      });

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add worker. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Validate job titles first
  //   if (formData.specification.length === 0) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please select at least one job title before submitting.",
  //     });
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (!validateForm()) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (formData.contactNumber === formData.econtactNumber) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Contact Number and Emergency Contact Number cannot be the same.",
  //     });
  //     setIsLoading(false);
  //     return;
  //   }

  //   // Check if email already exists
  //   if (formData.email) {
  //     const emailExists = await checkEmailExists(formData.email);
  //     if (emailExists) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "This email is already associated with another worker.",
  //       });
  //       setIsLoading(false);
  //       return;
  //     }
  //   }

  //   const isContactNumberAvailable = await checkContactNumberExists(
  //     formData.contactNumber
  //   );
  //   if (!isContactNumberAvailable) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Contact number is already in use by an active worker.",
  //     });
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     if (!formData.profilePic) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Profile Picture Required",
  //         text: "Please upload a profile picture before submitting.",
  //       });
  //       return;
  //     }
  //     const formDataToSend = new FormData();
  //     for (const key in formData) {
  //       if (key === "specification" || key === "role") {
  //         formDataToSend.append(key, formData[key].join(","));
  //       } else if (key === "econtactNumber") {
  //         formDataToSend.append("eContactNumber", formData[key]);
  //       } else {
  //         formDataToSend.append(key, formData[key]);
  //       }
  //     }

  //     const response = await api.post("/workers/add", formDataToSend, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "Worker added successfully!",
  //     }).then(() => {
  //       navigate("/worker-details");
  //       resetForm();
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to add worker. Please try again.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Style for required field asterisk
  const requiredFieldStyle = {
    color: "#B8141A",
    marginLeft: "2px",
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={1000} />
      <div className="container-fluid" style={{ paddingTop: "80px" }}>
        <div className="d-flex gap-4 mx-2 align-items-center">
          <button
            className="btn btn-light p-2"
            style={{ marginBottom: "-20px" }}
            onClick={() => navigate(`/worker-details`)}
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
            Add Worker
          </h5>
        </div>

        {/* Show auto-fill notification if data is passed from enquiry */}
        {/* {hasAutoFilledData && (
          <div className="alert alert-info mt-3 d-flex align-items-center" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            <div>
              <strong>Data auto-filled from enquiry</strong>
              <div className="small">
                Name: <strong>{workerDataFromEnquiry.name}</strong>
                {workerDataFromEnquiry.contactNumber && ` | Contact: ${workerDataFromEnquiry.contactNumber}`}
              </div>
            </div>
          </div>
        )} */}
      </div>

      <div
        className="container-fluid"
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
            <p>
  Profile Photo <span style={{ color: "#B8141A" }}>*</span>
</p>

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
                className="btn"
                style={{
                  display: "inline-block",
                  marginLeft: "105px",
                  marginTop: "-70px",
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
                  className={`form-control shadow-none ${errors.name ? "is-invalid" : ""
                    }`}
                  name="name"
                  id="name"
                  placeholder="Enter Name"
                  onChange={handleChange}
                  value={formData.name}
                  maxLength="30"
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
                  className={`form-control  shadow-none ${errors.email ? "is-invalid" : ""
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
                  className={`form-control shadow-none ${errors.contactNumber ? "is-invalid" : ""
                    }`}
                  name="contactNumber"
                  id="contactNumber"
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
                  className={`form-control shadow-none ${errors.econtactNumber ? "is-invalid" : ""
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
                <label htmlFor="language" className="form-label">
                  Language <span style={requiredFieldStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control shadow-none ${errors.language ? "is-invalid" : ""
                    }`}
                  name="language"
                  id="language"
                  placeholder="Enter Language"
                  onChange={handleChange}
                  value={formData.language}
                />
                {errors.language && (
                  <div className="invalid-feedback">{errors.language}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="workExperience" className="form-label">
                  Work Experience
                </label>
                <input
                  type="number"
                  min="0"
                  className={`form-control shadow-none ${errors.workExperience ? "is-invalid" : ""
                    }`}
                  name="workExperience"
                  id="workExperience"
                  placeholder="Enter Work Experience"
                  onChange={handleChange}
                  value={formData.workExperience}
                  onKeyDown={(e) => {
                    // Prevent entering negative numbers
                    if (
                      e.key === "-" ||
                      e.key === "+" ||
                      e.key === "e" ||
                      e.key === "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
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
                  type="date"
                  className={`form-control shadow-none ${errors.dateOfBirth ? "is-invalid" : ""
                    }`}
                  name="dateOfBirth"
                  id="dateOfBirth"
                  onChange={handleChange}
                  value={formData.dateOfBirth}

                  placeholder="dd-mm-yyyy"
                  style={{ color: formData.dateOfBirth ? "#000" : "#aaa" }}
                  // max={
                  //   new Date(
                  //     new Date().setFullYear(new Date().getFullYear() - 18)
                  //   )
                  //     .toISOString()
                  //     .split("T")[0]
                  // }
                  min="1966-01-01"
                  max="2008-12-31"
                />
                {errors.dateOfBirth && (
                  <div className="invalid-feedback">{errors.dateOfBirth}</div>
                )}
              </div>

              <div className="col-md-2">
                <label htmlFor="gender" className="form-label">
                  Gender&nbsp;
                  <span style={{ color: "red" }}>*</span>
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
                {errors.gender && (
                  <div className="text-danger" style={{ fontSize: "0.875em" }}>
                    {errors.gender}
                  </div>
                )}
              </div>
            </div>

            {/* Job Title Section */}
            <div className="row mt-4">
              <p className="fw-bold">
                Job title<span style={requiredFieldStyle}>*</span>
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                    className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""
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
                  className={`form-control shadow-none ${errors.houseNumber ? "is-invalid" : ""
                    }`}
                  name="houseNumber"
                  id="houseNumber"
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
                  className={`form-control shadow-none ${errors.town ? "is-invalid" : ""
                    }`}
                  name="town"
                  id="town"
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
                  className={`form-control shadow-none ${errors.pincode ? "is-invalid" : ""
                    }`}
                  name="pincode"
                  id="pincode"
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
                  className={`form-control shadow-none ${errors.nearbyLandmark ? "is-invalid" : ""
                    }`}
                  name="nearbyLandmark"
                  id="nearbyLandmark"
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
                  className={`form-control shadow-none ${errors.district ? "is-invalid" : ""
                    }`}
                  name="district"
                  id="district"
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
                  className={`form-control shadow-none ${errors.state ? "is-invalid" : ""
                    }`}
                  name="state"
                  id="state"
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
                  className={`form-control shadow-none ${errors.aadharNumber ? "is-invalid" : ""
                    }`}
                  name="aadharNumber"
                  id="aadharNumber"
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
                  className={`form-control shadow-none ${errors.drivingLicenseNumber ? "is-invalid" : ""
                    }`}
                  name="drivingLicenseNumber"
                  id="drivingLicenseNumber"
                  placeholder="YYXXXXXXXXXXXXX"
                  onChange={handleDrivingLicenseChange}
                  onFocus={() => {
                    setIsDrivingLicenseFocused(true);
                    if (!formData.drivingLicenseNumber) {
                      setFormData((prev) => ({
                        ...prev,
                        drivingLicenseNumber: "",
                      }));
                    }
                  }}
                  onBlur={() => setIsDrivingLicenseFocused(false)}
                  value={formData.drivingLicenseNumber}
                  maxLength="15"
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
                  className={`form-control shadow-none ${errors.joiningDate ? "is-invalid" : ""
                    }`}
                  name="joiningDate"
                  id="joiningDate"
                  onChange={handleChange}
                  value={formData.joiningDate}
                  placeholder="dd-mm-yyyy"
                  style={{ color: formData.joiningDate ? "#000" : "#aaa" }}
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
                    "Submit"
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

export default AddWorker;