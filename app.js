import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authenticateUser from "./middlewares/authenticateUser.js";
import generateCookie from "./utils/generateCookie.js";

// Configuration des variables d'environnement
dotenv.config();

// Configuration de l'application
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware pour JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour les cookies
app.use(cookieParser());

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Modifiez cette ligne selon l'origine de votre frontend
    credentials: true, // Permet l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés
  })
);

// Middleware pour vérifier et envoyer des cookies sécurisés
app.use((req, res, next) => {
  res.cookie("session", req.cookies.session || "", {
    httpOnly: true, // Empêche les scripts d'accéder aux cookies
    secure: false, // Définir sur true en production pour HTTPS
    sameSite: "Lax", // Permet le cookie avec des requêtes cross-site de même site
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
  });
  next();
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// Démarrer le serveur
const startServer = async () => {
  try {
    await connectDB(); // Connexion à la base de données
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le PORT ${PORT} !`);
    });
  } catch (error) {
    console.error(`Erreur lors du démarrage du serveur : ${error.message}`);
    process.exit(1); // Arrête le serveur en cas d'erreur critique
  }
};

startServer();

export default app;
