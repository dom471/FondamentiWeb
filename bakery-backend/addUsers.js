import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const MONGO_URI = "mongodb+srv://admin:StefAno6969@mongodb.r8cxkmw.mongodb.net/panificio?retryWrites=true&w=majority&appName=MongoDB";

async function seed() {
  await mongoose.connect(MONGO_URI);

  // esempio utente lavoratore
  const workerExists = await User.findOne({ email: "lavoratore@panificio.com" });
  if (!workerExists) {
    const hashed = await bcrypt.hash("123456", 10);
    await User.create({
      name: "Michele Bravi",
      email: "lavoratore@panificio.com",
      password: hashed,
      role: "worker",
    });
    console.log("Lavoratore creato (lavoratore@panificio.com / 123456)");
  } else {
    console.log("Lavoratore già esistente.");
  }

  console.log("Setup completato.");
  process.exit(0);
}

seed();