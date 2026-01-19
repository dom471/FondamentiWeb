// DEFINIZIONE DEL MODELLO PRODUCT PER MONGODB/MONGOOSE
import mongoose from "mongoose";

//  Schema per il prodotto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, },
  description: { type: String, required: true, trim: true },
});

// Creazione e esportazione del modello Product
const Product = mongoose.model("Product", productSchema);
export default Product;