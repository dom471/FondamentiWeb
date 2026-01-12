// DEFINIZIONE DEL MODELLO USER PER MONGODB/MONGOOSE
import mongoose from "mongoose";

// Schema per l'utente
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "worker", "customer"], default: "customer" },
});

// Creazione e esportazione del modello User
const User = mongoose.model("User", userSchema);
export default User;