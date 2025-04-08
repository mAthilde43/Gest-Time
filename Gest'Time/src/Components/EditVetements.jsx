import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditVetements = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    veste: "",
    pull: "",
    pantalon: "",
    chaussures: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/vetements/${id}`).then((res) => {
      if (res.data.Status) {
        const v = res.data.Result[0];
        setData({
          veste: v.veste || "",
          pull: v.pull || "",
          pantalon: v.pantalon || "",
          chaussures: v.chaussures || "",
        });
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_vetements/${id}`, data)
      .then((res) => {
        if (res.data.Status) {
          navigate("/dashboard/vetements");
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center title-form">Modifier les tailles</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Veste</label>
            <input
              className="form-control rounded-10"
              value={data.veste}
              onChange={(e) => setData({ ...data, veste: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Pull</label>
            <input
              className="form-control rounded-10"
              value={data.pull}
              onChange={(e) => setData({ ...data, pull: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Pantalon</label>
            <input
              className="form-control rounded-10"
              value={data.pantalon}
              onChange={(e) => setData({ ...data, pantalon: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Chaussures</label>
            <input
              className="form-control rounded-10"
              value={data.chaussures}
              onChange={(e) => setData({ ...data, chaussures: e.target.value })}
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

export default EditVetements;
