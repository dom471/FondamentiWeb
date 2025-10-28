import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersegreto123";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token mancante. Effettua il login." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token non valido:", err);
    res.status(403).json({ error: "Token non valido o scaduto." });
  }
};