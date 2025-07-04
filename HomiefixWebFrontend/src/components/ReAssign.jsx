import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/AssignBookings.css";
import dropdown from "../assets/dropdown.svg";
import api from "../api";


const ReAssign = ({ id, booking, onClose, onReAssignSuccess }) => {
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
  const [selectedWorker, setSelectedWorker] = useState("");
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [workerDetails, setWorkerDetails] = useState([]);


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


            if (isNaN(date.getTime())) {
              console.warn("Invalid date found:", dateStr);
              return null;
            }


            return date.toISOString().split("T")[0];
          })
          .filter((date) => date !== null);


        setAvailableDates(validDates);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };


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
        console.error("Error fetching available times:", error);
      } finally {
        setLoadingTimes(false);
      }
    };


    fetchAvailableDates();
    fetchAvailableTimes();
  }, []);


  const fetchServices = async () => {
    try {
      const response = await api.get("/products/view");
      const serviceNames = response.data.map((item) => item.name);
      setServices(serviceNames);
      // Set initial selected service to current booking's product
      if (booking?.productName) {
        setSelectedService(booking.productName);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };


  useEffect(() => {
    fetchServices();
  }, [booking]);


  useEffect(() => {
    const fetchWorkersByService = async () => {
      setWorkers([]);
      setSelectedWorker("");
      setWorkerDetails([]);


      if (!selectedService) return;


      try {
        setLoadingWorkers(true);
        const response = await api.get(
          `/workers/view/by-product/${selectedService}?t=${Date.now()}`
        );
        const workerData = response.data;
        setWorkerDetails(workerData);
        const workerNames = workerData.map((worker) => worker.name);
        setWorkers(workerNames);
       
        // If current worker is available for the selected service, preselect them
        if (booking?.worker && workerData.some(w => w.id === booking.worker.id)) {
          setSelectedWorker(booking.worker.name);
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


  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };


  const handleTimeSlotSelection = (time) => {
    setSelectedTimeSlot(time);
  };


  const isReassignDisabled = () => {
    const isOtherReasonEmpty = reassignReason === "other" && !otherReason.trim();
    const isWorkerSelected = selectedWorker && selectedWorker.trim() !== "";
   
    return (
      !selectedDate ||
      !selectedTimeSlot ||
      !reassignReason ||
      isOtherReasonEmpty ||
      !isWorkerSelected
    );
  };


  const handleReassign = async () => {
    if (!selectedDate || !selectedTimeSlot || !reassignReason || !selectedWorker) {
      alert("Please fill all required fields");
      return;
    }


    if (reassignReason === "other" && !otherReason.trim()) {
      alert("Please provide a reason for reassignment");
      return;
    }


    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      alert("Please select a valid date");
      return;
    }


    const reason = reassignReason === "other" ? otherReason : reassignReason;
    const formattedDate = parsedDate.toISOString().split("T")[0];
   
    // Find the selected worker's ID from workerDetails
    const selectedWorkerObj = workerDetails.find(w => w.name === selectedWorker);
    if (!selectedWorkerObj) {
      alert("Selected worker not found");
      return;
    }


    try {
      setIsReassigning(true);
     
      const params = new URLSearchParams();
      params.append('workerId', selectedWorkerObj.id);
      params.append('selectedDate', formattedDate);
      params.append('selectedTimeSlot', selectedTimeSlot);
      params.append('reassignmentReason', reason);


      const response = await api.put(
        `/booking/reassign-worker/${id}?${params.toString()}`
      );


      if (response.status === 200) {
        alert("Booking reassigned successfully");
        onReAssignSuccess();
        onClose();
      } else {
        console.error("Reassign failed:", response.status, response.data);
        alert(
          `Failed to reassign booking: ${response.status} - ${
            response.data.message || "Unknown error"
          }`
        );
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>ReAssign Service</h4>
          <button className="btn btn-light" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>


        <div className="mb-3 mt-3">
          <h6>Change Worker</h6>
          <div className="d-flex justify-content-start gap-4 flex-nowrap">
            {/* Service Dropdown - Only for filtering workers */}
            <div className="position-relative" style={{ width: "250px" }}>
              <select
                className="form-select shadow-none"
                style={{ padding: "6px 18px", borderRadius: "4px" }}
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setSelectedWorker("");
                }}
              >
                <option value="">Select service</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <img
                src={dropdown}
                alt="dropdown"
                className="position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  width: "15px",
                }}
              />
            </div>


            {/* Worker Dropdown */}
            <div className="position-relative" style={{ width: "250px" }}>
              <select
                className="form-select shadow-none"
                style={{ padding: "6px 18px", borderRadius: "4px" }}
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                disabled={loadingWorkers || !workers.length}
              >
                <option value="">Choose worker</option>
                {loadingWorkers ? (
                  <option value="" disabled>
                    Loading workers...
                  </option>
                ) : (
                  workers.map((worker, index) => (
                    <option key={index} value={worker}>
                      {worker}
                    </option>
                  ))
                )}
              </select>
              <img
                src={dropdown}
                alt="dropdown"
                className="position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  width: "15px",
                }}
              />
            </div>
          </div>
        </div>


        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>


        <div className="mb-3 mt-3">
          <h6>Date</h6>
          <div className="d-flex flex-wrap gap-2">
            {loadingDates
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} width={100} height={50} />
                ))
              : availableDates.map((date, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${selectedDate === date ? "btn-primary" : "btn-outline-secondary"}`}
                    style={{
                      fontSize: "15px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleDateSelection(date)}
                  >
                    {formatDate(date)}
                  </button>
                ))}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>


        <div className="mb-3 mt-3">
          <h6>Time</h6>
          <div className="d-flex flex-wrap gap-2">
            {loadingTimes
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} width={80} height={30} />
                ))
              : availableTimes.map((time, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${selectedTimeSlot === time ? "btn-primary" : "btn-outline-secondary"}`}
                    style={{
                      fontSize: "15px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleTimeSlotSelection(time)}
                  >
                    {time}
                  </button>
                ))}
          </div>
        </div>
        <div
          style={{ borderBottom: "1px solid #D2D2D2", margin: "0 -16px" }}
        ></div>


        <div className="mb-3 mt-3">
          <h6>Reason for ReAssign</h6>
          <div className="mb-2">
            {[
              { value: "problem in other", label: "Problem in other" },
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
              className="form-control"
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
          disabled={isReassignDisabled() || isReassigning}
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

