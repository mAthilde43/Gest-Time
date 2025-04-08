import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [absenceData, setAbsenceData] = useState([]);
  const [visits, setVisits] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchEmployees();
    fetchAbsences();
    fetchVisits();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
          setEmployeeTotal(res.data.Result.length);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAbsences = () => {
    axios
      .get("http://localhost:3000/auth/absences")
      .then((res) => {
        if (res.data.Status) {
          setAbsenceData(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchVisits = () => {
    axios
      .get("http://localhost:3000/auth/visitmedical")
      .then((res) => {
        if (res.data.Status) {
          setVisits(res.data.Result);
        } else {
          console.error("Erreur de récupération des visites :", res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const isDateInRange = (date, start, end) => {
    return date >= start && date <= end;
  };

  const getTodayAbsentees = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return absenceData
      .filter((absence) => {
        const start = new Date(absence.start_date);
        const end = new Date(absence.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return isDateInRange(today, start, end);
      })
      .map((absence) => {
        const employee = employees.find((e) => e.id === absence.employee_id);
        return employee
          ? `${employee.name} ${employee.firstname}`
          : "Employé inconnu";
      });
  };

  const getMonthlyAbsenceCount = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return absenceData.reduce((total, absence) => {
      const start = new Date(absence.start_date);
      const end = new Date(absence.end_date);

      let count = 0;
      let current = new Date(start);
      while (current <= end) {
        if (current.getMonth() === month && current.getFullYear() === year) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }

      return total + count;
    }, 0);
  };

  const getMonthlyMedicalVisits = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return visits
      .filter((visit) => {
        const visitDate = new Date(visit.visitdate);
        return (
          visitDate.getMonth() === currentMonth &&
          visitDate.getFullYear() === currentYear
        );
      })
      .map((visit) => {
        const employee = employees.find((e) => e.id === visit.employee_id);
        return employee
          ? {
              date: new Date(visit.visitdate).toLocaleDateString(),
              name: `${employee.name} ${employee.firstname}`,
            }
          : null;
      })
      .filter((v) => v !== null);
  };

  const formatAbsenceChartData = () => {
    const countByDate = {};

    absenceData.forEach((absence) => {
      const start = new Date(absence.start_date);
      const end = new Date(absence.end_date);
      const current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        countByDate[dateStr] = (countByDate[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });

    return Object.entries(countByDate)
      .map(([date, absences]) => ({ date, absences }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const todayAbsentees = getTodayAbsentees();
  const totalMonthlyAbsences = getMonthlyAbsenceCount();
  const monthlyVisits = getMonthlyMedicalVisits();

  return (
    <div className="home-container px-5 py-4">
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: "10px" }}
      >
        <h3>Tableau de bord</h3>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card text-white mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Nombre total d'employés</h5>
              <p className="card-text fs-3">{employeeTotal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Jours d'absence ce mois-ci</h5>
              <p className="card-text fs-3">{totalMonthlyAbsences}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Absents aujourd'hui</h5>
              {todayAbsentees.length > 0 ? (
                <ul className="mb-0">
                  {todayAbsentees.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mb-0">Aucun employé absent aujourd’hui.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Prochaines visites médicales</h5>
              {monthlyVisits.length > 0 ? (
                <ul className="mb-0">
                  {monthlyVisits.map((visit, index) => (
                    <li key={index}>
                      {visit.date} – {visit.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-0">Aucune visite prévue ce mois-ci.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
        <div className="calendar-container">
          <div className="card shadow-sm p-3 card-calendar">
            <h5 className="card-title">Calendrier</h5>
            <Calendar onChange={setDate} value={date} />
          </div>
        </div>

        <div className="chart-container">
          <div className="card shadow-sm p-3 card-chart">
            <h5 className="card-title mb-3 w-100 text-center">
              Évolution des absences
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatAbsenceChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="absences"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
