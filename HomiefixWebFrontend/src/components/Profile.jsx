import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import addWorker from "../assets/addWorker.png";
import "../styles/AddWorker.css";
import Header from "./Header";

const Profile = () => {
   const { id } = useParams();
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
   });
   const [previewImage, setPreviewImage] = useState(addWorker);

   // Fetch profile data
   useEffect(() => {
       const fetchProfileData = async () => {
           try {
               const response = await axios.get(`http://localhost:2222/profile/view/${id}`);
               const data = response.data;

               // Initialize formData
               setFormData({
                   ...data,
                   language: data.language ? data.language.split(",") : [],
               });

               // Set preview image
               setPreviewImage(data.profilePicUrl || addWorker);
           } catch (error) {
               console.error("Error fetching profile data:", error);
           }
       };

       fetchProfileData();
   }, [id]);

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
           setFormData((prevState) => ({
               ...prevState,
               profilePic: file,
           }));
           setPreviewImage(URL.createObjectURL(file));
       }
   };

   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           const formDataToSend = new FormData();
           for (const key in formData) {
               if (key === "language") {
                   formDataToSend.append(key, formData[key].join(","));
               } else {
                   formDataToSend.append(key, formData[key]);
               }
           }

           const response = await axios.put(`http://localhost:2222/profile/update/${id}`, formDataToSend, {
               headers: {
                   "Content-Type": "multipart/form-data", // Set the content type for file uploads
               },
           });

           // Show success message using SweetAlert2
           Swal.fire({
               icon: "success",
               title: "Success!",
               text: "Profile details updated successfully.",
               confirmButtonText: "OK",
           }).then(() => {
               navigate(`/profile/${id}`); // Navigate after confirmation
           });
       } catch (error) {
           console.error("Error:", error);

           // Show error message using SweetAlert2
           Swal.fire({
               icon: "error",
               title: "Error",
               text: "Failed to update profile details. Please try again.",
               confirmButtonText: "OK",
           });
       }
   };

   return (
       <>
           {/* Navbar */}
           <Header/>

           {/* Scrollable Content */}
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
                   <h5 className="px-3 pb-3 text-black"
                       style={{
                           borderBottom: "4px solid #000",
                           position: "relative",
                           marginBottom: "-30px"
                       }}>
                       Profile Details
                   </h5>
               </div>
           </div>

           <div className="container" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden", marginTop: "20px" }}>
               <form onSubmit={handleSubmit}>
                   {/* Profile Photo */}
                   <div className="container mt-4" style={{ marginLeft: "64px", maxWidth: "100%" }}>
                       <p>Profile Photo</p>
                       <div>
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
                           <label htmlFor="profilePic" className="btn mx-5" style={{ marginTop: "63px", borderColor: "#0076CE", color: "#0076CE" }}>
                               Upload Photo
                           </label>
                       </div>
                   </div>

                   {/* Main container */}
                   <div className="container mt-4" style={{ marginLeft: "60px", maxWidth: "100%" }}>
                       {/* Row 1 */}
                       <div className="row" style={{ maxWidth: "100%" }}>
                           <div className="col-md-2">
                               <label htmlFor="name" className="form-label">Full Name</label>
                               <input type="text" className="form-control" name="name" id="name" required placeholder="Enter Name" value={formData.name} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="email" className="form-label">Email</label>
                               <input type="email" className="form-control" name="email" id="email" required placeholder="Enter Email" value={formData.email} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="dateOfBirth" className="form-label">Joining Date</label>
                               <input type="date" className="form-control" name="dateOfBirth" id="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} />
                           </div>
                       </div>

                       {/* Row 2 */}
                       <div className="row mt-4">
                           <div className="col-md-2">
                               <label htmlFor="language" className="form-label">Email Id</label>
                               <input type="text" className="form-control" name="language" id="language" placeholder="Enter Language" value={formData.language} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="workExperience" className="form-label">Emergency Contact Number</label>
                               <input type="text" className="form-control" name="workExperience" id="workExperience" required placeholder="Enter Work Experience" value={formData.workExperience} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="dateOfBirth" className="form-label">D.O.B</label>
                               <input type="date" className="form-control" name="dateOfBirth" id="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} />
                           </div>
                           
                       </div>

                       {/* Address Details */}
                       <div className="row mt-4">
                           <p className="fw-bold">Address Details</p>
                       </div>
                       <div className="row">
                           <div className="col-md-3">
                               <label htmlFor="houseNumber" className="form-label">House no/ Building name</label>
                               <input type="text" className="form-control" name="houseNumber" id="houseNumber" required placeholder="Enter House no/ Building name" value={formData.houseNumber} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="town" className="form-label">Locality/ Town</label>
                               <input type="text" className="form-control" name="town" id="town" required placeholder="Enter Locality/ Town" value={formData.town} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="pincode" className="form-label">Pin code</label>
                               <input type="text" className="form-control" name="pincode" id="pincode" required placeholder="Enter Pin code" value={formData.pincode} onChange={handleChange} />
                           </div>
                       </div>

                       {/* Row 2 */}
                       <div className="row mt-4">
                           <div className="col-md-3">
                               <label htmlFor="nearbyLandmark" className="form-label">Nearby Landmark</label>
                               <input type="text" className="form-control" name="nearbyLandmark" id="nearbyLandmark" required placeholder="Enter Nearby Landmark" value={formData.nearbyLandmark} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="district" className="form-label">District</label>
                               <input type="text" className="form-control" name="district" id="district" required placeholder="Enter District" value={formData.district} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="state" className="form-label">State</label>
                               <input type="text" className="form-control" name="state" id="state" required placeholder="Enter State" value={formData.state} onChange={handleChange} />
                           </div>
                       </div>

                       {/* Submit Button */}
                       <div className="row mb-4 mt-4">
                           <div className="col">
                               <button type="submit" className="btn px-5" style={{ backgroundColor: "#0076CE", color: "white" }}>Update</button>
                           </div>
                       </div>
                   </div>
               </form>
           </div>
       </>
   );
};

export default Profile;