import jwt from "jsonwebtoken";

/**
 * Génère un cookie de session JWT pour l'utilisateur.
 *
 * @param {Object} res - L'objet réponse Express.
 * @param {string} userId - L'identifiant de l'utilisateur pour le payload JWT.
 * @returns {string} - Le token JWT généré.
 */
const generateCookie = (res, userId) => {
  // Génération du token JWT
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d", // Le token JWT expire dans 30 jours
  });

  // Configuration sécurisée du cookie de session
  res.cookie("session", token, {
    httpOnly: true, // Rend le cookie inaccessible via JavaScript pour éviter les attaques XSS
    secure: process.env.NODE_ENV === "production", // Utilise 'true' en production pour HTTPS
    sameSite: "None", // Utilisé pour les cookies cross-site; assurez-vous d'utiliser HTTPS
    maxAge: 30 * 24 * 60 * 60 * 1000, // Le cookie expire dans 30 jours
  });

  return token;
};

export default generateCookie;
