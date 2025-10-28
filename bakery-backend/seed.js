import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://admin:StefAno6969@mongodb.r8cxkmw.mongodb.net/panificio?retryWrites=true&w=majority&appName=MongoDB";

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
  })
);

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "Pane Casereccio",
      price: 2.5,
      image:
        "https://images.unsplash.com/photo-1608198093002-ad4e005484f7",
    },
    {
      name: "Pizza Margherita",
      price: 5.0,
      image:
        "https://images.unsplash.com/photo-1594007654729-407eedc4be44",
    },
    {
      name: "Cornetto alla crema",
      price: 1.5,
      image:
        "https://images.unsplash.com/photo-1606813902917-7c4361b38d60",
    },
    {
      name: "Pane Integrale",
      price: 3.0,
      image:
        "https://images.unsplash.com/photo-1565958011705-44e211bb9a84",
    },
  ]);
  console.log("Prodotti inseriti nel DB 'panificio'!");
  await mongoose.disconnect();
}

seed();