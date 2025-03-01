import React from "react";



const StarRating = ({ rating }) => {
  if (rating === undefined || rating === null) return null; // Prevent rendering if rating is missing

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <i className="bi bi-star-fill" style={{ color: "#FFD700", fontSize: "16px" }}></i>
      <span style={{ fontSize: "15px", color: "#333" }}>{rating.toFixed(1)}</span>
    </div>
  );
};

// Usage:
{worker && <StarRating rating={worker.rating || 4.5} />}

export default StarRating;
