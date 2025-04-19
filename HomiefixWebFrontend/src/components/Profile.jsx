import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import addWorker from "../assets/addWorker.png";
import "../styles/AddWorker.css";
import Header from "./Header";
import api from "../api";


const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
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
    econtactNumber: "",
    language: [],
    profilePic: null,
    joiningDate: "",
  });
  const [previewImage, setPreviewImage] = useState(addWorker);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get(`/admin/${username}`);
        const data = response.data;


        setFormData({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          workExperience: data.workExperience,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          houseNumber: data.houseNo,
          town: data.town,
          pincode: data.pincode,
          nearbyLandmark: data.nearbyLandmark,
          district: data.district,
          state: data.state,
          econtactNumber: data.eContactNumber,
          language: data.language ? data.language.split(",") : [],
          profilePic: null,
          joiningDate: data.joiningDate,
        });


        if (data.profilePicUrl) {
          setPreviewImage(data.profilePicUrl);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };


    fetchProfileData();
  }, [username]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prevState) => ({
        ...prevState,
        profilePic: file,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);


    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", username);
      formDataToSend.append("eContactNumber", formData.econtactNumber);
      formDataToSend.append("houseNo", formData.houseNumber);
      formDataToSend.append("town", formData.town);
      formDataToSend.append("pincode", formData.pincode);
      formDataToSend.append("nearbyLandmark", formData.nearbyLandmark);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("state", formData.state);


      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }


      await api.post("/admin/completeProfile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      // After successful update, dispatch an event to notify Header
      const event = new CustomEvent('profileUpdated', {
        detail: { username }
      });
      window.dispatchEvent(event);


      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile details updated successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(`/profile/${username}`);
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile details. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: "80px" }}>
        <div className="d-flex gap-4 mx-2 align-items-center">
          <button
            className="btn btn-light p-2"
            style={{ marginBottom: "-20px" }}
            onClick={() => navigate(-1)}
          >
            <i
              className="bi bi-arrow-left"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            ></i>
          </button>
          <h5
            className="px-3 pb-3 text-black"
            style={{
              borderBottom: "4px solid #000",
              position: "relative",
              marginBottom: "-30px",
            }}
          >
            Profile Details
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
            className="container mt-2"
            style={{ marginLeft: "64px", maxWidth: "100%" }}
          >
            <p>Profile Photo</p>
            <div style={{ marginTop: "-5px" }}>
              <img
                src={previewImage}
                alt="profile"
                height={100}
                width={100}
                className="rounded-4"
              />
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
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
                  borderRadius: "2px",
                }}
              >
                Edit Profile
              </label>
            </div>
          </div>


          {/* Main container */}
          <div
            className="container mt-2"
            style={{ marginLeft: "60px", maxWidth: "100%" }}
          >
            {/* Row 1 */}
            <div className="row" style={{ maxWidth: "100%" }}>
              <div className="col-md-2">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  required
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "350px",
                    height: "40px",
                    border: "2px solid #E6E6E6",
                    background: "#F7F7F7",
                    color: "#636363",
                  }}
                  disabled
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "170px" }}>
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  id="contactNumber"
                  required
                  placeholder="Enter Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  style={{
                    width: "350px",
                    height: "40px",
                    border: "2px solid #E6E6E6",
                    background: "#F7F7F7",
                    color: "#636363",
                  }}
                  disabled
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="dateOfBirth" className="form-label">
                  Joining Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  required
                  value={formData.joiningDate}
                  onChange={handleChange}
                  style={{
                    width: "150px",
                    height: "40px",
                    border: "2px solid #E6E6E6",
                    background: "#F7F7F7",
                    color: "#636363",
                  }}
                  disabled
                />
              </div>
            </div>


            {/* Row 2 */}
            <div className="row mt-2">
              <div className="col-md-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  id="email"
                  required
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "350px",
                    height: "40px",
                    border: "2px solid #E6E6E6",
                    background: "#F7F7F7",
                    color: "#636363",
                  }}
                  disabled
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="econtactNumber" className="form-label">
                  Emergency Contact Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="econtactNumber"
                  id="econtactNumber"
                  required
                  placeholder="Emergency Contact Number"
                  value={formData.econtactNumber}
                  onChange={handleChange}
                  style={{ width: "350px", height: "40px" }}
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{ width: "150px", height: "40px" }}
                />
              </div>
            </div>


            {/* Address Details */}
            <div className="row mt-3">
              <p className="fw-bold">Address Details</p>
            </div>
            <div className="row" style={{ marginTop: "-5px" }}>
              <div className="col-md-3">
                <label htmlFor="houseNumber" className="form-label">
                  House no/ Building name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="houseNumber"
                  id="houseNumber"
                  required
                  placeholder="Enter House no/ Building name"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  style={{ width: "350px", height: "40px" }}
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="town" className="form-label">
                  Locality/ Town
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="town"
                  id="town"
                  required
                  placeholder="Enter Locality/ Town"
                  value={formData.town}
                  onChange={handleChange}
                  style={{ width: "350px", height: "40px" }}
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="pincode" className="form-label">
                  Pin code
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  id="pincode"
                  required
                  placeholder="Enter Pin code"
                  value={formData.pincode}
                  onChange={handleChange}
                  style={{ width: "150px", height: "40px" }}
                />
              </div>
            </div>


            {/* Row 2 */}
            <div className="row mt-2">
              <div className="col-md-3">
                <label htmlFor="nearbyLandmark" className="form-label">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nearbyLandmark"
                  id="nearbyLandmark"
                  required
                  placeholder="Enter Nearby Landmark"
                  value={formData.nearbyLandmark}
                  onChange={handleChange}
                  style={{ width: "350px", height: "40px" }}
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="district" className="form-label">
                  District
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="district"
                  id="district"
                  required
                  placeholder="Enter District"
                  value={formData.district}
                  onChange={handleChange}
                  style={{ width: "350px", height: "40px" }}
                />
              </div>
              <div className="col-md-3" style={{ marginLeft: "60px" }}>
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  id="state"
                  required
                  placeholder="Enter State"
                  value={formData.state}
                  onChange={handleChange}
                  style={{ width: "150px", height: "40px" }}
                />
              </div>
            </div>


            {/* Submit Button */}
            <div className="row mb-3 mt-3">
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


export default Profile;
