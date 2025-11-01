import dotenv from "dotenv"
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import { verifyToken } from "./middleware/authMiddleware.js";

// Import modelli e rotte
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs"


// CONFIGURAZIONE BASE SERVER
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// TELEGRAM BOT (webhook)
// Qui i dati veri:
const BOT_TOKEN = "7780029168:AAHNzlhy8TeDLovh47It5P0J-fMVb1OaTdo";
const CHAT_ID = "547481447";


// SOCKET.IO (real-time updates)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// Quando un client si connette via Socket.IO
io.on("connection", (socket) => {
  console.log("Client connesso:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnesso:", socket.id));
});

//All'avvio del server.js controlliamo sempre che esista già un utente admin nel database, se non esiste ne creiamo uno di default per evitare di inserirne uno manualmente, per comodità
async function createAdminUser() {
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
  name: "Proprietario",
  email: "admin@gmail.com",
  password: hashedPassword,
  role: "owner",
});
    await adminUser.save();
    console.log("Utente admin creato con successo!");
  } else {
    console.log("ℹUtente admin già presente.");
  }
}

createAdminUser();


// ROTTA PERSONALIZZATA: CREAZIONE ORDINE
app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user?.id || req.user?._id || req.body.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Utente sconosciuto. Effettua il login per prenotare." });
    }

    // Salva l'ordine nel database
    const newOrder = new Order({ items, total, userId });
    const savedOrder = await newOrder.save();
    await savedOrder.populate("userId", "name email role");

    // Cerca il nome dell'utente per la notifica
    let userName = "Utente sconosciuto";
    try {
      const user = await User.findById(userId);
      if (user) userName = user.name || user.email;
    } catch (err) {
      console.warn("Utente non trovato:", err.message);
    }
   
    // Messaggio Telegram
    const prodotti = items.map(i => `${i.name} × ${i.quantity}`).join("\n");
    const text = `
*Nuovo ordine ricevuto!*
Cliente: *${userName}*
Totale: €${total.toFixed(2)}

Prodotti:
${prodotti}

${new Date().toLocaleString()}
`;

    // Invio del messaggio Telegram
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: "Markdown",
    });

    console.log("Notifica Telegram inviata con successo!");

    // Aggiorna in tempo reale l’interfaccia dell’admin
    io.emit("newOrder", savedOrder);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Errore nella creazione dell'ordine:", err);
    res.status(500).json({ error: "Errore durante il salvataggio dell'ordine" });
  }
});


// ALTRE ROTTE
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);


// CONNESSIONE A MONGODB
mongoose
  .connect(
    "mongodb+srv://admin:StefAno6969@mongodb.r8cxkmw.mongodb.net/panificio?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connesso a MongoDB");
    server.listen(5000, () =>
      console.log("Server con Socket.IO e webhook attivo su http://localhost:5000")
    );
  })
  .catch((err) => console.error("Errore connessione DB:", err));





