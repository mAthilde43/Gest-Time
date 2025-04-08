import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ Status: false, Error: "Token manquant" });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ Status: false, Error: "Token invalide" });
    }

    req.user = decoded; // tu peux y stocker les infos du token si besoin
    next();
  });
};

export default verifyToken;
