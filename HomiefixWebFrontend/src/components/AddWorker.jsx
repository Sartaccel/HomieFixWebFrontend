import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";
import addWorker from "../assets/addWorker.png";
import "../styles/AddWorker.css";

const AddWorker = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("recent");
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
        role: "", // Role will be determined by the heading (p tag)
        profilePic: null, // To store the selected image file
    });
    const [previewImage, setPreviewImage] = useState(addWorker); // To display the selected image preview

    const handleButtonClick = (item, roleHeading) => {
        setClickedButtons((prevState) => ({
            ...prevState,
            [item]: !prevState[item],
        }));
        setFormData((prevState) => ({
            ...prevState,
            role: roleHeading, // Set role to the heading (p tag)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            setFormData((prevState) => ({
                ...prevState,
                profilePic: file, // Store the file in state
            }));
            setPreviewImage(URL.createObjectURL(file)); // Set the preview image URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await fetch("http://localhost:2222/workers/add", {
                method: "POST",
                body: formDataToSend,
            });
            const data = await response.json();
            console.log("Success:", data);
            navigate("/worker-details");
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
                    <button
                        className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("recent")}
                    >
                        Worker Details
                    </button>
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
                        {/* Row 1 */}
                        <div className="row" style={{ maxWidth: "100%" }}>
                            <div className="col-md-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input type="text" className="form-control" name="name" id="name" placeholder="Enter Name" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" name="email" id="email" placeholder="Enter Email" onChange={handleChange} />
                            </div>
                            <div className="col-md-5">
                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                <input type="tel" className="form-control" name="contactNumber" id="contactNumber" placeholder="Enter Contact Number" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="row mt-4">
                            <div className="col-md-3">
                                <label htmlFor="eContactNumber" className="form-label">Emergency Contact Number</label>
                                <input type="tel" className="form-control" name="eContactNumber" id="eContactNumber" placeholder="Enter Emergency Contact Number" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="workExperience" className="form-label">Work Experience</label>
                                <input type="text" className="form-control" name="workExperience" id="workExperience" placeholder="Enter Work Experience" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="dateOfBirth" className="form-label">D.O.B</label>
                                <input type="date" className="form-control" name="dateOfBirth" id="dateOfBirth" onChange={handleChange} />
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="gender" className="form-label">Gender</label> <br />
                                <div className="form-check form-check-inline mt-2">
                                    <input className="form-check-input" type="radio" name="gender" id="male" value="Male" onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="male">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender" id="female" value="Female" onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="female">Female</label>
                                </div>
                            </div>
                        </div>

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
                                {["Bed", "Cupboard & Drawer", "Door", "Applience", "Windows", "Drill & Hang", "Furniture Repair"].map((item) => (
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
                                <input type="text" className="form-control" name="houseNumber" id="houseNumber" placeholder="Enter House no/ Building name" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="town" className="form-label">Locality/ Town</label>
                                <input type="text" className="form-control" name="town" id="town" placeholder="Enter Locality/ Town" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="pincode" className="form-label">Pin code</label>
                                <input type="text" className="form-control" name="pincode" id="pincode" placeholder="Enter Pin code" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="row mt-4">
                            <div className="col-md-3">
                                <label htmlFor="nearbyLandmark" className="form-label">Nearby Landmark</label>
                                <input type="text" className="form-control" name="nearbyLandmark" id="nearbyLandmark" placeholder="Enter Nearby Landmark" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="district" className="form-label">District</label>
                                <input type="text" className="form-control" name="district" id="district" placeholder="Enter District" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="state" className="form-label">State</label>
                                <input type="text" className="form-control" name="state" id="state" placeholder="Enter State" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Identification Details */}
                        <div className="row mt-4">
                            <p className="fw-bold">Identification & Document</p>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <label htmlFor="aadharNumber" className="form-label">Aadhar number</label>
                                <input type="text" className="form-control" name="aadharNumber" id="aadharNumber" placeholder="Enter Aadhar number" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="drivingLicenseNumber" className="form-label">Driving license number</label>
                                <input type="text" className="form-control" name="drivingLicenseNumber" id="drivingLicenseNumber" placeholder="Enter Driving license number" onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="joiningDate" className="form-label">Joining date</label>
                                <input type="date" className="form-control" name="joiningDate" id="joiningDate" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="row mb-4">
                            <div className="col">
                                <button type="submit" className="btn px-5" style={{ backgroundColor: "#0076CE", color: "white" }}>Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddWorker;