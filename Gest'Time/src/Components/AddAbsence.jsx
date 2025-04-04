import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAbsence = () => {
  const [absence, setAbsence] = useState({
    employee_id: "",
    absence_type: "",
    start_date: "",
    end_date: "",
  });
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(absence);
    axios
      .post("http://localhost:3000/auth/add_absences", absence)
      .then((result) => {
        console.log(result.data);
        if (result.data.Status) {
          navigate("/dashboard/absences");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const absenceTypes = [
    "Congé payé",
    "Congé sans solde",
    "Arrêt maladie",
    "RTT",
    "Absence injustifiée",
    "Congé maternité/paternité",
    "Autre",
  ];

  return (
    <div className="d-flex justify-content-center align-items-center mt-3 ">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center title-form">Ajouter une Absence</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="employee" className="form-label">
              Employé
            </label>
            <select
              id="employee"
              className="form-select"
              onChange={(e) =>
                setAbsence({ ...absence, employee_id: e.target.value })
              }
              value={absence.employee_id}
            >
              <option value="">Sélectionner un employé</option>
              {employee.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} {e.firstname}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="absence_type" className="form-label">
              Type d'Absence
            </label>
            <select
              className="form-select"
              id="absence_type"
              value={absence.absence_type}
              onChange={(e) =>
                setAbsence({ ...absence, absence_type: e.target.value })
              }
            >
              <option value="">Sélectionner un type d'absence</option>
              {absenceTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="start_date" className="form-label">
              Date de Début
            </label>
            <input
              type="date"
              className="form-control rounded-10"
              id="start_date"
              onChange={(e) =>
                setAbsence({ ...absence, start_date: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="end_date" className="form-label">
              Date de Fin
            </label>
            <input
              type="date"
              className="form-control rounded-10"
              id="end_date"
              onChange={(e) =>
                setAbsence({ ...absence, end_date: e.target.value })
              }
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

export default AddAbsence;
