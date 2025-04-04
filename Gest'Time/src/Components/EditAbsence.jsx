import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditAbsence = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  const [absence, setAbsence] = useState({
    employee_id: "",
    absence_type: "",
    start_date: "",
    end_date: "",
  });
  const [employee, setEmployee] = useState([]);

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

    axios
      .get(`http://localhost:3000/auth/absences/${id}`)
      .then((result) => {
        if (result.data.Status && result.data.Result.length > 0) {
          const absenceData = result.data.Result[0];
          setAbsence({
            ...absenceData,
            start_date: formatDate(absenceData.start_date),
            end_date: formatDate(absenceData.end_date),
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/edit_absences/" + id, absence)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/absences");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center title-form">Modifier l'absence</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="employee" className="form-label">
              Employé
            </label>
            <select
              id="employee"
              className="form-select"
              value={absence.employee_id}
              onChange={(e) =>
                setAbsence({ ...absence, employee_id: e.target.value })
              }
            >
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
            <input
              type="text"
              className="form-control rounded-10"
              id="absence_type"
              value={absence.absence_type}
              onChange={(e) =>
                setAbsence({ ...absence, absence_type: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="start_date" className="form-label">
              Date de Début
            </label>
            <input
              type="date"
              className="form-control rounded-10"
              id="start_date"
              value={absence.start_date}
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
              value={absence.end_date}
              onChange={(e) =>
                setAbsence({ ...absence, end_date: e.target.value })
              }
            />
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn add-button w-50">Modifier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAbsence;
