// Route per la gestione degli ordini
import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import axios from "axios";
import { BOT_TOKEN, CHAT_ID }from "../server.js";

const router = express.Router();

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
      .populate("userId", "name email role") // sostituisci userId con i dettagli dell'utente
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
      { new: true } // restituisce il documento aggiornato
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

// Esportiamo una funzione che riceve l'istanza di Socket.IO (`io`) e registra
// la route POST che emette l'evento realtime e invia la notifica Telegram.
export default (io) => {
  router.post("/", verifyToken, async (req, res) => {
    try {
      const { items, total } = req.body;
      const userId = req.user?.id || req.user?._id; // Ottieni l'ID utente dal token verificato

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Utente sconosciuto. Effettua il login per prenotare." });
      }

      const itemsArray = Array.isArray(items) ? items : [];
      const productIds = itemsArray
        .map((it) => it.productId)
        .filter(Boolean) // rimuove valori nulli/undefined
        .map((id) => id.toString());

      let missingProducts = [];
      if (productIds.length > 0) {
        const foundProducts = await Product.find({ _id: { $in: productIds } }).select(
          "_id" //array di documenti con selezionato solo l'_id
        );
        const foundIds = new Set(foundProducts.map((p) => p._id.toString()));
        missingProducts = itemsArray
          .filter((it) => it.productId && !foundIds.has(it.productId.toString())) 
          .map((it) => it.name || it.productId); 
      }

      if (missingProducts.length > 0) {
        return res.status(400).json({
          error: "Alcuni prodotti non sono più disponibili",
          missing: missingProducts,
        });
      }

      const newOrder = new Order({ items, total, userId,});
      const savedOrder = await newOrder.save();
      await savedOrder.populate("userId", "name email role");

      // Notifica realtime ai client connessi
      if (io) {
        io.emit("newOrder", savedOrder); // Emissione evento a tutti i client connessi
      }
      res.status(201).json(savedOrder);

      // Preparazione e invio messaggio Telegram (in background)
      const userName = savedOrder.userId?.name || savedOrder.userId?.email;
      const prodotti = itemsArray.map((i) => `${i.name} x ${i.quantity}`).join("\n");
      const text = `\n*Nuovo ordine ricevuto!*\nCliente: *${userName}*\nTotale: €${total.toFixed(2)}
      \nProdotti:\n  ${prodotti}\n  ${new Date().toLocaleString()}\n`;

      if (BOT_TOKEN && CHAT_ID) {
        axios 
          .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text,
            parse_mode: "Markdown", // per formattazione in grassetto
          })
          .then(() => {
            console.log("Notifica Telegram inviata con successo!");
          })
          .catch((err) => {
            console.error("Errore invio Telegram:", err.message);
          });
      }
    } catch (err) {
      console.error("Errore nella creazione dell'ordine:", err);
      res.status(500).json({ error: "Errore durante il salvataggio dell'ordine" });
    }
  });

  return router;
};