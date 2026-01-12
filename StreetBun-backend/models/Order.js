// DEFINIZIONE DEL MODELLO ORDER PER MONGODB/MONGOOSE
import mongoose from "mongoose";

//  Schema per l'ordine
const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Creazione e esportazione del modello Order
const Order = mongoose.model("Order", orderSchema);
export default Order;