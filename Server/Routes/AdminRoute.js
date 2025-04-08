import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// const verifyToken = require("../middleware/verifyToken.js");

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

router.get("/verify", verifyToken, (req, res) => {
  res.json({ Status: true });
});

router.get("/category", verifyToken, (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", verifyToken, (req, res) => {
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

const storagePermis = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "Public/Images");
    } else if (file.fieldname === "permis") {
      cb(null, "Public/Permis");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadEmployee = multer({ storage: storagePermis });

router.post(
  "/add_employee",
  verifyToken,
  uploadEmployee.fields([
    { name: "image", maxCount: 1 },
    { name: "permis", maxCount: 1 },
  ]),
  (req, res) => {
    if (!req.files || !req.files.image || !req.files.permis) {
      return res.json({ Status: false, Error: "Image et permis requis !" });
    }

    const sql = `
    INSERT INTO employee 
    (name, firstname, phone, email, address, image, permis, category_id) 
    VALUES (?)`;

    const values = [
      req.body.name,
      req.body.firstname,
      req.body.phone,
      req.body.email,
      req.body.address,
      req.files.image[0].filename,
      req.files.permis[0].filename,
      req.body.category_id,
    ];

    con.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res.json({ Status: false, Error: "Erreur insertion employé" });
      }
      return res.json({ Status: true, Message: "Employé ajouté avec permis" });
    });
  }
);

router.get("/employee", verifyToken, (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put(
  "/edit_employee/:id",
  verifyToken,
  uploadEmployee.fields([{ name: "permis", maxCount: 1 }]),
  (req, res) => {
    const id = req.params.id;
    const { name, firstname, phone, email, address, category_id } = req.body;

    let sql = "";
    let values = [];

    if (req.files && req.files.permis) {
      // Si un nouveau permis est envoyé
      const permis = req.files.permis[0].filename;
      sql = `UPDATE employee SET name=?, firstname=?, phone=?, email=?, address=?, category_id=?, permis=? WHERE id = ?`;
      values = [
        name,
        firstname,
        phone,
        email,
        address,
        category_id,
        permis,
        id,
      ];
    } else {
      // Si aucun permis envoyé
      sql = `UPDATE employee SET name=?, firstname=?, phone=?, email=?, address=?, category_id=? WHERE id = ?`;
      values = [name, firstname, phone, email, address, category_id, id];
    }

    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error: " + err });
      return res.json({ Status: true, Result: result });
    });
  }
);

