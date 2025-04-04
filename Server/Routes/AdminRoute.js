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

// router.get("/admin_count", (req, res) => {
//   const sql = "SELECT count(id) as admin FROM admin";
//   con.query(sql, (err, result) => {
//     if (err) return res.json({ Status: false, Error: "Query Error" + err });
//     return res.json({ Status: true, Result: result });
//   });
// });

// router.get("/employee_count", (req, res) => {
//   const sql = "SELECT count(id) as employee FROM employee";
//   con.query(sql, (err, result) => {
//     if (err) return res.json({ Status: false, Error: "Query Error" + err });
//     return res.json({ Status: true, Result: result });
//   });
// });

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

export { router as adminRouter };
