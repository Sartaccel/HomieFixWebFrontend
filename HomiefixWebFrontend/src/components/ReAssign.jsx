import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/AssignBookings.css";
import dropdown from "../assets/dropdown.svg";
import api from "../api";
import profile from "../assets/addWorker.jpg";

const ReAssign = ({ id, booking, onClose, onReAssignSuccess }) => {
  // State declarations
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(true);
  const [isReassigning, setIsReassigning] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showWorkerDropdown, setShowWorkerDropdown] = useState(false);
  const [groupedServices, setGroupedServices] = useState({});

  const isTimeSlotExpired = (timeSlot) => {
    if (!selectedDate) return false;

    const today = new Date();
    const selected = new Date(selectedDate);

    // Check if selected date is today
    if (
      selected.getDate() === today.getDate() &&
      selected.getMonth() === today.getMonth() &&
      selected.getFullYear() === today.getFullYear()
    ) {
      // Extract the start time from the time slot (e.g., "9:00 AM" from "9:00 AM - 11:00 AM")
      const startTimeStr = timeSlot.split(" - ")[0];

      // Parse the start time
      const [time, period] = startTimeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Create a Date object for the time slot's start time
      const slotTime = new Date(today);
      slotTime.setHours(hours, minutes, 0, 0);

      // Compare with current time
      return slotTime < today;
    }

    return false;
  };

  // Fetch available dates
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await api.get("/booking/available-dates");
        const data = response.data;
        const validDates = data
          .map((dateStr) => {
            const parts = dateStr.split(" ");
            if (parts.length < 4) return null;
            const day = parts[0];
            const month = parts[1];
            const year = parts[3];
            const date = new Date(`${month} ${day}, ${year} 12:00:00`);
            return isNaN(date.getTime())
              ? null
              : date.toISOString().split("T")[0];
          })
          .filter((date) => date !== null);
        setAvailableDates(validDates);
      } catch (error) {
        console.error("Error fetching dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };
    fetchAvailableDates();
  }, []);

  // Fetch available times
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await api.get("/booking/available-times");
        const data = response.data;
        const formattedTimes = data.map((time) => {
          return time.replace(/(\d{1,2}):(\d{2})/g, (match, hour, minute) => {
            return hour.padStart(2, "0") + ":" + minute;
          });
        });
        setAvailableTimes(formattedTimes);
      } catch (error) {
        console.error("Error fetching times:", error);
      } finally {
        setLoadingTimes(false);
      }
    };
    fetchAvailableTimes();
  }, []);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingWorkers(true);
        const response = await api.get("/products/view");
        const serviceData = response.data.map((item) => ({
          name: item.productName || item.name,
          image: item.productImage || profile,
        }));
        setServices(serviceData);
        if (booking?.productName) {
          setSelectedService(booking.productName);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingWorkers(false);
      }
    };
    fetchServices();
  }, [booking]);

  // Group services by category
  useEffect(() => {
    if (services.length > 0) {
      const grouped = {};
      const productCategories = {
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
          "Window",
          "Drill & Hang",
          "Furniture",
        ],
        Plumbing: [
          "WashBasin Installation",
          "Blockage Removal",
          "Shower",
          "Toilet",
          "Tap, Pipe works",
          "Watertank & Motor",
        ],
        "Vehicle Service": [
          "Batteries",
          "Health checkup",
          "Water Wash",
          "Denting & Painting",
          "Tyre Service",
          "Vehicle AC",
        ],
        "Care Taker": [
          "Child Care",
          "PhysioTherapy",
          "Old Age Care",
          "Companion Support",
          "Home Nursing",
        ],
        Cleaning: ["Cleaning"],
        CCTV: ["CCTV"],
      };

      Object.keys(productCategories).forEach((category) => {
        const categoryServices = services.filter((service) =>
          productCategories[category].includes(service.name)
        );
        if (categoryServices.length > 0) {
          grouped[category] = categoryServices;
        }
      });
      setGroupedServices(grouped);
    }
  }, [services]);

  // Fetch workers when service changes
  useEffect(() => {
    const fetchWorkersByService = async () => {
      setWorkers([]);
      setSelectedWorkerId(null);
      setSelectedWorkerDetails(null);

      if (!selectedService) return;

      try {
        setLoadingWorkers(true);
        const response = await api.get(
          `/workers/view/by-product/${selectedService}?t=${Date.now()}`
        );
        const workerData = response.data.filter((worker) => worker.active);
        setWorkers(workerData);

        if (
          booking?.worker &&
          workerData.some((w) => w.id === booking.worker.id)
        ) {
          setSelectedWorkerId(booking.worker.id);
          setSelectedWorkerDetails(
            workerData.find((w) => w.id === booking.worker.id)
          );
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
        setWorkers([]);
      } finally {
        setLoadingWorkers(false);
      }
    };
    fetchWorkersByService();
  }, [selectedService, booking]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowServiceDropdown(false);
    setSelectedWorkerId(null);
    setSelectedWorkerDetails(null);
    setShowWorkerDropdown(false); // Close worker dropdown when service changes
  };

  const confirmWorkerSelection = () => {
    setShowWorkerDropdown(false); // Close dropdown when confirming selection
  };

  const handleServiceDropdownToggle = () => {
    if (showWorkerDropdown) {
      setShowWorkerDropdown(false);
    }
    setShowServiceDropdown(!showServiceDropdown);
  };

  const handleWorkerDropdownToggle = () => {
    if (!selectedService) {
      alert("Please select a service first");
      return;
    }
    if (showServiceDropdown) {
      setShowServiceDropdown(false);
    }
    setShowWorkerDropdown(!showWorkerDropdown);
  };

  const handleWorkerSelection = (workerId) => {
    if (selectedWorkerId === workerId) {
      setSelectedWorkerId(null);
      setSelectedWorkerDetails(null);
    } else {
      setSelectedWorkerId(workerId);
      const worker = workers.find((worker) => worker.id === workerId);
      setSelectedWorkerDetails(worker);
    }
    // Don't close dropdown here - we'll keep it open for selection
  };

  const handleReassign = async () => {
    if (
      !selectedDate ||
      !selectedTimeSlot ||
      !reassignReason ||
      !selectedWorkerId
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (reassignReason === "other" && !otherReason.trim()) {
      alert("Please provide a reason for reassignment");
      return;
    }

    try {
      setIsReassigning(true);
      const params = new URLSearchParams();
      params.append("workerId", selectedWorkerId);
      params.append("selectedDate", selectedDate);
      params.append("selectedTimeSlot", selectedTimeSlot);
      params.append(
        "reassignmentReason",
        reassignReason === "other" ? otherReason : reassignReason
      );

      const response = await api.put(
        `/booking/reassign-worker/${id}?${params.toString()}`
      );

      if (response.status === 200) {
        alert("Booking reassigned successfully");
        onReAssignSuccess();
        onClose();
      } else {
        alert(`Failed to reassign booking: ${response.status}`);
      }
    } catch (error) {
      console.error("Error reassigning booking:", error);
      alert("An error occurred during reassignment.");
    } finally {
      setIsReassigning(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    return (
      <div>
        <div>{`${day} ${month}`}</div>
        <div>{dayOfWeek}</div>
      </div>
    );
  };

  return (
    <div
      className="reschedule-slider position-fixed top-0 end-0 h-100 bg-white shadow-lg"
      style={{ width: "550px", zIndex: 1000 }}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>ReAssign Service</h4>
          <button className="btn btn-light" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-2 mt-2">
          <h6>Change Worker</h6>
          <div className="d-flex justify-content-start gap-4 flex-nowrap">
            {/* Service Dropdown */}
            <div className="position-relative" style={{ width: "250px" }}>
              <div
                className="border shadow-none d-flex align-items-center justify-content-between"
                style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleServiceDropdownToggle}
              >
                {selectedService || "Select service"}
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{
                    width: "15px",
                    transform: showServiceDropdown ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s",
                  }}
                />
              </div>

              {showServiceDropdown && (
                <div
                  className="position-absolute bg-white shadow-lg p-3 mt-1"
                  style={{
                    width: "500px",
                    maxHeight: "450px",
                    overflowY: "auto",
                    zIndex: 1001,
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  {Object.keys(groupedServices).map((category) => (
                    <div key={category} className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <div className="d-flex gap-4">
                          <button
                            className="tab-btn active-tab"
                            style={{ fontSize: "14px", fontWeight: "500" }}
                          >
                            {category}
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        {groupedServices[category].map((service, index) => (
                          <div className="col-3 mb-2" key={index}>
                            <div
                              className="card service-card"
                              onClick={() => handleServiceSelect(service.name)}
                              style={{
                                cursor: "pointer",
                                border:
                                  selectedService === service.name
                                    ? "2px solid #0076CE"
                                    : "1px solid transparent",
                                backgroundColor: "#F7F7F7",
                                height: "100px",
                                width: "100px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  marginBottom: "8px",
                                }}
                              >
                                <img
                                  src={service.image || profile}
                                  alt={service.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  fontWeight: "500",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  width: "100%",
                                }}
                              >
                                {service.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Worker Dropdown */}
            <div className="position-relative" style={{ width: "250px" }}>
              <div
                className="border shadow-none d-flex align-items-center justify-content-between"
                style={{
                  padding: "6px 14px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleWorkerDropdownToggle}
              >
                {selectedWorkerDetails?.name || "Choose worker"}
                <img
                  src={dropdown}
                  alt="dropdown"
                  style={{
                    width: "15px",
                    transform: showWorkerDropdown ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s",
                  }}
                />
              </div>

              {showWorkerDropdown && (
                <div
                  className="position-absolute bg-white shadow-lg p-3 mt-1"
                  style={{
                    width: "500px",
                    height: "455px",
                    overflow: "hidden",
                    zIndex: 1001,
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    left: "-260px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="card p-3"
                    style={{
                      border: "none",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ height: "30px" }}
                    >
                      <h6 className="mb-0">Workers</h6>
                    </div>

                    {/* Scrollable content */}
                    <div
                      style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: "10px",
                        marginBottom: "10px", // Add some space before the button
                      }}
                    >
                      <div
                        className="row d-flex flex-wrap"
                        style={{ gap: "8px", marginLeft: "0px" }}
                      >
                        {loadingWorkers ? (
                          Array.from({ length: 4 }).map((_, index) => (
                            <div
                              key={index}
                              className="col-6"
                              style={{
                                width: "48%",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "8px",
                                background: "#f9f9f9",
                              }}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <Skeleton circle width={40} height={40} />
                                <div>
                                  <Skeleton width={100} height={15} />
                                  <Skeleton width={80} height={12} />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : workers.length === 0 ? (
                          <div className="col-12 text-center mt-3">
                            <p style={{ color: "#888" }}>
                              No workers available for this product.
                            </p>
                          </div>
                        ) : (
                          workers.map((worker, index) => (
                            <div
                              key={index}
                              className="col-6"
                              style={{
                                width: "48%",
                                border:
                                  selectedWorkerId === worker.id
                                    ? "2px solid #0076CE"
                                    : "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "8px",
                                background:
                                  selectedWorkerId === worker.id
                                    ? "#e6f3ff"
                                    : "#f9f9f9",
                                cursor: "pointer",
                              }}
                              onClick={() => handleWorkerSelection(worker.id)}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-secondary"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    flexShrink: 0,
                                    backgroundImage: `url(${worker.profilePicUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }}
                                ></div>
                                <div>
                                  <p className="mb-0">{worker.name}</p>
                                  <small style={{ color: "#666666" }}>
                                    {worker.town}, {worker.pincode}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Fixed button at the bottom */}
                    <div
                      style={{
                        paddingTop: "10px",
                        borderTop: "1px solid #eee",
                        marginTop: "auto", // Pushes to bottom
                      }}
                    >
                      <button
                        className="btn w-100"
                        style={{
                          background: selectedWorkerId ? "#0076CE" : "#999999",
                          color: "white",
                          borderRadius: "14px",
                        }}
                        disabled={!selectedWorkerId}
                        onClick={confirmWorkerSelection}
                      >
                        Select Worker
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-2 mt-2">
          <h6>Date</h6>
          <div className="d-flex flex-wrap gap-2">
            {loadingDates
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} width={100} height={50} />
                ))
              : availableDates.map((date, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm `}
                    style={{
                      fontSize: "15px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border:
                        selectedDate === date
                          ? "1px solid #0076CE"
                          : "1px solid #D2D2D2",
                      color: "#333",
                      backgroundColor: "transparent",
                      maxWidth: "93px",
                    }}
                    onClick={() => setSelectedDate(date)}
                  >
                    {formatDate(date)}
                  </button>
                ))}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-2 mt-2">
          <h6>Time</h6>
          <div className="d-flex flex-wrap gap-2">
            {loadingTimes
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} width={80} height={30} />
                ))
              : availableTimes.map((time, index) => {
                  const isExpired = isTimeSlotExpired(time);
                  return (
                    <button
                      key={index}
                      className={`btn btn-sm`}
                      style={{
                        fontSize: "15px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border:
                          selectedTimeSlot === time
                            ? "1px solid #0076CE"
                            : "1px solid #D2D2D2",
                        color: isExpired ? "#999" : "#333",
                        backgroundColor: isExpired ? "#f5f5f5" : "transparent",
                        cursor: isExpired ? "not-allowed" : "pointer",
                      }}
                      onClick={() => !isExpired && setSelectedTimeSlot(time)}
                      disabled={isExpired}
                    >
                      {time}
                    </button>
                  );
                })}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <div className="mb-2 mt-2">
          <h6>Reason for ReAssign</h6>
          <div className="mb-2">
            {[
              {
                value: "Different Service Needed",
                label: "Different Service Needed",
              },
              { value: "other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  id={option.value}
                  name="reassignReason"
                  value={option.value}
                  checked={reassignReason === option.value}
                  onChange={(e) => setReassignReason(e.target.value)}
                />
                <label
                  className="form-check-label"
                  style={{ marginLeft: "5px" }}
                  htmlFor={option.value}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          {reassignReason === "other" && (
            <textarea
              className="form-control shadow-none"
              placeholder="Other reason (required)"
              rows="3"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              style={{
                height: "75px",
                resize: "none",
                padding: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
              required
            ></textarea>
          )}
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>

        <button
          className="btn btn-primary w-100 mt-3"
          style={{ backgroundColor: "#0076CE" }}
          onClick={handleReassign}
          disabled={
            !selectedDate ||
            !selectedTimeSlot ||
            !reassignReason ||
            (reassignReason === "other" && !otherReason.trim()) ||
            !selectedWorkerId ||
            isReassigning
          }
        >
          {isReassigning ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              ReAssigning...
            </>
          ) : (
            "ReAssign"
          )}
        </button>
      </div>
    </div>
  );
};

export default ReAssign;
