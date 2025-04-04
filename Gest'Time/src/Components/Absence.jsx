import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Absence = () => {
  const [absences, setAbsences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/absences")
      .then((result) => {
        console.log(result.data); // Vérifie ce que tu reçois du serveur
        if (result.data.Status) {
          setAbsences(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log("Erreur API :", err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_absences/" + id)
      .then((result) => {
        if (result.data.Status) {
          setAbsences(absences.filter((absence) => absence.id !== id));
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log("Erreur suppression :", err));
  };

  const filteredAbsences = Array.isArray(absences)
    ? absences.filter(
        (e) =>
          (e.employee_name &&
            e.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (e.employee_firstname &&
            e.employee_firstname
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Liste des Congés & Absences</h3>
      </div>

      <div className="filter d-flex justify-content-between my-3">
        <Link to="/dashboard/add_absences" className="btn add-button">
          Ajouter une Absence
        </Link>
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom"
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Type d'Absence</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAbsences.length > 0 ? (
              filteredAbsences
                .sort((a, b) => b.id - a.id)
                .map((a) => (
                  <tr key={a.id}>
                    <td>
                      {a.employee_name} {a.employee_firstname}
                    </td>
                    <td>{a.absence_type}</td>
                    <td>
                      {a.start_date
                        ? new Date(a.start_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {a.end_date
                        ? new Date(a.end_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <Link
                        to={`/dashboard/edit_absences/${a.id}`}
                        className="btn btn-info btn-sm me-2"
                      >
                        Modifier
                      </Link>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleDelete(a.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Absence;
