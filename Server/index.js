import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Pour utiliser __dirname avec ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Sert le dossier Public avec les fichiers statiques
app.use("/Public", express.static(path.join(__dirname, "Public")));

app.use("/auth", adminRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
