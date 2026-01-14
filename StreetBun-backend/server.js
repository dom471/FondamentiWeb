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
import bcrypt from "bcryptjs"

// Import delle rotte Express
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Import del modello Mongoose User
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

// MONTAGGIO DEI ROUTER-MIDDLEWARE
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes(io));
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