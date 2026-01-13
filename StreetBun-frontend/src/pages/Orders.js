import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import API_URL from "../config";

function Orders() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user, authenticatedFetch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirm = async () => {
    if (cart.length === 0 || isSubmitting) return;

    if (!user) {
      alert("Devi effettuare il login per prenotare.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
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

      const response = await authenticatedFetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const responseText = await response.text();
      let data = null;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }
      }

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
          for (const ci of cart) {
            if (
              missing.includes(ci._id?.toString()) ||
              missing.includes(ci.name)
            ) {
              removeFromCart(ci._id);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="orders-container">
        <h2>Carrello vuoto</h2>
        {message && <p>{message}</p>}
      </div>
    );
  }

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
                  <p>Quantita: {item.quantity}</p>
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

      {isSubmitting && (
        <div className="confirm-spinner-overlay" aria-hidden="true">
          <div className="confirm-spinner-lg" />
        </div>
      )}

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default Orders;
