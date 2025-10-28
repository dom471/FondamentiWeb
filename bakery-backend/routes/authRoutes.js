import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersegreto123";

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utente non trovato" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password errata" });

    if (role && role !== user.role) {
      return res
        .status(403)
        .json({ error: "Ruolo selezionato non valido per questo account..." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login effettuato!",
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("Errore nel login:", err);
    res.status(500).json({ error: "Errore del server..." });
  }
});

// REGISTRAZIONE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email già registrata!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer", // solo i clienti possono registrarsi direttamente
    });

    await newUser.save();
    res.status(201).json({ message: "Registrazione completata!" });
  } catch (err) {
    console.error("Errore nella registrazione:", err);
    res.status(500).json({ error: "Errore del server..." });
  }
});

export default router;
