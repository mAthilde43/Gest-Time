import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

const Calendar = () => {
  const [employees, setEmployees] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEmployees();
    fetchAbsences();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchAbsences = () => {
    axios
      .get("http://localhost:3000/auth/absences")
      .then((result) => {
        if (result.data.Status) {
          setAbsences(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month + 1, 0);
    return Array.from({ length: date.getDate() }, (_, i) => i + 1);
  };

  const getDayLetter = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const options = { weekday: "short" };
    const dayName = date.toLocaleDateString("fr-FR", options);
    return dayName[0].toUpperCase();
  };

  const daysInMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );

  const isAbsent = (employeeId, day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return absences.find(
      (absence) =>
        absence.employee_id === employeeId &&
        new Date(absence.start_date) <= dateStr &&
        new Date(absence.end_date) >= dateStr
    );
  };

  const getAbsenceColor = (employeeId, day) => {
    const absence = absences.find(
      (absence) =>
        absence.employee_id === employeeId &&
        new Date(absence.start_date) <=
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day) &&
        new Date(absence.end_date) >=
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );

    if (absence) {
      switch (absence.absence_type) {
        case "Congé payé":
          return "#B3E5FC"; // Blue
        case "Congé sans solde":
          return "#FFEB3B"; // Yellow
        case "Arrêt maladie":
          return "#FF7043"; // Red
        case "RTT":
          return "#81C784"; // Green
        case "Absence injustifiée":
          return "#F44336"; // Dark Red
        case "Congé maternité/paternité":
          return "#FFCC80"; // Orange
        case "Autre":
          return "#D1C4E9"; // Purple
        default:
          return "white";
      }
    }
    return "white";
  };

  const exportToExcel = () => {
    const table = document.querySelector(".table-dashboard");

    if (table) {
      const data = [];
      const header = [
        "Employé",
        ...daysInMonth.map((day) => `${getDayLetter(day)} ${day}`),
      ];
      data.push(header);

      employees.forEach((employee) => {
        const row = [employee.name + " " + employee.firstname];

        daysInMonth.forEach((day) => {
          if (isAbsent(employee.id, day)) {
            row.push({
              v: "X",
              s: { fill: { fgColor: { rgb: "127598" } } },
            });
          } else {
            row.push({ v: "" });
          }
        });

        data.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();

      ws["!cols"] = [{ wpx: 150 }, ...daysInMonth.map(() => ({ wpx: 30 }))];

      XLSX.utils.book_append_sheet(wb, ws, "Absences");

      XLSX.writeFile(wb, "absences.xlsx");
    } else {
      console.error("Le tableau n'a pas été trouvé dans le DOM");
    }
  };

  const exportToPDF = () => {
    const element = document.querySelector(".table-dashboard");

    if (element) {
      const options = {
        margin: 0.2,
        filename: "absences.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      };

      html2pdf().from(element).set(options).save();
    } else {
      console.error("Le tableau n'a pas été trouvé dans le DOM");
    }
  };

  return (
    <div>
      <div className="mt-1 px-4 pt-3">
        <div className="d-flex justify-content-center">
          <h3>Calendrier des Absences des Employés</h3>
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between mb-3">
            <button className="btn-calendar" onClick={() => changeMonth(-1)}>
              Précédent
            </button>
            <span>{`${currentDate
              .toLocaleString("default", { month: "long" })
              .toUpperCase()} ${currentDate.getFullYear()}`}</span>

            <button className="btn-calendar" onClick={() => changeMonth(1)}>
              Suivant
            </button>
          </div>

          <table className="table-dashboard">
            <thead>
              <tr>
                <th>Employé</th>
                {daysInMonth.map((day) => (
                  <th key={day}>
                    {getDayLetter(day)} {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.name} {e.firstname}
                  </td>
                  {daysInMonth.map((day) => (
                    <td
                      key={day}
                      style={{
                        backgroundColor: getAbsenceColor(e.id, day),
                        textAlign: "center",
                      }}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-flex-end m-2 export-btn">
            <button className="btn-calendar" onClick={exportToExcel}>
              Exporter en Excel
            </button>

            <button className="btn-calendar" onClick={exportToPDF}>
              Exporter en PDF
            </button>
          </div>

          <div className="legend">
            <h5>Légende des types d'absence</h5>
            <ul>
              <li>
                <span
                  style={{ backgroundColor: "#B3E5FC", padding: "5px" }}
                ></span>{" "}
                Congé payé
              </li>
              <li>
                <span
                  style={{ backgroundColor: "#FFEB3B", padding: "5px" }}
                ></span>{" "}
                Congé sans solde
              </li>
              <li>
                <span
                  style={{ backgroundColor: "#FF7043", padding: "5px" }}
                ></span>{" "}
                Arrêt maladie
              </li>
              <li>
                <span
                  style={{ backgroundColor: "#81C784", padding: "5px" }}
                ></span>{" "}
                RTT
              </li>
              <li>
                <span
                  style={{ backgroundColor: "#F44336", padding: "5px" }}
                ></span>{" "}
                Absence injustifiée
              </li>
              <li>
                <span
                  style={{ backgroundColor: "#FFCC80", padding: "5px" }}
                ></span>{" "}
                Congé maternité/paternité
              </li>
              <li>
                <span
                  style={{ backgroundColor: "#D1C4E9", padding: "5px" }}
                ></span>{" "}
                Autre
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
