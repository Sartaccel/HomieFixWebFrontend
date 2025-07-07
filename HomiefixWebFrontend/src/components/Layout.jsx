import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; // To render nested routes

const Layout = () => {
  return (
    <div className="d-flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content flex-grow-1 " style={{ marginLeft: "210px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
