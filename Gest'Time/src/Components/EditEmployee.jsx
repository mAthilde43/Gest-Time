import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  console.log("Id récupéré:", id);

  const [employee, setEmployee] = useState({
    name: "",
    firstname: "",
    phone: "",
    email: "",
    address: "",
    category_id: "",
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

    axios
      .get("http://localhost:3000/auth/employee/" + id)
      .then((result) => {
        setEmployee({
          ...employee,
          name: result.data.Result[0].name,
          firstname: result.data.Result[0].firstname,
          phone: result.data.Result[0].phone,
          email: result.data.Result[0].email,
          address: result.data.Result[0].address,
          category_id: result.data.Result[0].category_id,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/edit_employee/" + id, employee)
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
        <h3 className="text-center title-form">
          Modifier l'employé : {employee.name ? employee.name : "Employé"}{" "}
          {employee.firstname ? employee.firstname : ""}
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
              placeholder="Enter le Nom"
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
              placeholder="Entrer le Prénom"
              value={employee.firstname}
              onChange={(e) =>
                setEmployee({ ...employee, firstname: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              N° de téléphone
            </label>
            <input
              type="tel"
              className="form-control rounded-10"
              id="inputPhone"
              placeholder="Entrer le Numéro de Téléphone"
              autoComplete="off"
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
              placeholder="Entrer l'Email"
              autoComplete="off"
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
              placeholder="Entrer l'Adresse"
              autoComplete="off"
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

          <div className="d-flex justify-content-center">
            <button className="btn add-button w-50">Modifier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
