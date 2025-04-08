import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/verify", { withCredentials: true })
      .then((res) => {
        if (res.data.Status) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div>Chargement...</div>;
  return auth ? children : <Navigate to="/adminlogin" />;
};

export default PrivateRoute;
