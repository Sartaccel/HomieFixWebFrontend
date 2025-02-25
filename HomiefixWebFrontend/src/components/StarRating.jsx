import React from "react";



const StarRating = ({ rating }) => {
  return (
    <div style={{ marginTop: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
    {/* Single Star */}
    <span style={{ fontSize: "20px", color: "gold", marginleft:"10px"}}>★</span>

    {/* Show Numeric Rating */}
    <span style={{ fontSize: "15px",  color: "#333" }}>
      {rating.toFixed(1)}
    </span>
  </div>
  );
};

export default StarRating;
