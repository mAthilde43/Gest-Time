import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

router.get("/admin", (req, res) => {
  const token = req.cookies.token;
  console.log("TOKEN >>>", token); // ← ajoute ça

  if (!token) {
    return res.status(401).json({ Status: false, Error: "Token manquant" });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      console.log("JWT ERROR >>>", err); // ← ajoute ça aussi
      return res.status(403).json({ Status: false, Error: "Token invalide" });
    }

    console.log("DECODED >>>", decoded); // ← et ça aussi
    return res.json({ Status: true, Result: { email: decoded.email } });
  });
});

router.get("/category", (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

//image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
//end image upload

router.post("/add_employee", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.json({ Status: false, Error: "Image is required!" });
  }

  const sql =
    "INSERT INTO employee (name, firstname, phone, email, address, image, category_id) VALUES (?)";
  // bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
  //   if (err) {
  //     console.error("Erreur de hashage :", err);
  //     return res.json({ Status: false, Error: "Error hashing password" });
  //   }
  const values = [
    req.body.name,
    req.body.firstname,
    req.body.phone,
    req.body.email,
    // hash,
    req.body.address,
    req.file.filename,
    req.body.category_id,
  ];

  con.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.json({ Status: false, Error: "Database Insertion Error" });
    }
    return res.json({ Status: true, Message: "Employee Added Successfully" });
  });
});
// });

router.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee set name= ?, firstname=?, phone= ?, email= ?, address= ?, category_id= ? WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.firstname,
    req.body.phone,
    req.body.email,
    req.body.address,
    req.body.category_id,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

router.get("/absences", (req, res) => {
  const sql = "SELECT * FROM absences";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });

    const absencesWithEmployeeName = [];

    result.forEach((absence) => {
      const getEmployeeNameSql =
        "SELECT name, firstname FROM employee WHERE id = ?";
      con.query(
        getEmployeeNameSql,
        [absence.employee_id],
        (err, employeeResult) => {
          if (err) {
            return res.json({
              Status: false,
              Error: "Erreur lors de la récupération du nom de l'employé" + err,
            });
          }

          absence.employee_name = `${
            employeeResult[0]?.name || "Nom inconnu"
          } ${employeeResult[0]?.firstname || "Prénom inconnu"}`;

          absencesWithEmployeeName.push(absence);

          if (absencesWithEmployeeName.length === result.length) {
            return res.json({ Status: true, Result: absencesWithEmployeeName });
          }
        }
      );
    });
  });
});

router.get("/absences/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM absences WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_absences", (req, res) => {
  const { employee_id, absence_type, start_date, end_date } = req.body;
  console.log("Données reçues :", req.body);

  if (!employee_id || !absence_type || !start_date || !end_date) {
    return res.status(400).json({
      Status: false,
      Error: "Tous les champs sont obligatoires",
    });
  }

  const sql =
    "INSERT INTO absences (employee_id, absence_type, start_date, end_date) VALUES (?, ?, ?, ?)";

  const values = [employee_id, absence_type, start_date, end_date];
  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion de l'absence :", err);
      return res.status(500).json({
        Status: false,
        Error: "Erreur lors de l'ajout de l'absence",
      });
    }
    return res.status(201).json({
      Status: true,
      Message: "Absence ajoutée avec succès",
    });
  });
});

router.put("/edit_absences/:id", (req, res) => {
  const { id } = req.params;
  const { employee_id, absence_type, start_date, end_date } = req.body;

  console.log("id recu:", id);

  const updateSql = `
    UPDATE absences 
    SET 
      employee_id = ?, 
      absence_type = ?, 
      start_date = ?, 
      end_date = ? 
    WHERE id = ?
  `;

  con.query(
    updateSql,
    [employee_id, absence_type, start_date, end_date, id],
    (err, result) => {
      if (err) {
        return res.json({
          Status: false,
          Error: "Erreur lors de la mise à jour de l'absence" + err,
        });
      }
      return res.json({
        Status: true,
        Message: "Absence mise à jour avec succès",
      });
    }
  );
});

