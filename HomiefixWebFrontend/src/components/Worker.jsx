import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./Header";
import ComingSoon from "./ComingSoon";

const Worker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("serviceDetails");

  // State for worker data
  const [workerData, setWorkerData] = useState(null);

  // State for bookings
  const [serviceDetailsData, setServiceDetailsData] = useState([]);
  const [inProgressData, setInProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch worker data
  useEffect(() => {
    axios
      .get(`http://localhost:2222/workers/view/${id}`)
      .then((response) => {
        setWorkerData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching worker data:", error);
      });
  }, [id]);

  // Fetch worker bookings
  useEffect(() => {
    if (!workerData) return; // Ensure workerData is available

    const fetchWorkerBookings = () => {
      axios
        .get(`http://localhost:2222/booking/worker/${id}`)
        .then((response) => {
          const data = response.data;

          // Filter data based on booking status
          const completedBookings = data.filter(
            (booking) => booking.bookingStatus === "COMPLETED"
          );
          const inProgressBookings = data.filter(
            (booking) =>
              booking.bookingStatus === "ASSIGNED" ||
              booking.bookingStatus === "STARTED" ||
              booking.bookingStatus === "RESCHEDULED"
          );

          // Map backend data to frontend format
          const mappedCompletedBookings = completedBookings.map((booking) => ({
            id: booking.id,
            service: booking.worker?.role || "N/A",
            name: booking.worker?.name || "N/A",
            phone: booking.worker?.contactNumber || "N/A",
            date: booking.bookedDate,
            rating: booking.worker?.averageRating || 0,
            status: booking.bookingStatus,
          }));

          const mappedInProgressBookings = inProgressBookings.map((booking) => ({
            id: booking.id,
            service: booking.worker?.role || "N/A",
            name: booking.worker?.name || "N/A",
            phone: booking.worker?.contactNumber || "N/A",
            date: booking.bookedDate,
            status: booking.bookingStatus,
          }));

          // Update state
          setServiceDetailsData(mappedCompletedBookings);
          setInProgressData(mappedInProgressBookings);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching worker bookings:", error);
          setLoading(false);
        });
    };

    fetchWorkerBookings();
  }, [id, workerData]); // Add workerData as a dependency

  const handleDeleteWorker = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:2222/workers/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Worker has been removed.", "success");
            navigate("/worker-details");
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete worker.", "error");
          });
      }
    });
  };

  return (
    <div className="col-12 p-0 m-0 d-flex flex-column">
      {/* Navbar */}
      <Header />

      <div className="navigation-bar d-flex justify-content-between align-items-center py-3 px-3 bg-white border-bottom w-100">
        <div className="d-flex gap-3 align-items-center">
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
            className="px-3 pb-3 text-black mx-1"
            style={{
              borderBottom: "4px solid #000",
              position: "relative",
              marginBottom: "-38px",
            }}
          >
            Worker Details
          </h5>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ marginTop: "150px" }}>
        <div className="row">
          {/* Worker Details Section */}
          <div
            className="col-4 border p-3 mt-4 rounded align-self-start h-auto d-flex flex-column"
            style={{ marginLeft: "70px", marginRight: "10px" }}
          >
            {loading ? (
              <>
                <Skeleton height={30} width={200} />
                <Skeleton height={100} width={100} className="my-3" />
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={150} />
              </>
            ) : (
              <>
                {/* Role Section */}
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-wrap">
                    <p>Role:</p>
                    {workerData.role.split(",").map((role, index) => (
                      <p
                        key={index}
                        className="border border-dark rounded-pill mx-1 px-2"
                      >
                        {role.trim()}
                      </p>
                    ))}
                  </div>
                  <div>
                    <a
                      className="text-decoration-none"
                      style={{ color: "#0076CE" }}
                      href={`/worker-details/worker/edit/${id}`}
                    >
                      Edit
                    </a>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="row">
                  <div className="d-flex">
                    <div>
                      <img
                        className="rounded"
                        src={workerData.profilePicUrl}
                        alt="workerData"
                        height={100}
                        width={100}
                      />
                    </div>
                    <div className="mx-4">
                      <p>
                        <i className="bi bi-person mx-1"></i>
                        {workerData.name}
                      </p>
                      <p>
                        <i className="bi bi-telephone mx-1"></i>
                        {workerData.contactNumber}
                      </p>
                      <p className="mx-1">
                        Rating:
                        {Array.from({ length: 5 }, (_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star-fill ${
                              i < (workerData.averageRating || 0)
                                ? "text-warning"
                                : "text-secondary"
                            } mx-1`}
                          ></i>
                        ))}
                        {workerData.averageRating || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="row">
                  <div className="d-flex">
                    <i className="bi bi-geo-alt mx-1"></i>
                    <p>
                      {workerData.houseNumber}, {workerData.town},{" "}
                      {workerData.district}, {workerData.state} -{" "}
                      {workerData.pincode}
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="row">
                  <div className="col-5">
                    <p>Joining Date</p>
                    <p>Aadhar Number</p>
                    <p>Language</p>
                    <p>Total Service</p>
                  </div>
                  <div className="col-7">
                    <p>: {workerData.joiningDate}</p>
                    <p>: **** **** {workerData.aadharNumber?.slice(-4)}</p>
                    <p>: {workerData.language}</p>
                    <p>: {workerData.totalWorkAssigned}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Table content */}
          <div className="col-7 mt-4 border px-3 rounded">
            {/* Header Section with Active Border */}
            <div className="row">
              <div className="d-flex mt-3 pb-2">
                <p
                  className={`px-4 pb-2 ${
                    activeTab === "serviceDetails"
                      ? "border-bottom border-3 border-dark"
                      : ""
                  }`}
                  onClick={() => setActiveTab("serviceDetails")}
                  style={{ cursor: "pointer" }}
                >
                  Service Details
                </p>
                <p
                  className={`mx-1 px-4 pb-2 ${
                    activeTab === "inProgress"
                      ? "border-bottom border-3 border-dark"
                      : ""
                  }`}
                  onClick={() => setActiveTab("inProgress")}
                  style={{ cursor: "pointer" }}
                >
                  In Progress
                </p>
                <p
                  className={`px-4 pb-2 ${
                    activeTab === "reviews"
                      ? "border-bottom border-3 border-dark"
                      : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                  style={{ cursor: "pointer" }}
                >
                  Reviews
                </p>

                <p
                  className="border border-danger rounded px-2"
                  style={{ marginLeft: "100px", paddingTop: "3px", cursor: "pointer" }}
                  onClick={handleDeleteWorker}
                >
                  <i className="bi bi-trash text-danger mx-1"></i>
                  Remove worker
                </p>
              </div>
            </div>

            {/* Dynamic Content Section */}
            <div className="row">
              <div
                className="table-responsive custom-table"
                style={{ maxHeight: "550px" }}
              >
                {loading ? (
                  <Skeleton height={30} />
                ) : activeTab === "serviceDetails" ? (
                  <table className="table table-bordered table-hover">
                    <thead
                      className="table-light"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
                        backgroundColor: "white",
                        borderBottom: "1px solid #dee2e6",
                        boxShadow: "0px 0px 2px 1px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <tr className="border">
                        <th>S.no</th>
                        <th>Service</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                        display: "table-row-group",
                        backgroundColor: "white",
                      }}
                    >
                      {serviceDetailsData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            {item.service} <br />
                            <span style={{ color: "#0076CE" }}>ID: {item.id}</span>
                          </td>
                          <td>
                            {item.name} <br /> {item.phone}
                          </td>
                          <td>
                            {item.date} <br /> {item.status}
                          </td>
                          <td>
                            <i className="bi bi-star-fill text-warning"></i>{" "}
                            {item.rating}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : activeTab === "inProgress" ? (
                  <table className="table table-bordered table-hover">
                    <thead
                      className="table-light border"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
                        backgroundColor: "white",
                        borderBottom: "1px solid #dee2e6",
                        boxShadow: "0 0px 2px 1px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <tr>
                        <th>S.no</th>
                        <th>Service</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                        display: "table-row-group",
                        backgroundColor: "white",
                      }}
                    >
                      {inProgressData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            {item.service}
                            <br />
                            <span style={{ color: "#0076CE" }}>ID: {item.id}</span>
                          </td>
                          <td>
                            {item.name}
                            <br /> {item.phone}
                          </td>
                          <td>
                            {item.date} <br /> Service pending
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "STARTED"
                                  ? "bg-warning"
                                  : item.status === "RESCHEDULED"
                                  ? "bg-danger"
                                  : item.status === "ASSIGNED"
                                  ? "bg-secondary"
                                  : "bg-success"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                    <div className="p-fixed" style={{overflow:"hidden", height: "650px", marginTop:"-180px"}}>
                    {/* <h1 className="text-center w-100">No reviews yet</h1> */}
                    <ComingSoon />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worker;