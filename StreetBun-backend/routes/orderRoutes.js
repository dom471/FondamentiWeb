// Route per la gestione degli ordini
import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders, crea un nuovo ordine
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    // Verifica che l'utente sia autenticato correttamente
    if (!req.user || !(req.user.id || req.user._id)) { 
      return res
        .status(401)
        .json({ error: "Utente sconosciuto. Effettua il login per prenotare." });
    }

    // Verifica che tutti i prodotti esistano ancora nel DB
    const missingProducts = [];
    if (Array.isArray(items)) {
      for (const it of items) {
        if (it.productId) {
          try {
            const p = await Product.findById(it.productId).select("_id name");
            if (!p) missingProducts.push(it.name || it.productId);
          } 
          catch (e) {
            missingProducts.push(it.name || it.productId);
          }
        }
      }
    }

    // Se ci sono prodotti mancanti, rispondi con un errore
    if (missingProducts.length > 0) {
      return res.status(400).json({
        error: "Alcuni prodotti non sono più disponibili",
        missing: missingProducts,
      });
    }

    // Crea e salva il nuovo ordine
    const newOrder = new Order({
      items,
      total,
      userId: req.user.id || req.user._id,
      status: "pending",
    });

    // Salva l'ordine e popola i dettagli dell'utente
    const savedOrder = await newOrder.save();
    await savedOrder.populate("userId", "name email role");

    res.status(201).json(savedOrder);
  } 
  catch (err) {
    console.error("Errore creazione ordine:", err);
    res.status(500).json({ error: "Errore durante il salvataggio dell'ordine" });
  }
});

// Funzione per risolvere il ruolo dell'utente
const resolveRole = async (req) => {
  if (req.user?.role) return req.user.role;
  const userId = req.user?.id || req.user?._id;
  if (!userId) return null;
  const dbUser = await User.findById(userId).select("role");
  return dbUser?.role || null;
};

// GET /api/orders, recupera tutti gli ordini (solo per owner e worker)
router.get("/", verifyToken, async (req, res) => {
  try {
    const role = await resolveRole(req);
    // Controlla se l'utente ha il ruolo di owner o worker
    if (!role || (role !== "owner" && role !== "worker")) {
      return res.status(403).json({ error: "Accesso negato" });
    }
    // Recupera tutti gli ordini, popolando i dettagli dell'utente
    const orders = await Order.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
    res.json(orders);
  } 
  catch (err) {
    console.error("Errore caricamento ordini:", err);
    res.status(500).json({ error: "Errore durante il caricamento degli ordini" });
  }
});

// GET /api/orders/history, recupera lo storico degli ordini (solo per owner)
router.get("/history", verifyToken, async (req, res) => {
  try {
    const role = await resolveRole(req);
    // Controlla se l'utente ha il ruolo di owner
    if (role !== "owner") {
      return res.status(403).json({ error: "Accesso negato" });
    }
    // Recupera tutti gli ordini, popolando i dettagli dell'utente
    const orders = await Order.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
    res.json(orders);
  } 
  catch (err) {
    console.error("Errore caricamento storico:", err);
    res.status(500).json({ error: "Errore durante il caricamento dello storico..." });
  }
});

// PUT /api/orders/:id/paid, aggiorna lo stato di un ordine a "paid"
router.put("/:id/paid", verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "paid" },
      { new: true }
    );
    res.json(order);
  } 
  catch (err) {
    res.status(500).json({ error: "Errore durante l'aggiornamento dell'ordine..." });
  }
});

// PUT /api/orders/:id/cancel, aggiorna lo stato di un ordine a "cancelled"
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json(order);
  } 
  catch (err) {
    res.status(500).json({ error: "Errore durante l'annullamento dell'ordine" });
  }
});

export default router;