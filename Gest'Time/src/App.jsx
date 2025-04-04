import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Calendar from "./Components/Calendar";
import Employee from "./Components/Employee";
import Category from "./Components/Category";
import AddCategory from "./Components/AddCategory";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import Absence from "./Components/Absence";
import AddAbsence from "./Components/AddAbsence";
import EditAbsence from "./Components/EditAbsence";
import Home from "./Components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminlogin" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<Home />}></Route>
          <Route path="/dashboard/calendar" element={<Calendar />}></Route>
          <Route path="/dashboard/employee" element={<Employee />}></Route>
          <Route path="/dashboard/category" element={<Category />}></Route>
          <Route path="/dashboard/absences" element={<Absence />}></Route>
          <Route
            path="/dashboard/add_category"
            element={<AddCategory />}
          ></Route>
          <Route
            path="/dashboard/add_employee"
            element={<AddEmployee />}
          ></Route>
          <Route
            path="/dashboard/edit_employee/:id"
            element={<EditEmployee />}
          ></Route>
          <Route
            path="/dashboard/add_absences"
            element={<AddAbsence />}
          ></Route>
          <Route
            path="/dashboard/edit_absences/:id"
            element={<EditAbsence />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
