import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Category = () => {
  const [category, setCategory] = useState([]);

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

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Liste des Statut</h3>
      </div>
      <Link to="/dashboard/add_category" className="btn add-button">
        Nouveau Statut
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {category
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <tr>
                  <td>{c.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
