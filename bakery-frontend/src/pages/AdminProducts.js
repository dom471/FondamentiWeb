import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProductImage } from "../utils/productImages";
import "./AdminProducts.css";

const EMPTY_PRODUCT = { name: "", price: "", image: "" };

function AdminProducts() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Errore nel caricamento prodotti:", err));
  }, []);

  if (!user || user.role !== "owner") {
    return <p style={{ textAlign: "center" }}>Accesso negato: solo il proprietario puo accedere.</p>;
  }

  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewProduct((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setNewProduct(EMPTY_PRODUCT);
    setImagePreview("");
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) {
      setMessage("Inserisci nome e prezzo.");
      return;
    }

    const payload = {
      ...newProduct,
      price: Number(newProduct.price),
    };

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        const createdProduct = {
          ...data,
          price: Number(data.price),
        };
        setProducts((prev) => [...prev, createdProduct]);
        resetForm();
        setMessage("Prodotto aggiunto.");
      } else {
        setMessage(data.error || "Errore durante la creazione del prodotto.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Errore di rete durante la creazione del prodotto.");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="admin-container">
      <h2>Gestione Prodotti</h2>

      <div className="add-form">
        <input
          placeholder="Nome prodotto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Prezzo"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageFile} />
        {imagePreview && (
          <img src={imagePreview} alt="Anteprima prodotto" className="product-preview" />
        )}
        <button onClick={handleAdd}>Aggiungi</button>
      </div>

      {message && <p>{message}</p>}

      <ul className="product-list">
        {products.map((p) => {
          const fallback = getProductImage(p.name);
          const imageSrc = fallback || p.image || "";
          return (
            <li key={p._id}>
              <div className="product-list-left">
                {imageSrc && <img src={imageSrc} alt={p.name} />}
                <span>
                  {p.name} - {"\u20AC"} {Number(p.price).toFixed(2)}
                </span>
              </div>
              <button onClick={() => handleDelete(p._id)}>Elimina</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminProducts;