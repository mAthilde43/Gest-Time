import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditVehicules = () => {
  const [vehicule, setVehicule] = useState("");
  const [employees, setEmployees] = useState([]);
  const [conducteurId, setConducteurId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchEmployees();
    fetchVehiculeDetails();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchVehiculeDetails = () => {
    axios
      .get("http://localhost:3000/auth/vehicules/" + id)
      .then((res) => {
        if (res.data.Status) {
          const vehiculeData = res.data.Result;
          setVehicule(vehiculeData.vehicules);
          setConducteurId(vehiculeData.conducteur_id || "");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/edit_vehicules/" + id, {
        vehicules: vehicule,
        conducteur_id: conducteurId || null,
      })
      .then((res) => {
        if (res.data.Status) {
          navigate("/dashboard/vehicules");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <h3 className="mt-3">Modifier le véhicule</h3>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label className="form-label">Plaque d'immatriculation</label>
          <input
            type="text"
            className="form-control"
            value={vehicule}
            onChange={(e) => setVehicule(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Conducteur (facultatif)</label>
          <select
            className="form-select"
            value={conducteurId || ""}
            onChange={(e) => setConducteurId(e.target.value || null)}
          >
            <option value="">-- Aucun conducteur --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.firstname}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  );
};

export default EditVehicules;
