import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log("Erreur lors du chargement :", err));
  }, []);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Profil des Employés</h3>
      </div>

      <div className="filter d-flex justify-content-between align-items-center my-3">
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
              <th>Nom</th>
              <th>Prénom</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.firstname}</td>
                  <td>
                    <Link
                      to={`/dashboard/profile/${e.id}`}
                      className="btn btn-info btn-sm"
                    >
                      Voir plus
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
