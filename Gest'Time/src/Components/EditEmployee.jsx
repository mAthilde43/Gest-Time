import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    firstname: "",
    phone: "",
    email: "",
    address: "",
    category_id: "",
    permis: "", // Nom du fichier permis actuel
  });

  const [category, setCategory] = useState([]);
  const [newPermis, setNewPermis] = useState(null); // Fichier PDF sélectionné

  useEffect(() => {
    // Récupérer les catégories
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Récupérer les données de l'employé
    axios
      .get("http://localhost:3000/auth/employee/" + id)
      .then((result) => {
        const data = result.data.Result[0];
        setEmployee({
          name: data.name,
          firstname: data.firstname,
          phone: data.phone,
          email: data.email,
          address: data.address,
          category_id: data.category_id,
          permis: data.permis, // nom du fichier PDF
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", employee.name);
    formData.append("firstname", employee.firstname);
    formData.append("phone", employee.phone);
    formData.append("email", employee.email);
    formData.append("address", employee.address);
    formData.append("category_id", employee.category_id);

    if (newPermis) {
      formData.append("permis", newPermis); // Nouveau fichier permis
    }

    axios
      .put(`http://localhost:3000/auth/edit_employee/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center title-form">
          Modifier l'employé : {employee.name} {employee.firstname}
        </h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Nom
            </label>
            <input
              type="text"
              className="form-control rounded-10"
              id="inputName"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputFirstName" className="form-label">
              Prénom
            </label>
            <input
              type="text"
              className="form-control rounded-10"
              id="inputFirstName"
              value={employee.firstname}
              onChange={(e) =>
                setEmployee({ ...employee, firstname: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              Téléphone
            </label>
            <input
              type="tel"
              className="form-control rounded-10"
              id="inputPhone"
              value={employee.phone}
              onChange={(e) =>
                setEmployee({ ...employee, phone: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-10"
              id="inputEmail"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Adresse
            </label>
            <input
              type="text"
              className="form-control rounded-10"
              id="inputAddress"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Statut
            </label>
            <select
              id="category"
              className="form-select"
              value={employee.category_id}
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
            >
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Permis actuel :</label>
            {employee.permis ? (
              <a
                href={`http://localhost:3000/Public/Permis/${employee.permis}`}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mb-2"
              >
                Voir le permis actuel (PDF)
              </a>
            ) : (
              <p className="text-muted">Aucun permis disponible</p>
            )}
            <label htmlFor="inputNewPermis" className="form-label">
              Modifier le permis de conduire
            </label>
            <input
              type="file"
              className="form-control rounded-10"
              id="inputNewPermis"
              accept="application/pdf"
              onChange={(e) => setNewPermis(e.target.files[0])}
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

export default EditEmployee;