router.delete("/delete_employee/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", verifyToken, (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/logout", verifyToken, (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

router.get("/absences", verifyToken, (req, res) => {
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

router.get("/absences/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM absences WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_absences", verifyToken, (req, res) => {
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

router.put("/edit_absences/:id", verifyToken, (req, res) => {
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

router.delete("/delete_absences/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM absences WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

const storageAssurance = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Assurances");
  },
  filename: (req, file, cb) => {
    cb(null, "assurance_" + Date.now() + path.extname(file.originalname));
  },
});

const uploadAssurance = multer({ storage: storageAssurance });

router.get("/vehicules", verifyToken, (req, res) => {
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

router.get("/vehicules/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT vehicules*, employee.name, employee.firstname
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

router.post(
  "/add_vehicules",
  verifyToken,
  uploadAssurance.single("assurance"),
  (req, res) => {
    const { vehicules, conducteur_id } = req.body;
    const assuranceFile = req.file ? req.file.filename : null;

    const sql =
      "INSERT INTO vehicules (vehicules, conducteur_id, assurance) VALUES (?, ?, ?)";
    con.query(
      sql,
      [vehicules, conducteur_id || null, assuranceFile],
      (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
      }
    );
  }
);

router.get("/vehicule/employee/:id", verifyToken, (req, res) => {
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

router.put(
  "/edit_vehicules/:id",
  verifyToken,
  uploadAssurance.single("assurance"),
  (req, res) => {
    const id = req.params.id;
    const { vehicules, conducteur_id } = req.body;
    const assuranceFile = req.file ? req.file.filename : null;

    // Construire dynamiquement la requête SQL
    let sql;
    let values;

    if (assuranceFile) {
      sql = `UPDATE vehicules SET vehicules = ?, conducteur_id = ?, assurance = ? WHERE id = ?`;
      values = [vehicules, conducteur_id || null, assuranceFile, id];
    } else {
      sql = `UPDATE vehicules SET vehicules = ?, conducteur_id = ? WHERE id = ?`;
      values = [vehicules, conducteur_id || null, id];
    }

    con.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true, Message: "Véhicule mis à jour" });
    });
  }
);

router.delete("/delete_vehicules/:id", verifyToken, (req, res) => {
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
router.get("/visitmedical/:id", verifyToken, (req, res) => {
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
router.get("/visitmedical", verifyToken, (req, res) => {
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
router.post("/visitmedical", verifyToken, (req, res) => {
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
router.delete("/visitmedical/:id", verifyToken, (req, res) => {
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
router.put("/visitmedical/:id", verifyToken, (req, res) => {
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

// Ajoute ces routes à ton fichier AdmionRoute.js

// GET toutes les tailles avec les noms d'employés

router.get("/vetements", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      vetements.id,
      vetements.employee_id,
      employee.firstname,
      employee.name,
      vetements.veste,
      vetements.pull,
      vetements.pantalon,
      vetements.chaussures
    FROM vetements
    LEFT JOIN employee ON vetements.employee_id = employee.id
  `;

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors du chargement des vêtements :", err);
      return res.status(500).json({ Status: false, Error: err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get("/vetements/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM vetements WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des vêtements :", err);
      return res.status(500).json({ Status: false, Error: err });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ Status: false, Message: "Vêtement non trouvé" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// POST ajouter
router.post("/add_vetements", verifyToken, (req, res) => {
  console.log("Données reçues pour ajout :", req.body); // Ajout pour debug

  const sql =
    "INSERT INTO vetements (employee_id, veste, pull, pantalon, chaussures) VALUES (?)";
  const values = [
    req.body.employee_id,
    req.body.veste,
    req.body.pull,
    req.body.pantalon,
    req.body.chaussures,
  ];

  con.query(sql, [values], (err) => {
    if (err) {
      console.error("Erreur SQL :", err); // Ajout pour debug
      return res.status(500).json({ Status: false, Error: err });
    }
    return res.json({ Status: true });
  });
});

// PUT modifier
router.put("/edit_vetements/:id", verifyToken, (req, res) => {
  const sql =
    "UPDATE vetements SET veste = ?, pull = ?, pantalon = ?, chaussures = ? WHERE id = ?";
  const values = [
    req.body.veste,
    req.body.pull,
    req.body.pantalon,
    req.body.chaussures,
    req.params.id,
  ];
  con.query(sql, values, (err) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

// DELETE
router.delete("/delete_vetements/:id", verifyToken, (req, res) => {
  con.query("DELETE FROM vetements WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

const storageScans = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Scans/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const uploadScans = multer({ storage: storageScans });

// POST - Upload de plusieurs fichiers scans
router.post(
  "/upload_scans/:id",
  verifyToken,
  uploadScans.array("scans"),
  (req, res) => {
    const employee_id = req.params.id;
    const files = req.files;

    const values = files.map((file) => [employee_id, file.filename]);

    const sql = "INSERT INTO scans (employee_id, namescans) VALUES ?";
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
    });
  }
);

// GET - Liste des scans d'un employé
router.get("/scans/:id", verifyToken, (req, res) => {
  const sql = "SELECT * FROM scans WHERE employee_id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});

// DELETE - Supprimer un scan
router.delete("/delete_scan/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer le fichier de la base de données et/ou du disque
    await con.query("DELETE FROM scans WHERE id = ?", [id]);
    res.status(200).json({ message: "Fichier supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du scan:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export { router as adminRouter };
