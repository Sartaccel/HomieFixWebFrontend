import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import userProfile from "../assets/addWorker.jpg";
import { useState, useEffect } from "react";
import Header from "./Header";
import api from "../api";

const CustomerReview = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch feedback data
        const feedbackResponse = await api.get(`/feedback/${id}`);
        const feedbackData = feedbackResponse.data;

        // Fetch booking data using the bookingId from feedback
        const bookingResponse = await api.get(
          `/booking/${feedbackData.bookingId}`
        );
        const bookingData = bookingResponse.data;

        setReview(feedbackData);
        setBooking(bookingData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load review data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container" style={{ paddingTop: "80px" }}>
          <div className="row mx-2">
            <div className="col-md-6">
              <div className="card mt-4 p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-secondary"
                    style={{ width: "65px", height: "65px", opacity: 0.3 }}
                  ></div>
                  <div className="ms-3 w-100">
                    <div
                      className="bg-secondary mb-2"
                      style={{ height: "14px", width: "60%", opacity: 0.3 }}
                    ></div>
                    <div
                      className="bg-secondary mb-2"
                      style={{ height: "14px", width: "40%", opacity: 0.3 }}
                    ></div>
                    <div
                      className="bg-secondary"
                      style={{ height: "14px", width: "80%", opacity: 0.3 }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div
                    className="bg-secondary mb-2"
                    style={{ height: "14px", width: "50%", opacity: 0.3 }}
                  ></div>
                  <div
                    className="bg-secondary"
                    style={{ height: "60px", width: "100%", opacity: 0.2 }}
                  ></div>
                </div>

                <div className="mt-5 d-flex align-items-center">
                  <div
                    className="rounded-circle bg-secondary"
                    style={{ width: "65px", height: "65px", opacity: 0.3 }}
                  ></div>
                  <div className="ms-3 w-100">
                    <div
                      className="bg-secondary mb-2"
                      style={{ height: "14px", width: "60%", opacity: 0.3 }}
                    ></div>
                    <div
                      className="bg-secondary mb-2"
                      style={{ height: "14px", width: "40%", opacity: 0.3 }}
                    ></div>
                    <div
                      className="bg-secondary mb-2"
                      style={{ height: "14px", width: "80%", opacity: 0.3 }}
                    ></div>
                    <div
                      className="bg-secondary mt-2"
                      style={{ height: "35px", width: "100%", opacity: 0.3 }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card mt-4 p-3">
                <h5 className="mb-3">Service Details</h5>
                <div className="row">
                  <div className="col-md-4">
                    {[...Array(5)].map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-secondary mb-2"
                        style={{ height: "14px", width: "80%", opacity: 0.2 }}
                      ></div>
                    ))}
                  </div>
                  <div className="col-md-8">
                    {[...Array(5)].map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-secondary mb-2 float-end"
                        style={{ height: "14px", width: "60%", opacity: 0.2 }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="d-flex">
                    <div className="d-flex flex-column align-items-center me-3 mt-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i}>
                          <div
                            className="rounded-circle bg-secondary"
                            style={{
                              width: "12px",
                              height: "12px",
                              opacity: 0.3,
                            }}
                          ></div>
                          {i < 2 && (
                            <div
                              className="bg-secondary"
                              style={{
                                height: "50px",
                                width: "3px",
                                marginLeft: "4px",
                                opacity: 0.3,
                              }}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex-grow-1">
                      {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="mb-3">
                          <div
                            className="bg-secondary mb-1"
                            style={{
                              height: "14px",
                              width: "40%",
                              opacity: 0.3,
                            }}
                          ></div>
                          <div
                            className="bg-secondary"
                            style={{
                              height: "14px",
                              width: "80%",
                              opacity: 0.2,
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!review || !booking) {
    return <h2 className="text-center text-muted">Review not found</h2>;
  }

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <Header />

      <div className="container" style={{ paddingTop: "80px" }}>
        <div className="d-flex gap-4 mx-2 align-items-center">
          <button
            className="btn btn-light p-2"
            style={{ marginBottom: "-20px" }}
            onClick={() => navigate(`/reviews`)}
          >
            <i
              className="bi bi-arrow-left"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            ></i>
          </button>

          <button
            className={`tab-btn ${activeTab === "recent" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            Recent Reviews
          </button>
        </div>

        <div className="row mx-2">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body mb-3">
                <h5 className="card-title">Customer</h5>
                <div className="d-flex align-items-center">
                  <div>
                    <img
                      src={review.userProfile.profilePicUrl || userProfile}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "65px", height: "65px" }}
                    />
                  </div>
                  <div className="ms-3 mt-2">
                    <p className="card-text mb-1">
                      {" "}
                      <span className="bi bi-person"></span>{" "}
                      {review.userProfile.fullName}
                    </p>
                    <p className="card-text mb-1">
                      {" "}
                      <span className="bi bi-telephone"></span>{" "}
                      {review.userProfile.mobileNumber.mobileNumber}
                    </p>
                    <div className="d-flex">
                      <i className="bi bi-geo-alt"></i>
                      <p className="card-text mb-1 mx-1">
                        {booking.deliveryAddress.houseNumber},{" "}
                        {booking.deliveryAddress.town},
                        {booking.deliveryAddress.district},{" "}
                        {booking.deliveryAddress.state} -{" "}
                        {booking.deliveryAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <p>
                    Customer Review{" "}
                    <span className="bi bi-star-fill text-warning mx-2"> </span>{" "}
                    {review.rating}
                  </p>
                </div>

                <div className="row border-bottom">
                  <p className="text-muted">{review.comment}</p>
                </div>

                <h5 className="card-title mt-5">Worker Details</h5>
                <div className="d-flex align-items-center">
                  <div>
                    <img
                      src={review.worker.profilePicUrl || userProfile}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "65px", height: "65px" }}
                    />
                  </div>
                  <div className="ms-3 mt-2">
                    <p className="card-text mb-1">
                      {" "}
                      <span className="bi bi-person"></span>{" "}
                      {review.worker.name}
                    </p>
                    <p className="card-text mb-1">
                      {" "}
                      <span className="bi bi-telephone"></span>{" "}
                      {review.worker.contactNumber}
                    </p>
                    <div className="d-flex">
                      <i className="bi bi-geo-alt"></i>
                      <p className="card-text mb-1 mx-1">
                        {review.worker.houseNumber}, {review.worker.town},
                        {review.worker.district}, {review.worker.state} -{" "}
                        {review.worker.pincode}
                      </p>
                    </div>
                    <button
                      className="btn w-100 mt-1"
                      style={{ backgroundColor: "#0076CE", color: "white" }}
                      onClick={() =>
                        navigate(`/worker-details/worker/${review.worker.id}`)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-3 mt-4 p-3">
              <div className="card-body">
                <h5 className="card-title">Service Details</h5>
                <div className="row">
                  <div className="col-md-4">
                    <p className="card-text text-muted">Booking Date</p>
                    <p className="card-text text-muted">Service Type</p>
                    <p className="card-text text-muted">Service date & time</p>
                    <p className="card-text text-muted">Status</p>
                    <p className="card-text text-muted">Total amount</p>
                  </div>
                  <div className="col-md-8">
                    <p className="card-text text-end">
                      {formatDate(booking.bookingDate)}
                    </p>
                    <p className="card-text text-end">{booking.productName}</p>
                    <p className="card-text text-end">
                      {formatDate(booking.bookedDate)}, {booking.timeSlot}
                    </p>
                    <p
                      className="card-text text-end"
                      style={{ color: "#0076CE" }}
                    >
                      {booking.bookingStatus}
                    </p>
                    <p className="card-text text-end">₹ {booking.totalPrice}</p>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-12 mt-4">
                    <div className="d-flex">
                      {/* Timeline/Process bar */}
                      <div className="d-flex flex-column align-items-center me-3 mt-3">
                        <div
                          className="rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#0076CE",
                          }}
                        ></div>
                        <div
                          className="vr"
                          style={{
                            height: "50px",
                            marginLeft: "4.3px",
                            width: "3px",
                            backgroundColor: "#0076CE",
                            opacity: "100%",
                          }}
                        ></div>
                        <div
                          className="rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#0076CE",
                          }}
                        ></div>
                        <div
                          className="vr"
                          style={{
                            height: "50px",
                            marginLeft: "4.3px",
                            width: "3px",
                            backgroundColor: "#0076CE",
                            opacity: "100%",
                          }}
                        ></div>
                        <div
                          className="rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#0076CE",
                          }}
                        ></div>
                      </div>

                      {/* Timeline content */}
                      <div className="flex-grow-1">
                        <div className="mb-3">
                          <p className="card-text mb-1">
                            {formatDate(booking.bookingDate)}
                          </p>
                          <p className="text-muted mb-0">
                            Your booking is confirmed. Our team will contact you
                            soon.
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="card-text mb-1">
                            {formatDate(booking.workerAssignDate)}
                          </p>
                          <p className="text-muted mb-0">Confirmation call</p>
                        </div>
                        <div>
                          <p className="card-text mb-1">
                            {formatDate(booking.serviceCompletedDate)}
                          </p>
                          <p className="text-muted mb-0">Service Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-12 d-flex justify-content-end">
                    {/* <button className="btn" style={{ backgroundColor: "#0076CE", color: "white" }} >Share</button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
