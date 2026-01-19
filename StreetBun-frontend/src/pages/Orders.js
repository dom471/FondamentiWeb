// pagina del carrello e conferma ordine
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import API_URL from "../config";

// Componente Orders
function Orders() {
  // Contesti
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user, authenticatedFetch } = useContext(AuthContext);

  // Navigazione (cambio pagina dal codice)
  const navigate = useNavigate();

  // Stati 
  const [message, setMessage] = useState(""); // Stato per messaggi all'utente
  const [isSubmitting, setIsSubmitting] = useState(false); // Stato per indicare se l'invio è in corso

  // Calcolo del totale del carrello
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0 // sum = 0 all'inizio
  );

  // Funzione per confermare l'ordine
  const handleConfirm = async () => {
    // Non procedere se il carrello è vuoto o se è in corso un invio
    if (cart.length === 0 || isSubmitting) return;

    // Controlla se l'utente è autenticato
    if (!user) {
      alert("Devi effettuare il login per prenotare.");
      navigate("/login");
      return;
    }

    // Inizio invio
    setIsSubmitting(true);

    // Costruzione dell'ordine da inviare al backend
    try {
      // Crea l'oggetto ordine
      const order = {
        items: cart.map((item) => {
          return {
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image || "",
          };
        }),
        total,
      };

      // Invia l'ordine al backend con fetch autenticato
      const response = await authenticatedFetch(`${API_URL}/api/orders`, { 
        // in response viene salvata la risposta del server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      // Legge la risposta come testo
      const responseText = await response.text();

      // Prova a fare il parsing della risposta come JSON
      let data = null;
      if (responseText) {
        try {
          // Converte la risposta in oggetto JS
          data = JSON.parse(responseText); 
        } catch {
          data = null;
        }
      }

      // Controlla lo stato della risposta
      if (response.ok) {
        setMessage("Prenotazione salvata con successo!");
        clearCart();
      } else {
        // Se il backend segnala prodotti mancanti, mostriamo quali e li rimuoviamo dal carrello
        if (response.status === 400 && data?.missing && Array.isArray(data.missing)) {
          const missing = data.missing;
          setMessage(
            "Alcuni prodotti non sono più disponibili: " + missing.join(", ")
          );
          // Rimuovi dal carrello i prodotti che risultano mancanti
          for (const item of cart) {
            if (missing.includes(item._id?.toString()) || missing.includes(item.name)) {
              removeFromCart(item._id);
            }
          }
        } else {
          setMessage(
            "Errore: " + (data?.error || "Impossibile salvare la prenotazione")
          );
        }
      }
    } catch (err) {
      console.error("Errore:", err);
      if (err.message === "Token invalido, logout effettuato") {
        alert("Sessione scaduta. Effettua nuovamente il login.");
        navigate("/login");
      } else {
        setMessage("Impossibile contattare il server");
      }
    } 
    // finally viene eseguito sempre, sia in caso di successo che di errore
    finally {
      setIsSubmitting(false);
    }
  };

  // Se il carrello è vuoto, mostra un messaggio
  if (cart.length === 0) {
    return (
      <div className="orders-container">
        <h2>Carrello vuoto</h2>
        {message && <p>{message}</p>}
      </div>
    );
  }

  // Renderizza il riepilogo dell'ordine
  return (
    <div className="orders-container">
      <h2>Riepilogo prenotazione</h2>

      <ul className="order-list">
        {cart.map((item) => {
          const imageSrc = item.image || "";
          return (
            <li key={item._id} className="order-item">
              <div className="order-item-left">
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="order-item-image"
                  />
                )}
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <p>Quantità: {item.quantity}</p>
                </div>
              </div>
              <div className="order-item-right">
                <span className="order-item-price">
                  {"\u20AC"} {(item.price * item.quantity).toFixed(2)}
                </span>
                <button onClick={() => removeFromCart(item._id)}>Rimuovi</button>
              </div>
            </li>
          );
        })}
      </ul>

      <h3>Totale: {"\u20AC"} {total.toFixed(2)}</h3>

      <div className="order-actions">
        <button className="confirm" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Invio in corso..." : "Conferma prenotazione"}
        </button>
        <button className="clear" onClick={clearCart} disabled={isSubmitting}>
          Svuota carrello
        </button>
      </div>

      {/* Spinner per l'invio dell'ordine */}
      {isSubmitting && (
        <div className="confirm-spinner-overlay">
          <div className="confirm-spinner-lg" />
        </div>
      )}

      {/* Messaggio di stato */}
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default Orders;