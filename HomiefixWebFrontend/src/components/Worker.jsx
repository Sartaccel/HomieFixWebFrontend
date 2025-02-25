import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Worker = () => {
  const { id } = useParams(); // Get the worker ID from URL
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2222/workers/view/${id}`);
        const data = await response.json();
        setWorker(data);
      } catch (error) {
        console.error("Error fetching worker details:", error);
      }
    };

    fetchWorkerDetails();
  }, [id]);

  if (!worker) {
    return <p>Loading worker details...</p>;
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back to List
      </button>
      <h4>{worker.name}</h4>
      <p>Role: {worker.role}</p>
      <p>Contact: {worker.contactNumber}</p>
      <p>Rating: {worker.averageRating || "N/A"}</p>
      <p>
        Address: {`${worker.houseNumber}, ${worker.town}, ${worker.nearbyLandmark}, 
        ${worker.district}, ${worker.state}, ${worker.pincode}`}
      </p>
      <p>Joining Date: {worker.joiningDate}</p>
    </div>
  );
};

export default Worker;
