import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import API_URL from "../config";

function Orders() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user, getToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirm = async () => {
    if (cart.length === 0) return;

    if (!user) {
      alert("Devi effettuare il login per prenotare.");
      navigate("/login");
      return;
    }

    const token = getToken();
    if (!token || token === "undefined" || token === "null") {
      alert("Sessione scaduta, effettua di nuovo il login.");
      navigate("/login");
      return;
    }

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

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Prenotazione salvata con successo!");
        clearCart();
      } else {
        setMessage(
          "Errore: " + (data.error || "Impossibile salvare la prenotazione")
        );
      }
    } catch (err) {
      console.error("Errore:", err);
      setMessage("Impossibile contattare il server");
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

      <button className="confirm" onClick={handleConfirm}>
        Conferma prenotazione
      </button>
      <button className="clear" onClick={clearCart}>
        Svuota carrello
      </button>

      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default Orders;
