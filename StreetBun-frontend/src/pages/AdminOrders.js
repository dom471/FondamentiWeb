// Per gestire le prenotazioni in tempo reale per i ruoli "owner" e "worker"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client"; 
import "./AdminOrders.css";
import API_URL from "../config";

// Crea una connessione socket.io al backend
const socket = io(`${API_URL}`);  //socket = client, io = server

// Componente principale per la gestione delle prenotazioni
function AdminOrders() {
  // Context di autenticazione
  const { user, getToken } = useContext(AuthContext);
  // Stati
  const [orders, setOrders] = useState([]); // lista di ordini
  const [loading, setLoading] = useState(true); // indica se gli ordini stanno caricando

  // Recupera il token di autenticazione da AuthContext
  const token = getToken();

  // Caricamento ordini (quando cambia user o token)
  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "worker")) return;

    fetch(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const arrayOrders = Array.isArray(data) ? data : data.orders || [];
        const pendingOrders = arrayOrders.filter((item) => item.status === "pending");
        setOrders(pendingOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore caricamento ordini:", err);
        setLoading(false);
      });
  }, [user, token]);

  // Gestione nuovi ordini in tempo reale tramite socket.io
  useEffect(() => {
    // Event Listener di Socket.IO
    // newOrder  = evento inviato dal server
    // order = parametro inviato dal server nella callback
    socket.on("newOrder", (order) => {
      if (order.status === "pending") setOrders((prev) => [order, ...prev]);
    });
    return () => socket.off("newOrder"); // quando esco dalla pagina, l'event listener non funziona più
  }, []);

  // Segna un ordine come pagato
  const handlePaid = async (id) => {
    try {
      await fetch(`${API_URL}/api/orders/${id}/paid`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Errore aggiornamento ordine:", err);
    }
  };

  // Annulla un ordine
  const handleCancel = async (id) => {
    try {
      await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Errore annullamento ordine:", err);
    }
  };

  if (loading)
    return <p className="status-message">Caricamento ordini...</p>;

  if (orders.length === 0)
    return <p className="status-message">Nessuna prenotazione trovata.</p>;

  // Render della pagina
  return (
    <div className="admin-orders">
      <h2>Prenotazioni in tempo reale</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <h3>
            Cliente: {order.userId?.name || "-"} ({order.userId?.role})
          </h3>
          <p>Email: {order.userId?.email}</p>
          <p>Data: {new Date(order.createdAt).toLocaleString()}</p>

          <ul>
            {order.items.map((item, i) => (
              <li key={i}>
                {item.name} - {item.quantity} - {"\u20AC"} {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <p>Totale: {"\u20AC"} {order.total.toFixed(2)}</p>

          <div className="buttons">
            <button className="paid-btn" onClick={() => handlePaid(order._id)}>
              Ordine Pagato
            </button>
            <button className="cancel-btn" onClick={() => handleCancel(order._id)}>
              Ordine Annullato
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;