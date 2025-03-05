import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import addWorker from "../assets/addWorker.png";
import "../styles/AddWorker.css";


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
       role: [], // Change to an array to store multiple roles
       specification: [], // Array to store multiple specifications
       language: [],
       profilePic: null,
   });
   const [previewImage, setPreviewImage] = useState(addWorker);


   // Fetch worker data and initialize clickedButtons
   useEffect(() => {
       const fetchWorkerData = async () => {
           try {
               const response = await fetch(`http://localhost:2222/workers/view/${id}`);
               if (!response.ok) {
                   throw new Error("Failed to fetch worker data");
               }
               const data = await response.json();


               // Initialize formData
               setFormData({
                   ...data,
                   role: data.role ? data.role.split(",") : [], // Convert role string to array
                   specification: data.specification ? data.specification.split(",") : [],
                   language: data.language ? data.language.split(",") : [],
               });


               // Initialize clickedButtons based on specification
               const initialClickedButtons = {};
               if (data.specification) {
                   data.specification.split(",").forEach((item) => {
                       initialClickedButtons[item] = true;
                   });
               }
               setClickedButtons(initialClickedButtons);


               // Set preview image
               setPreviewImage(data.profilePicUrl || addWorker);
           } catch (error) {
               console.error("Error fetching worker data:", error);
           }
       };


       fetchWorkerData();
   }, [id]);


   const handleButtonClick = (item, roleHeading) => {
       setClickedButtons((prevState) => ({
           ...prevState,
           [item]: !prevState[item],
       }));
  
       setFormData((prevState) => {
           // Update specifications
           const updatedSpecifications = prevState.specification.includes(item)
               ? prevState.specification.filter((spec) => spec !== item) // Remove if already exists
               : [...prevState.specification, item];
  
           let updatedRoles = [...prevState.role];
  
           if (!updatedSpecifications.includes(item)) {
               const hasOtherSpecsForRole = updatedSpecifications.some(
                   (spec) => spec.startsWith(roleHeading)
               );
  
               if (!hasOtherSpecsForRole) {
                   updatedRoles = updatedRoles.filter((role) => role !== roleHeading);
               }
           } else {
               if (!updatedRoles.includes(roleHeading)) {
                   updatedRoles.push(roleHeading);
               }
           }
  
           return {
               ...prevState,
               role: updatedRoles,
               specification: updatedSpecifications,
           };
       });
   };


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
               if (key === "specification" || key === "role" || key === "language") {
                   // Convert the array to a comma-separated string
                   formDataToSend.append(key, formData[key].join(","));
               } else {
                   formDataToSend.append(key, formData[key]);
               }
           }


           const response = await fetch(`http://localhost:2222/workers/update/${id}`, {
               method: "PUT",
               body: formDataToSend,
           });
           const data = await response.json();
           console.log("Success:", data);
           navigate(`/worker-details/worker/${id}`);
       } catch (error) {
           console.error("Error:", error);
       }
   };


   return (
       <>
           {/* Navbar */}
           <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
               <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Worker Details</h2>
               <div className="header-right d-flex align-items-center gap-3">
                   <div className="input-group" style={{ width: "300px" }}>
                       <input type="text" className="form-control search-bar" placeholder="Search" />
                       <span className="input-group-text">
                           <img src={search} alt="Search" width="20" />
                       </span>
                   </div>
                   <img src={notification} alt="Notifications" width="40" className="cursor-pointer" />
                   <img src={profile} alt="Profile" width="40" className="cursor-pointer" />
               </div>
           </header>


           {/* Scrollable Content */}
           <div className="container" style={{ paddingTop: "80px" }}>
               <div className="d-flex gap-4 mx-2 align-items-center">
                   <button className="btn" onClick={() => navigate(-1)}>
                       <span style={{ fontSize: "20px" }}>←</span>
                   </button>
                   <h5 className="px-3 pb-2 text-black"
                       style={{
                           borderBottom: "4px solid #000",
                           position: "relative",
                           marginBottom: "-11px"
                       }}>
                       Edit Worker Details
                   </h5>
               </div>
           </div>


           <div className="container" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}>
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
                           <label htmlFor="profilePic" className="btn  mx-5" style={{ marginTop: "63px", borderColor: "#0076CE", color: "#0076CE" }}>
                               Upload Photo
                           </label>
                       </div>
                   </div>


                   {/* Main container */}
                   <div className="container mt-4" style={{ marginLeft: "60px", maxWidth: "100%" }}>
                       {/* Job Title Section */}
                       <div className="row mt-4">
                           <p className="fw-bold">Job title</p>
                       </div>


                       {/* Home Appliances */}
                       <div className="row">
                           <p>Home Appliances</p>
                       </div>
                       <div className="row">
                           <div className="d-flex flex-wrap gap-3">
                               {["AC", "Geyser", "Microwave", "Inverter & Stabilizers", "Water Purifier", "TV", "Fridge", "Washing Machine", "Fan"].map((item) => (
                                   <button
                                       key={item}
                                       type="button"
                                       className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""}`}
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
                               {["Switch & Socket", "Wiring", "Doorbell", "Appliance", "MCB & Submeter", "Light and Wall light", "CCTV"].map((item) => (
                                   <button
                                       key={item}
                                       type="button"
                                       className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""}`}
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
                               {["Bed", "Cupboard & Drawer", "Door", "Windows", "Drill & Hang", "Furniture Repair"].map((item) => (
                                   <button
                                       key={item}
                                       type="button"
                                       className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""}`}
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
                               {["Washbasin Installation", "Blockage Removal", "Shower", "Toilet", "Tap, Pipe works", "Water tank & Motor"].map((item) => (
                                   <button
                                       key={item}
                                       type="button"
                                       className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""}`}
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
                               {["Batteries", "Health checkup", "Wash & Cleaning", "Denting & Painting", "Wheel car", "Vehicle AC"].map((item) => (
                                   <button
                                       key={item}
                                       type="button"
                                       className={`btn btn-outline-secondary ${clickedButtons[item] ? "active" : ""}`}
                                       onClick={() => handleButtonClick(item, "Vehicle service")}
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


                       {/* Identification Details */}
                       <div className="row mt-4">
                           <p className="fw-bold">Identification & Document</p>
                       </div>
                       <div className="row mb-4">
                           <div className="col-md-3">
                               <label htmlFor="aadharNumber" className="form-label">Aadhar number</label>
                               <input type="text" className="form-control" name="aadharNumber" id="aadharNumber" required placeholder="Enter Aadhar number" value={formData.aadharNumber} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="drivingLicenseNumber" className="form-label">Driving license number</label>
                               <input type="text" className="form-control" name="drivingLicenseNumber" id="drivingLicenseNumber" placeholder="Enter Driving license number" value={formData.drivingLicenseNumber} onChange={handleChange} />
                           </div>
                           <div className="col-md-3">
                               <label htmlFor="joiningDate" className="form-label">Joining date</label>
                               <input type="date" className="form-control" name="joiningDate" id="joiningDate" required value={formData.joiningDate} onChange={handleChange} />
                           </div>
                       </div>


                       {/* Submit Button */}
                       <div className="row mb-4">
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


export default EditWorker;