// Pagina "Gestione Prodotti" del menù (solo accessibile ad admin)
import { useEffect, useState } from "react";
import "./AdminProducts.css";
import API_URL from "../config";

// Prodotto vuoto di default per il form di aggiunta
const EMPTY_PRODUCT = { name: "", price: "", image: "", description: "" };

// Componente principale 
function AdminProducts() {
  // Stati
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  // Caricamento prodotti all'inizio
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Errore nel caricamento prodotti:", err));
  }, []);

  // Gestione dell'inserimento dell'immagine
  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024) { // 1MB limit
      setMessage("Immagine troppo grande! Max 1MB.");
      return;
    } 
    const reader = new FileReader(); // per leggere il contenuto del file 
    reader.onloadend = () => { // Evento che parte quando la lettura del file è finita
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewProduct((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file); // Legge il file come Data URL (base64)
  };

  // Reset form
  const resetForm = () => {
    setNewProduct(EMPTY_PRODUCT);
    setImagePreview("");
  };

  // Aggiunta nuovo prodotto
  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.description.trim() || !newProduct.price) {
      setMessage("Compilare tutti i campi richiesti.");
      return;
    }
    
    // Preparazione del payload da inviare al backend
    const payload = {
      ...newProduct,
      price: Number(newProduct.price),
    };

    // Chiamata al backend per creare il prodotto
    try {
      const res = await fetch(`${API_URL}/api/products`, {
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

  // Eliminazione prodotto
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Render della pagina
  return (
    <div className="admin-container">
      <h2>Gestione Prodotti</h2>

      <div className="add-form">
        <input
          placeholder="Nome prodotto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <textarea
          placeholder="Descrizione prodotto"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          rows={3}
        />
        <input
          placeholder="Prezzo"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageFile} />
        {imagePreview && (
          <img src={imagePreview} alt="Anteprima prodotto" />
        )}
        <button onClick={handleAdd}>Aggiungi</button>
      </div>

      {message && <p>{message}</p>}

      <ul className="product-list">
        {products.map((p) => {
          const imageSrc = p.image || "";
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