import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddVehicules = () => {
  const [vehicules, setVehicules] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedConducteur, setSelectedConducteur] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
        } else {
          console.error(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (value.length > 2 && value.length <= 5) {
      value = `${value.slice(0, 2)}-${value.slice(2)}`;
    } else if (value.length > 5) {
      value = `${value.slice(0, 2)}-${value.slice(2, 5)}-${value.slice(5, 7)}`;
    }

    setVehicules(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/auth/add_vehicules", {
        vehicules,
        conducteur_id: selectedConducteur || null,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/vehicules");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <div className="p-3 rounded w-25 border">
        <h2 className="title-form">
          Ajouter une nouvelle plaque d'immatriculation
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="vehicules">Plaque d'immatriculation :</label>
            <input
              type="text"
              name="vehicules"
              value={vehicules}
              placeholder="XX-XXX-XX"
              onChange={handleChange}
              className="form-control rounded-10"
              maxLength={10}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="conducteur">Conducteur (facultatif) :</label>
            <select
              className="form-select rounded-10"
              value={selectedConducteur}
              onChange={(e) => setSelectedConducteur(e.target.value)}
            >
              <option value="">Aucun conducteur</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} {emp.firstname}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-center">
            <button className="btn add-button w-50 rounded-10 mb-2">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicules;
