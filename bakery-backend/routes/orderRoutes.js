import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!req.user || !(req.user.id || req.user._id)) {
      return res
        .status(401)
        .json({ error: "Utente sconosciuto. Effettua il login per prenotare." });
    }

    const newOrder = new Order({
      items,
      total,
      userId: req.user.id || req.user._id,
      status: "pending",
    });

    const savedOrder = await newOrder.save();
    await savedOrder.populate("userId", "name email role");

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Errore creazione ordine:", err);
    res.status(500).json({ error: "Errore durante il salvataggio dell'ordine" });
  }
});

const resolveRole = async (req) => {
  if (req.user?.role) return req.user.role;
  const userId = req.user?.id || req.user?._id;
  if (!userId) return null;
  const dbUser = await User.findById(userId).select("role");
  return dbUser?.role || null;
};

router.get("/", verifyToken, async (req, res) => {
  try {
    const role = await resolveRole(req);
    if (!role || (role !== "owner" && role !== "worker")) {
      return res.status(403).json({ error: "Accesso negato" });
    }

    const orders = await Order.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Errore caricamento ordini:", err);
    res.status(500).json({ error: "Errore durante il caricamento degli ordini" });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const role = await resolveRole(req);
    if (role !== "owner") {
      return res.status(403).json({ error: "Accesso negato" });
    }

    const orders = await Order.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Errore caricamento storico:", err);
    res.status(500).json({ error: "Errore durante il caricamento dello storico..." });
  }
});

router.put("/:id/paid", verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "paid" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Errore durante l'aggiornamento dell'ordine..." });
  }
});

router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Errore durante l'annullamento dell'ordine" });
  }
});

export default router;