router.delete("/delete_absences/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM absences WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/vehicules", (req, res) => {
  const sql = `
    SELECT vehicules.*, employee.name, employee.firstname
    FROM vehicules
    LEFT JOIN employee ON vehicules.conducteur_id = employee.id
    ORDER BY vehicules.vehicules ASC
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/vehicules/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT vehicules.*, employee.name, employee.firstname
    FROM vehicules
    LEFT JOIN employee ON vehicules.conducteur_id = employee.id
    WHERE vehicules.id = ?
  `;

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    if (result.length === 0)
      return res.json({ Status: false, Error: "Véhicule non trouvé" });

    return res.json({ Status: true, Result: result[0] });
  });
});

router.post("/add_vehicules", (req, res) => {
  const { vehicules, conducteur_id } = req.body;

  const sql =
    "INSERT INTO vehicules (`vehicules`, `conducteur_id`) VALUES (?, ?)";
  con.query(sql, [vehicules, conducteur_id || null], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.get("/vehicule/employee/:id", (req, res) => {
  const employeeId = req.params.id;
  const sql = `
    SELECT vehicules.*
    FROM vehicules
    WHERE conducteur_id = ?
  `;
  con.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error("Erreur récupération véhicules de l'employé :", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_vehicules/:id", (req, res) => {
  const id = req.params.id;
  const { vehicules, conducteur_id } = req.body;

  const sql =
    "UPDATE vehicules SET vehicules = ?, conducteur_id = ? WHERE id = ?";
  con.query(sql, [vehicules, conducteur_id, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Message: "Véhicule mis à jour" });
  });
});

router.delete("/delete_vehicules/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM vehicules WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ Status: false, Error: "Erreur suppression : " + err });
    return res.json({ Status: true, Result: result });
  });
});

// ROUTES VISITE MÉDICALE

// Récupérer toutes les visites médicales d'un employé
router.get("/visitmedical/:id", (req, res) => {
  const employeeId = req.params.id;
  const sql =
    "SELECT * FROM visitmedical WHERE employee_id = ? ORDER BY visitdate DESC";
  con.query(sql, [employeeId], (err, result) => {
    if (err)
      return res.status(500).json({ Status: false, Error: "Query Error" });
    return res.json(result);
  });
});

// Récupérer toutes les visites médicales avec nom/prénom employé
router.get("/visitmedical", (req, res) => {
  const sql = `
    SELECT visitmedical.*, employee.name, employee.firstname
    FROM visitmedical
    JOIN employee ON visitmedical.employee_id = employee.id
    ORDER BY visitdate ASC
  `;

  con.query(sql, (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des visites médicales :",
        err
      );
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Ajouter une visite médicale
router.post("/visitmedical", (req, res) => {
  const { employee_id, visitdate } = req.body;
  if (!employee_id || !visitdate) {
    return res
      .status(400)
      .json({ Status: false, Error: "Champs requis manquants" });
  }

  const sql = "INSERT INTO visitmedical (employee_id, visitdate) VALUES (?, ?)";
  con.query(sql, [employee_id, visitdate], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ Status: false, Error: "Erreur insertion visite médicale" });
    return res.json({ Status: true, Message: "Visite ajoutée avec succès" });
  });
});

// Supprimer une visite médicale
router.delete("/visitmedical/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM visitmedical WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ Status: false, Error: "Erreur suppression visite médicale" });
    return res.json({ Status: true, Message: "Visite supprimée" });
  });
});

// Modifier une visite médicale
router.put("/visitmedical/:id", (req, res) => {
  const id = req.params.id;
  const { visitdate } = req.body;
  const sql = "UPDATE visitmedical SET visitdate = ? WHERE id = ?";
  con.query(sql, [visitdate, id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ Status: false, Error: "Erreur mise à jour visite médicale" });
    return res.json({
      Status: true,
      Message: "Visite mise à jour avec succès",
    });
  });
});

export { router as adminRouter };
