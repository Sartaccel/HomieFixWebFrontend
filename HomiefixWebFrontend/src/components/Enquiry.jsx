import Header from "./Header";
import api from "../api";
import React, { useState, useEffect } from "react";
import tick from "../assets/tick.svg";
import cross from "../assets/cross.svg";
import pending from "../assets/Pending.svg";
import approved from "../assets/Approved.svg";
import rejected from "../assets/Rejected.svg";
import mail from "../assets/mail.svg";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Enquiry = () => {
  const [activeTab, setActiveTab] = useState("worker_request");
  const [workerRequests, setWorkerRequests] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [existingWorkers, setExistingWorkers] = useState([]);
  const [approvedWorkers, setApprovedWorkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading

      try {
       
          const res = await api.get("/static/partner/all");

          const sortedRequests = res.data.sort((a, b) => {
            return new Date(b.partnerJdate) - new Date(a.partnerJdate);
          });

          setWorkerRequests(sortedRequests);
        
          const Sres = await api.get("/static/contact/all");

          const sortedTickets = Sres.data.sort((a, b) => {
            return new Date(b.issuedDate) - new Date(a.issuedDate);
          });

          setSupportTickets(sortedTickets);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    };

    fetchData();
  }, [activeTab]);

  //format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  //For status update

  const handleStatusUpdate = async (id, newStatus, phoneNumber) => {
    try {
      if (newStatus === "APPROVED") {
        const alreadyExists = existingWorkers.some(
          (worker) => worker.contactNumber === phoneNumber
        );

        if (alreadyExists) {
          alert("Worker already exists!");
          setWorkerRequests((prev) =>
            prev.map((worker) =>
              worker.id === id
                ? { ...worker, joiningStatus: "PENDING" || "REJECTED" }
                : worker
            )
          );

          return;
        }
      }
      await api.put(`/static/partner/status/${id}?status=${newStatus}&phoneNumber=${phoneNumber}`);
      setWorkerRequests((prev) =>
        prev.map((worker) =>
          worker.id === id ? { ...worker, joiningStatus: newStatus } : worker
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  //fetch existing user
  useEffect(() => {
    const fetchExistingWorkers = async () => {
      try {
        const res = await api.get("/workers/view");
        setExistingWorkers(res.data);
      } catch (err) {
        console.error("Error fetching existing workers", err);
      }
    };

    fetchExistingWorkers();
  }, []);

  const getStatusIcon = (status) => {
    if (status === "PENDING") {
      return <img src={pending} alt="Pending" width="63" />;
    } else if (status === "APPROVED") {
      return <img src={approved} alt="Approved" width="63" />;
    } else if (status === "REJECTED") {
      return <img src={rejected} alt="Rejected" width="60" />;
    } else {
      return null;
    }
  };

  return (
    <div className="container-fluid m-0 p-0 vh-100 w-100">
      <div className="row m-0 p-0 vh-100">
        <main className="col-12 p-0 m-0 d-flex flex-column">
          <Header />
          <div className="navigation-barr d-flex gap-3 py-3 bg-white border-bottom w-100">
            <div
              className={`section ${
                activeTab === "worker_request" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("worker_request");
                navigate("/enquiry?tab=worker_request");
              }}
            >
              Workers Request
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {workerRequests.length}
                </span>
              )}
            </div>
            <div
              className={`section ${activeTab === "support" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("support");
                navigate("/enquiry?tab=support");
              }}
            >
              Support
              {!initialLoad && (
                <span
                  className="badge bg-dark ms-1"
                  style={{ borderRadius: "45%" }}
                >
                  {supportTickets.length}
                </span>
              )}
            </div>
          </div>
          <div
            className="table-responsive mt-3 w-100 px-0 overflow-auto"
            style={{ maxHeight: "100%", minHeight: "100%" }}
          >
            {error ? (
              <div
                className="alert alert-danger text-center m-3 mt-5"
                style={{
                  position: "fixed",
                  top: "110px",
                  left: "40%",
                  zIndex: 2000,
                }}
              >
                <div className="mb-3">
                  <i
                    className="bi bi-wifi-off"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
                {error}
                <button
                  className="btn  ms-3"
                  style={{ backgroundColor: "#0076CE", color: "white" }}
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <table
                className="booking-table table table-hover bg-white rounded shadow-sm "
                style={{
                  verticalAlign: "middle",
                  tableLayout: "fixed",
                  width: "96%",
                }}
              >
                <thead className="td-height">
                  <tr style={{ height: "50px" }}>
                    {activeTab === "worker_request" ? (
                      <>
                        <th className="p-3 text-left align-middle">Service</th>
                        <th className="p-3 text-left align-middle">Name</th>
                        <th className="p-3 text-left align-middle">Contact</th>
                        <th className="p-3 text-left align-middle">Date</th>
                        <th className="p-3 text-left align-middle">Status</th>
                        <th className="p-3 text-left align-middle">Action</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left align-middle">Service</th>
                        <th className="text-left align-middle">Name</th>
                        <th className="text-left align-middle">Email</th>
                        <th className="text-left align-middle">Contact</th>
                        <th className="text-left align-middle">Date</th>
                        <th className="text-left align-middle">Notes</th>
                        <th className="text-left align-middle">Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // Skeleton loader rows
                    [...Array(5)].map((_, idx) => (
                      <tr key={idx}>
                        {activeTab === "worker_request" ? (
                          <>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} width={60} /></td>  
                          </>
                        ) : (
                          <>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} width={150} /></td>  
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={20} /></td>
                            <td><Skeleton height={40} /></td>
                            <td><Skeleton height={20} width={60}/></td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : activeTab === "worker_request" ? (
                    workerRequests.length > 0 ? (
                      workerRequests.map((worker) => (
                        <tr key={worker.id}>
                          <td className="p-3 text-left align-middle">
                            {worker.service}
                          </td>
                          <td className="p-3 text-left align-middle">
                            {worker.fullName}
                          </td>
                          <td className="p-3 text-left align-middle">
                            {worker.phoneNumber}
                          </td>
                          <td className="p-3 text-left align-middle">
                            {formatDate(worker.partnerJdate || "—")}
                          </td>
                          <td className="p-3 text-left align-middle">
                            {getStatusIcon(worker.joiningStatus)}
                          </td>
                          <td className="p-3 text-left align-middle">
                            {worker.joiningStatus === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      worker.id,
                                      "APPROVED",
                                      worker.phoneNumber
                                    )
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img src={tick} alt="Accept" width="25" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      worker.id,
                                      "REJECTED",
                                      worker.phoneNumber
                                    )
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img src={cross} alt="Reject" width="25" />
                                </button>
                              </>
                            )}
                            {worker.joiningStatus === "APPROVED" && (
                              <button
                                className="btn text-light me-2"
                                onClick={() =>
                                  navigate("/worker-details/add-worker")
                                }
                                style={{
                                  backgroundColor: "#0076CE",
                                  height: "32px",
                                  fontSize: "12px",
                                  padding: "5px 10px",
                                }}
                              >
                                Add Worker
                              </button>
                            )}
                            {worker.joiningStatus === "REJECTED" && (
                              <span>N/A</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No worker requests found.
                        </td>
                      </tr>
                    )
                  ) : supportTickets.length > 0 ? (
                    supportTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="text-left align-middle">
                          {ticket.service}
                        </td>
                        <td className="text-left align-middle">
                          {ticket.fullName}
                        </td>
                        <td
                          className="text-left align-middle"
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-wrap",
                            maxWidth: "200px",
                          }}
                        >
                          {ticket.email}
                        </td>
                        <td className="text-left align-middle">
                          {ticket.phoneNumber}
                        </td>
                        <td className="text-left align-middle">
                          {formatDate(ticket.issuedDate || "-")}
                        </td>
                        <td className="text-left align-middle">
                          <textarea
                            value={ticket.message}
                            readOnly
                            rows={2}
                            style={{
                              width: "100%",
                              border: "none",
                              background: "transparent",
                              resize: "none",
                              overflow: "auto",
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                            }}
                          />
                        </td>
                        <td className="text-left align-middle">
                          <button style={{marginLeft:"12px"}}>
                            <img src={mail} alt="Mail" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No support tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Enquiry;
