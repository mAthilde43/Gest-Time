import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Logo from "../../public/Images/logo-transparent-png.png";

const Dashboard = () => {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/admin")
      .then((res) => {
        if (res.data.Status) {
          setAdminName(res.data.Result.email); // Affiche directement l'email
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de l'admin :", err);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((result) => {
        console.log("Logout response:", result.data);
        if (result.data.Status) {
          navigate("/adminlogin");
        } else {
          console.error("Logout failed:", result.data);
        }
      })
      .catch((err) => {
        console.error("Error during logout:", err);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 color-dashboard">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none w-100"
            >
              <img src={Logo} alt="Logo" className="logo" />
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Tableau de bord
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/calendar"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-calendar ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Calendrier</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Employés</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/category"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Statut</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/absences"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-calendar-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Congés & Absences
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/vehicules"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-car-front ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Véhicules</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/profile"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profil</span>
                </Link>
              </li>
              <li className="w-100">
                <button
                  onClick={handleLogout}
                  className="nav-link text-white px-0 align-middle d-flex align-items-center bg-transparent border-0 w-100"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Déconnexion</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div
            className="p-2 d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "#8ae0ff",
            }}
          >
            <div className="ms-auto">
              <h3 style={{ fontSize: "18px", margin: "0 20px" }}>
                Bienvenue{" "}
                {adminName &&
                  adminName.split(/[.@]/)[0].charAt(0).toUpperCase() +
                    adminName.split(/[.@]/)[0].slice(1)}
                <span style={{ fontSize: "12px", marginLeft: "5px" }}>✨</span>
              </h3>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
