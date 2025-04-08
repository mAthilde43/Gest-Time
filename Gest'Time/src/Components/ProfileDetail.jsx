import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ProfilDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [categories, setCategories] = useState([]);
  const [visits, setVisits] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [newVisitDate, setNewVisitDate] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/employee/${id}`).then((res) => {
      if (res.data.Status) {
        setEmployee(res.data.Result[0]);
      } else {
        alert(res.data.Error);
      }
    });

    axios.get("http://localhost:3000/auth/category").then((res) => {
      if (res.data.Status) {
        setCategories(res.data.Result);
      }
    });

    axios
      .get(`http://localhost:3000/auth/visitmedical/${id}`)
      .then((res) => setVisits(res.data));

    axios
      .get(`http://localhost:3000/auth/vehicule/employee/${id}`)
      .then((res) => {
        if (res.data.Status) {
          setVehicules(res.data.Result);
        }
      });
  }, [id]);

  const addVisitDate = () => {
    if (!newVisitDate) return alert("Veuillez choisir une date");

    axios
      .post("http://localhost:3000/auth/visitmedical", {
        employee_id: id,
        visitdate: newVisitDate,
      })
      .then(() => {
        return axios.get(`http://localhost:3000/auth/visitmedical/${id}`);
      })
      .then((res) => {
        setVisits(res.data);
        setNewVisitDate("");
      });
  };

  const deleteVisit = (visit_id) => {
    axios
      .delete(`http://localhost:3000/auth/visitmedical/${visit_id}`)
      .then(() => {
        setVisits(visits.filter((v) => v.id !== visit_id));
      });
  };

  const categoryName =
    categories.find((cat) => cat.id === employee.category_id)?.name ||
    "Inconnu";

  return (
    <div className="container mt-4">
      <div className="position-relative d-flex align-items-center mb-5">
        <Link to="/dashboard/profile" className="btn btn-link p-0">
          <i className="fs-4 bi-arrow-left"></i>
        </Link>

        <h2
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            margin: 0,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {employee.name} {employee.firstname}
        </h2>

        <div style={{ width: "2rem" }}></div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "100px",
          marginBottom: "2rem",
        }}
      >
        <div style={{ flex: "0 0 200px", textAlign: "center" }}>
          {employee.image && (
            <img
              src={`http://localhost:3000/Images/${employee.image}`}
              alt={employee.name}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "3px solid #ddd",
              }}
            />
          )}
        </div>

        <div style={{ flex: "0 0 400px" }}>
          <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
            <strong>Nom :</strong> {employee.name}
          </p>
          <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
            <strong>Prénom :</strong> {employee.firstname}
          </p>
          <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
            <strong>Téléphone :</strong> {employee.phone}
          </p>
          <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
            <strong>Email :</strong> {employee.email}
          </p>
          <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
            <strong>Adresse :</strong> {employee.address}
          </p>
          <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
            <strong>Catégorie :</strong> {categoryName}
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#f8f9fa",
          border: "1px solid #ddd",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "500px",
        }}
      >
        <h5>Visites Médicales :</h5>
        <div className="d-flex gap-2 align-items-center mb-3">
          <input
            type="date"
            value={newVisitDate}
            onChange={(e) => setNewVisitDate(e.target.value)}
            className="form-control w-50"
          />
          <button className="btn btn-success btn-sm" onClick={addVisitDate}>
            Ajouter
          </button>
        </div>
        <ul className="list-group">
          {visits.length > 0 ? (
            visits.map((v) => (
              <li
                key={v.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {new Date(v.visitdate).toLocaleDateString()}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteVisit(v.id)}
                >
                  Supprimer
                </button>
              </li>
            ))
          ) : (
            <li className="list-group-item">Aucune visite enregistrée</li>
          )}
        </ul>
      </div>

      <div
        style={{
          background: "#f8f9fa",
          border: "1px solid #ddd",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "500px",
          marginTop: "2rem",
        }}
      >
        <h5>Véhicules assignés :</h5>
        <ul className="list-group">
          {vehicules.length > 0 ? (
            vehicules.map((v) => (
              <li key={v.id} className="list-group-item">
                {v.vehicules}
              </li>
            ))
          ) : (
            <li className="list-group-item">Aucun véhicule assigné</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfilDetail;
