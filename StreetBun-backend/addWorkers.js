// Script per aggiungere lavoratori al database MongoDB da console
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import User from "./models/User.js";

const MONGO_URI = "mongodb+srv://admin:StefAno6969@mongodb.r8cxkmw.mongodb.net/panificio?retryWrites=true&w=majority&appName=MongoDB";

async function addWorker(name, email, password) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connesso a MongoDB");

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = new User({
      name,
      email,
      password: hashedPassword,
      role: "worker",
    });

    await worker.save();
    console.log("Lavoratore aggiunto con successo!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Errore durante la creazione del lavoratore:", err);
  }
}

// Crea interfaccia per input interattivo
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Chiedi i dettagli del lavoratore
rl.question("Nome del lavoratore: ", (name) => {
  rl.question("Email del lavoratore: ", (email) => {
    rl.question("Password del lavoratore: ", (password) => {
      if (!name || !email || !password) {
        console.error("Tutti i campi sono obbligatori.");
        rl.close();
        return;
      }
      addWorker(name, email, password);
      rl.close();
    });
  });
});