import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    firstname: "",
    phone: "",
    email: "",
    address: "",
    category_id: "",
    image: "",
    permis: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("firstname", employee.firstname);
    formData.append("phone", employee.phone);
    formData.append("email", employee.email);
    formData.append("address", employee.address);
    formData.append("image", employee.image);
    formData.append("category_id", employee.category_id);
    formData.append("permis", employee.permis);

    axios
      .post("http://localhost:3000/auth/add_employee", formData, {
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
    <div className="d-flex justify-content-center align-items-center mt-3 ">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center title-form">Ajouter un Nouvel Employé</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Nom
            </label>
            <input
              type="text"
              className="form-control rounded-10"
              id="inputName"
              placeholder="Entrer le Nom"
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
              placeholder="Entrer le Prénom"
              onChange={(e) =>
                setEmployee({ ...employee, firstname: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              N° téléphone
            </label>
            <input
              type="tel"
              className="form-control rounded-10"
              id="inputPhone"
              placeholder="Entrer le Numéro de Téléphone"
              autoComplete="off"
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
              placeholder="Entrer l'Email"
              autoComplete="off"
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
              placeholder="Entrer l'Adresse"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Status
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
            >
              {category.map((c) => {
                return (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Sélectionner une Image
            </label>
            <input
              type="file"
              className="form-control rounded-10"
              id="inputGroupFile01"
              name="image"
              //   accept="image/*"
              onChange={(e) =>
                setEmployee({ ...employee, image: e.target.files[0] })
              }
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputPermis">
              Télécharger le Permis de Conduire
            </label>
            <input
              type="file"
              className="form-control rounded-10"
              id="inputPermis"
              name="permis"
              accept="application/pdf"
              onChange={(e) =>
                setEmployee({ ...employee, permis: e.target.files[0] })
              }
            />
          </div>

          <div className="d-flex justify-content-center ">
            <button className="btn add-button w-50">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
