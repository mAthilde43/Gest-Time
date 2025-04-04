import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [category, setCategory] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/add_category", {
        category,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/category");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-75 ">
      <div className="p-3 rounded w-25 border">
        <h2 className="title-form">Ajouter un Nouveau Statut</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="category">Statut:</label>
            <input
              type="text"
              name="category"
              placeholder="Entrer le Nouveau Statut"
              onChange={(e) => setCategory(e.target.value)}
              className="form-control rounded-10"
            />
          </div>

          <div className="d-flex justify-content-center">
            <button className="btn add-button w-50 rounded-10 mb-2">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
