// Configurazione delle variabili d'ambiente da .env
import dotenv from "dotenv"
dotenv.config();

// Import di librerie esterne necessarie
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import { verifyToken } from "./middleware/authMiddleware.js";
import bcrypt from "bcryptjs"

// Import delle rotte Express
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Import dei modelli Mongoose
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

// CONFIGURAZIONE BASE SERVER EXPRESS
const app = express(); 
app.use(cors()); 

//permettono a Express di parsare le richieste arrivate al server
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// TELEGRAM BOT (webhook)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables");
}

// SERVER HTTP + SOCKET.IO (aggiornamenti real-time)
const server = http.createServer(app); 
const io = new Server(server, {
  cors: { //Configura il CORS specifico di Socket.IO
    origin: ["http://localhost:3000", "https://streetbun.vercel.app"],  //connessione realtime "Visualizzazione ordini"
    methods: ["GET", "POST"],
  },
});

// Gestione delle connessioni Socket.IO
io.on("connection", (socket) => {  //listener per ogni volta che un client si connette al server
  console.log("Client connesso:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnesso:", socket.id)); //listener per la disconnessione
});

//All'avvio del server.js controlliamo sempre che esista già un utente admin nel database, se non esiste ne creiamo uno di default per evitare di inserirne uno manualmente
async function createAdminUser() {
const existingAdmin = await User.findOne({ role: "owner" }); //findOne dà come risultato il primo documento che corrisponde al filtro specificato
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
    console.log("Utente admin già presente.");
  }
}
createAdminUser();

// ROTTA PER LA CREAZIONE DI UN ORDINE
app.post("/api/orders", verifyToken, async (req, res) => { //se arriva una richiesta POST a /api/orders, viene eseguito il middleware verifyToken e poi la funzione asincrona (se passa il middleware)
  try {
    const { items, total } = req.body; //items = prodotti nel carrello, total = prezzo totale
    const userId = req.user?.id || req.user?._id || req.body.userId; //per collegare l'ordine all'utente

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Utente sconosciuto. Effettua il login per prenotare." }); 
    }

    // Verifica che tutti i prodotti esistano nel DB prima di salvare l'ordine
    const itemsArray = Array.isArray(items) ? items : []; // Assicura che items sia un array, altrimenti array vuoto
    const productIds = itemsArray //productIds conterrà il risultato dell'intera catena
      .map((it) => it.productId) 
      .filter(Boolean)  
      .map((id) => id.toString()); 
    let missingProducts = []; //array vuoto
    if (productIds.length > 0) {  
      const foundProducts = await Product.find({ _id: { $in: productIds } }).select("_id");
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

    // Salva l'ordine nel database
    const newOrder = new Order({ items, total, userId });
    const savedOrder = await newOrder.save();
    await savedOrder.populate("userId", "name email role");

    // Notifica in tempo reale ai client connessi tramite Socket.IO
    io.emit("newOrder", savedOrder);
    res.status(201).json(savedOrder);

    // Prepara il messaggio Telegram
    const userName =
      savedOrder.userId?.name ||
      savedOrder.userId?.email
    const prodotti = items.map(i => `${i.name} x ${i.quantity}`).join("\n");
    const text = `
      *Nuovo ordine ricevuto!*
      Cliente: *${userName}*
      Totale: €${total.toFixed(2)}
      Prodotti:
        ${prodotti}
        ${new Date().toLocaleString()}
    `;

    // Invio del messaggio Telegram in background per non rallentare la risposta
    if (BOT_TOKEN && CHAT_ID) {
      axios
        .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: CHAT_ID,
          text,
          parse_mode: "Markdown",
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

// MONTAGGIO DEI ROUTER-MIDDLEWARE
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// CONNESSIONE A MONGODB E AVVIO DEL SERVER
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