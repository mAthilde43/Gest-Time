import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
          setEmployeeTotal(result.data.Result.length);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const filteredEmployees = employee.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Liste des Employés</h3>
      </div>

      <div className="d-flex justify-content-end my-2">
        <h5>Total des Employés : {employeeTotal}</h5>
      </div>

      <div className="filter">
        <Link to="/dashboard/add_employee" className="btn add-button">
          Nouvel Employé
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
              <th>Image</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>N°</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Permis</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees
              .sort((a, b) => a.name.localeCompare(b.name)) // tri alphabétique sur le nom
              .map((e) => (
                <tr key={e.id}>
                  <td>
                    <img
                      src={`http://localhost:3000/Public/Images/${e.image}`}
                      alt={employee.name}
                      className="employee_image"
                    />
                  </td>
                  <td>{e.name}</td>
                  <td>{e.firstname}</td>
                  <td>{e.phone}</td>
                  <td>{e.email}</td>
                  <td>{e.address}</td>
                  <td>
                    {e.permis ? (
                      <a
                        href={`http://localhost:3000/Public/Permis/${e.permis}`}
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
                      to={"/dashboard/edit_employee/" + e.id}
                      className="btn btn-info btn-sm me-2"
                    >
                      Modifier
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(e.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
