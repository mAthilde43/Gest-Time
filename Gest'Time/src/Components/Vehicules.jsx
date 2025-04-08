import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/vehicules")
      .then((result) => {
        if (result.data.Status) {
          const sorted = result.data.Result.sort((a, b) =>
            a.vehicules.localeCompare(b.vehicules)
          );
          setVehicules(sorted);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce véhicule ?")) {
      axios
        .delete("http://localhost:3000/auth/delete_vehicules/" + id)
        .then((res) => {
          if (res.data.Status) {
            setVehicules(vehicules.filter((v) => v.id !== id));
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log("Erreur suppression véhicule :", err));
    }
  };

  const filteredVehicules = vehicules.filter((v) => {
    const query = searchTerm.toLowerCase();
    return (
      v.vehicules.toLowerCase().includes(query) ||
      (v.name && v.name.toLowerCase().includes(query)) ||
      (v.firstname && v.firstname.toLowerCase().includes(query))
    );
  });

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Liste des plaques d'immatriculation</h3>
      </div>

      <div className="filter d-flex justify-content-between my-3">
        <Link to="/dashboard/add_vehicules" className="btn add-button">
          Nouvelle plaque d'immatriculation
        </Link>
        <input
          type="text"
          placeholder="Nom, prénom ou plaque"
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>N° d'immatriculation</th>
              <th>Conducteur</th>
              <th>Assurance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicules.map((v) => (
              <tr key={v.id}>
                <td>{v.vehicules}</td>
                <td>
                  {v.name && v.firstname ? `${v.name} ${v.firstname}` : ""}
                </td>
                <td>
                  {v.assurance ? (
                    <a
                      href={`http://localhost:3000/Public/Assurances/${v.assurance}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-dark d-inline-block"
                      title="Voir l'assurance"
                    >
                      <i className="bi bi-eye-fill fs-5"></i>
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <Link
                    to={`/dashboard/edit_vehicules/${v.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Modifier
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(v.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {filteredVehicules.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  Aucun véhicule trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicules;
