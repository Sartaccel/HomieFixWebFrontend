
import "../styles/ServicePage.css";
import notification from "../assets/Bell.png";
import profile from "../assets/Profile.png";
import search from "../assets/Search.png";


const Services = () => {

  return (
    <>
      {/* Navbar */}
      <header className="header position-fixed d-flex justify-content-between align-items-center p-3 bg-white border-bottom w-100" style={{ zIndex: 1000 }}>
        <h2 className="heading align-items-center mb-0" style={{ marginLeft: "31px" }}>Services</h2>
        <div className="header-right d-flex align-items-center gap-3">
          <div className="input-group" style={{ width: "300px" }}>
            <input type="text" className="form-control search-bar" placeholder="Search" />
            <span className="input-group-text">
              <img src={search} alt="Search" width="20" />
            </span>
          </div>
          <img src={notification} alt="Notifications" width="40" className="cursor-pointer" />
          <img src={profile} alt="Profile" width="40" className="cursor-pointer" />
        </div>
      </header>

      <div className="container pt-5" style={{ paddingTop: "100px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3 mt-5" style={{ marginRight: "25px" }}>
          <h1 className=" px-3 pb-2 text-danger mx-3 fw-bold" style={{ position: "relative", top: "300px", left: "450px" }}>
            Coming soon 🐣
          </h1>
        </div>
      </div>
    </>
  );
};

export default Services;
