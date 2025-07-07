import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import alenSamImg from "../assets/home1.png";
import Header from "./Header";
import api from "../api";

function UserDetails() {
  const UserDetails = [
    {
      name: "subin",
      contactNumber: "1234567890",
      address: "Nagercoil",
      totalBookings: 1,
      lastBooking: "10-08-2002",
      profile:alenSamImg
    },
    {
      name: "sundar",
      contactNumber: "45632178",
      address: "Kanyakumari",
      totalBookings: 2,
      lastBooking: "10-08-2002",
    },
    {
      name: "Subi",
      contactNumber: "7896541203",
      address: "NGL",
      totalBookings: 0,
      lastBooking: "10-08-2002",
    },
  ];
  return (
    <div>
      <Header />

      <div className="container pt-5" style={{ paddingTop: "80px" }}>
        <div
          className="d-flex justify-content-between align-items-center mb-3 mt-5"
          style={{ marginRight: "25px" }}
        >
          <h5
            className="px-3 pb-2 text-black mx-3"
            style={{ borderBottom: "3px solid #000" }}
          >
            User Details
          </h5>
          <div className="d-flex align-items-center gap-2 mb-3">
            <button
              className="btn border text-black"
              //   onClick={() => setShowFilter(true)}
            >
              <i className="bi bi-calendar me-2"></i>
              Filter
            </button>
            <div className="dropdown ms-2">
              <button
                className="btn text-light dropdown-toggle"
                type="button"
                id="sortByDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ backgroundColor: "#0076CE" }}
              >
                Sort By
              </button>
              <ul className="dropdown-menu" aria-labelledby="sortByDropdown">
                <li>
                  <button
                    className="dropdown-item"
                    // onClick={() => handleSort("Ascending")}
                  >
                    Ascending
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    // onClick={() => handleSort("Descending")}
                  >
                    Desending
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <table
            className="table table-hover"
            style={{
              width: "100%",
              marginBottom: "0",
              tableLayout: "fixed",
            }}
          >
            <thead
              className="table-light"
              style={{ position: "sticky", top: 0, zIndex: 2 }}
            >
              <tr>
                <th
                  style={{
                    width: "5%",
                    padding: "12px",
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    // onChange={handleSelectAll} // You can define logic for select all
                  />
                </th>
                <th
                  style={{
                    width: "13%",
                    padding: "12px",
                    verticalAlign: "middle",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "12px",
                    verticalAlign: "middle",
                  }}
                >
                  Contact
                </th>
                <th
                  style={{
                    width: "20%",
                    padding: "12px",
                    verticalAlign: "middle",
                  }}
                >
                  Address
                </th>
                <th
                  style={{
                    width: "8%",
                    padding: "12px",
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  Total Bookings
                </th>
                <th
                  style={{
                    width: "7%",
                    padding: "12px",
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  Last Booking
                </th>
                <th
                  className="text-centered"
                  style={{
                    width: "3%",
                    padding: "12px",
                    verticalAlign: "middle",
                  }}
                >
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {UserDetails.map((user, index) => (
                <tr key={index}>
                  <td className="text-center" style={{verticalAlign: "middle",textAlign:"center"}}>
                    <input type="checkbox" />
                  </td>
                    <td className="d-flex align-items-center gap-2">
                      <img
                        src={user.profile}
                        alt={user.name}
                        style={{
                          width: "31px",
                          height: "31px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      {user.name}
                  </td>
                  <td style={{verticalAlign: "middle"}}>{user.contactNumber }</td>
                  <td style={{verticalAlign: "middle"}}>{user.address}</td>
                  <td className="text-center" style={{verticalAlign: "middle"}}>{user.totalBookings}</td>
                  <td className="text-center" style={{verticalAlign: "middle"}}>{user.lastBooking}</td>
                  <td className="text-center" style={{verticalAlign: "middle"}}>
                    <button className="btn p-0 border-0 bg-transparent">
                      <i className="bi bi-eye"
                        style={{ color: "black", fontSize: "1.2rem" }} ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;