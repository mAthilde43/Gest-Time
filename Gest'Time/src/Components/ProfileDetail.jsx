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
  const [vetement, setVetement] = useState(null);
  const [scans, setScans] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/employee/${id}`).then((res) => {
      if (res.data.Status) setEmployee(res.data.Result[0]);
    });

    axios.get("http://localhost:3000/auth/category").then((res) => {
      if (res.data.Status) setCategories(res.data.Result);
    });

    axios
      .get(`http://localhost:3000/auth/visitmedical/${id}`)
      .then((res) => setVisits(res.data));

    axios
      .get(`http://localhost:3000/auth/vehicule/employee/${id}`)
      .then((res) => {
        if (res.data.Status) setVehicules(res.data.Result);
      });

    axios.get("http://localhost:3000/auth/vetements").then((res) => {
      if (res.data.Status) {
        const found = res.data.Result.find(
          (v) => v.employee_id === parseInt(id)
        );
        if (found) setVetement(found);
      }
    });
    axios.get(`http://localhost:3000/auth/scans/${id}`).then((res) => {
      if (res.data.Status) setScans(res.data.Result);
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

  const handleScanUpload = () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("scans", file);
    });

    axios
      .post(`http://localhost:3000/auth/upload_scans/${id}`, formData)
      .then(() => {
        return axios.get(`http://localhost:3000/auth/scans/${id}`);
      })
      .then((res) => {
        if (res.data.Status) {
          setScans(res.data.Result);
          setSelectedFiles([]);
        }
      });
  };

  const deleteScan = (scanId) => {
    axios
      .delete(`http://localhost:3000/auth/delete_scan/${scanId}`)
      .then(() => {
        setScans(scans.filter((s) => s.id !== scanId));
      });
  };

  const categoryName =
    categories.find((cat) => cat.id === employee.category_id)?.name ||
    "Inconnu";

  return (
    <div className="container mt-4">
      {/* Header */}
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

      {/* Informations personnelles */}
      <div className="d-flex justify-content-center align-items-start gap-5 mb-5">
        <div style={{ flex: "0 0 200px", textAlign: "center" }}>
          {employee.image && (
            <img
              src={`http://localhost:3000/Public/Images/${employee.image}`}
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
          <p>
            <strong>Nom :</strong> {employee.name}
          </p>
          <p>
            <strong>Prénom :</strong> {employee.firstname}
          </p>
          <p>
            <strong>Téléphone :</strong> {employee.phone}
          </p>
          <p>
            <strong>Email :</strong> {employee.email}
          </p>
          <p>
            <strong>Adresse :</strong> {employee.address}
          </p>
          <p>
            <strong>Catégorie :</strong> {categoryName}
          </p>
        </div>
      </div>

      {/* Bloc sections : Visites - Véhicules - Vêtements */}
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {/* Visites médicales */}
        <div className="p-3 border rounded bg-light" style={{ width: "350px" }}>
          <h5 className="text-center">Visites Médicales</h5>
          <div className="d-flex gap-2 align-items-center mb-3">
            <input
              type="date"
              value={newVisitDate}
              onChange={(e) => setNewVisitDate(e.target.value)}
              className="form-control"
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

        {/* Véhicules */}
        <div className="p-3 border rounded bg-light" style={{ width: "350px" }}>
          <h5 className="text-center">Véhicules assignés</h5>
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

        {vetement && (
          <div
            className="p-3 border rounded bg-light"
            style={{ width: "350px" }}
          >
            <h5 className="text-center">Tailles de vêtements</h5>
            <div className="row">
              <div className="col-6">
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Veste :</strong>
                    <span>{vetement.veste || "Non renseigné"}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Pantalon :</strong>
                    <span>{vetement.pantalon || "Non renseigné"}</span>
                  </li>
                </ul>
              </div>
              <div className="col-6">
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Pull :</strong>
                    <span>{vetement.pull || "Non renseigné"}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Chaussures :</strong>
                    <span>{vetement.chaussures || "Non renseigné"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Permis de conduire + SCANS côte à côte */}
      <div
        className="d-flex justify-content-center gap-4 mt-5"
        style={{ flexWrap: "wrap" }}
      >
        {/* Permis de conduire */}
        <div className="p-3 border rounded bg-light" style={{ width: "48%" }}>
          <h5 className="text-center">Permis de conduire</h5>
          {employee.permis ? (
            <iframe
              src={`http://localhost:3000/Public/Permis/${employee.permis}`}
              width="100%"
              height="500px"
              style={{ borderRadius: "8px", marginTop: "1rem" }}
              title="Permis de conduire"
            />
          ) : (
            <p className="text-muted">Aucun permis enregistré</p>
          )}
        </div>

        {/* SCANS */}
        <div className="p-3 border rounded bg-light" style={{ width: "48%" }}>
          <h5 className="text-center">SCANS</h5>
          <div className="mb-3">
            <input
              type="file"
              multiple
              accept="application/pdf"
              className="form-control"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
            <button className="btn btn-primary mt-2" onClick={handleScanUpload}>
              Télécharger
            </button>
          </div>
          <ul className="list-group">
            {scans.length > 0 ? (
              scans.map((scan) => (
                <li
                  key={scan.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <a
                    href={`http://localhost:3000/Public/Scans/${scan.namescans}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {scan.namescans}
                  </a>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteScan(scan.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))
            ) : (
              <li className="list-group-item">Aucun document scanné</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilDetail;
