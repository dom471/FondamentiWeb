import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const MONGO_URI = "mongodb+srv://admin:StefAno6969@mongodb.r8cxkmw.mongodb.net/panificio?retryWrites=true&w=majority&appName=MongoDB";

async function addWorker() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connesso a MongoDB");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const worker = new User({
      name: "domenico",
      email: "domenico@panificio.com",
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

addWorker();