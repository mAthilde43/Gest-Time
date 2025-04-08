import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Vetements = () => {
  const [vetements, setVetements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/auth/vetements").then((res) => {
      if (res.data.Status) {
        setVetements(res.data.Result);
      }
    });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/auth/delete_vetements/${id}`)
      .then(() => {
        setVetements(vetements.filter((v) => v.id !== id));
      });
  };

  const filteredVetements = Array.isArray(vetements)
    ? vetements.filter(
        (v) =>
          (v.name && v.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (v.firstname &&
            v.firstname.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Tailles des vêtements</h3>
      </div>

      <div className="filter d-flex justify-content-between my-3">
        <Link to="/dashboard/add_vetements" className="btn add-button">
          Ajouter des Tailles
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
              <th>Veste</th>
              <th>Pull</th>
              <th>Pantalon</th>
              <th>Chaussures</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVetements.length > 0 ? (
              filteredVetements
                .sort((a, b) =>
                  `${a.name} ${a.firstname}`.localeCompare(
                    `${b.name} ${b.firstname}`
                  )
                )
                .map((v) => (
                  <tr key={v.id}>
                    <td>
                      {v.name} {v.firstname}
                    </td>
                    <td>{v.veste}</td>
                    <td>{v.pull}</td>
                    <td>{v.pantalon}</td>
                    <td>{v.chaussures}</td>
                    <td>
                      <Link
                        to={`/dashboard/edit_vetements/${v.id}`}
                        className="btn btn-info btn-sm me-2"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="btn btn-warning btn-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
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

export default Vetements;
