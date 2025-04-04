import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../../public/Images/drawCalendar.jpg";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/auth/adminlogin", values)
      .then((result) => {
        if (result.data.loginStatus) {
          navigate("/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <h1 className="gest-time-title text-center">Gest-time</h1>
      <div className="loginContainer">
        <div className="loginImage">
          <img src={loginImage} alt="Login Illustration" />
        </div>

        <div className="p-3 rounded w-25 loginForm">
          <div className="text-warning">{error && error}</div>
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter Email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                className="form-control rounded-10"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                className="form-control rounded-10"
              />
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn custom-btn w-50 rounded-10 mb-2">
                Se connecter
              </button>
            </div>
            <div className="mb-1">
              <input type="checkbox" name="tick" id="tick" className="me-2" />
              <label htmlFor="password">
                You are Agree with terms & conditions
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
