import paneCasereccio from "../assets/pane-casereccio.jpg";
import pizzaMargherita from "../assets/pizza-margherita.jpg";
import paneIntegrale from "../assets/pane-integrale.jpg";
import cornettoCrema from "../assets/cornetto-crema.jpg";
import focaccia from "../assets/Focaccia-barese.jpg";
import crocchetta from "../assets/Crocchette.jpg";
import rustici from "../assets/rustici.jpg";

const productImages = {
  "Pane Casereccio": paneCasereccio,
  "Pizza Margherita": pizzaMargherita,
  "Pane Integrale": paneIntegrale,
  "Cornetto alla crema": cornettoCrema,
  Focaccia: focaccia,
  Crocchetta: crocchetta,
  Rustici: rustici,
};

const normalizedImages = Object.entries(productImages).reduce((acc, [key, value]) => {
  acc[key.toLowerCase()] = value;
  return acc;
}, {});

export function getProductImage(name) {
  if (!name) {
    return "";
  }
  const cleanName = String(name).trim();
  return productImages[cleanName] || normalizedImages[cleanName.toLowerCase()] || "";
}

export default productImages;
