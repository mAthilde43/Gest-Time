import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddVetements = () => {
  const [employees, setEmployees] = useState([]);
  const [data, setData] = useState({
    employee_id: "",
    veste: "",
    pull: "",
    pantalon: "",
    chaussures: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/auth/employee").then((res) => {
      if (res.data.Status) {
        setEmployees(res.data.Result);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/auth/add_vetements", data).then((res) => {
      if (res.data.Status) {
        navigate("/dashboard/vetements");
      } else {
        alert("Erreur lors de l'ajout des tailles");
      }
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center title-form">Ajouter des tailles</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="employee" className="form-label">
              Employé
            </label>
            <select
              className="form-select"
              value={data.employee_id}
              onChange={(e) =>
                setData({ ...data, employee_id: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un employé</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} {e.firstname}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Veste</label>
            <input
              type="text"
              className="form-control"
              value={data.veste}
              onChange={(e) => setData({ ...data, veste: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Pull</label>
            <input
              type="text"
              className="form-control"
              value={data.pull}
              onChange={(e) => setData({ ...data, pull: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Pantalon</label>
            <input
              type="text"
              className="form-control"
              value={data.pantalon}
              onChange={(e) => setData({ ...data, pantalon: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Chaussures</label>
            <input
              type="text"
              className="form-control"
              value={data.chaussures}
              onChange={(e) => setData({ ...data, chaussures: e.target.value })}
            />
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn add-button w-50">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVetements;
