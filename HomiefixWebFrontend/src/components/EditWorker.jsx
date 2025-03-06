import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Import axios
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
        role: [],
        specification: [],
        language: [],
        profilePic: null,
    });
    const [previewImage, setPreviewImage] = useState(addWorker);

    // Fetch worker data and initialize clickedButtons
    useEffect(() => {
        const fetchWorkerData = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/workers/view/${id}`);
                const data = response.data;

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
            const updatedSpecifications = prevState.specification.includes(item)
                ? prevState.specification.filter((spec) => spec !== item)
                : [...prevState.specification, item];

            const updatedRoles = prevState.role.includes(roleHeading)
                ? prevState.role
                : [...prevState.role, roleHeading];

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
                    formDataToSend.append(key, formData[key].join(","));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.put(`http://localhost:2222/workers/update/${id}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the content type for file uploads
                },
            });

            console.log("Success:", response.data);
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
                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                <input type="tel" className="form-control" name="contactNumber" id="contactNumber" required placeholder="Enter Contact Number" value={formData.contactNumber} onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="eContactNumber" className="form-label">Emergency Contact Number</label>
                                <input
                                    type="tel" className="form-control" name="econtactNumber"
                                    id="eContactNumber"
                                    placeholder="Enter Emergency Contact Number"
                                    value={formData.econtactNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="row mt-4">
                            <div className="col-md-2">
                                <label htmlFor="language" className="form-label">Language</label>
                                <input type="text" className="form-control" name="language" id="language" placeholder="Enter Language" value={formData.language} onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="workExperience" className="form-label">Work Experience</label>
                                <input type="text" className="form-control" name="workExperience" id="workExperience" required placeholder="Enter Work Experience" value={formData.workExperience} onChange={handleChange} />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="dateOfBirth" className="form-label">D.O.B</label>
                                <input type="date" className="form-control" name="dateOfBirth" id="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} />
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="gender" className="form-label">Gender</label> <br />
                                <div className="form-check form-check-inline mt-2">
                                    <input className="form-check-input" type="radio" name="gender" id="male" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="male">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender" id="female" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
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