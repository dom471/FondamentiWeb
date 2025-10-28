import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import "./AdminOrders.css";
import API_URL from "../config";
const socket = io(`${API_URL}/api/auth/login`);

function AdminOrders() {
  const { user, getToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "worker")) return;

    fetch(`${API_URL}/api/auth/login`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const arrayOrders = Array.isArray(data) ? data : data.orders || [];
        const pendingOrders = arrayOrders.filter((o) => o.status === "pending");
        setOrders(pendingOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore caricamento ordini:", err);
        setLoading(false);
      });
  }, [user, token]);

  useEffect(() => {
    socket.on("newOrder", (order) => {
      if (order.status === "pending") setOrders((prev) => [order, ...prev]);
    });
    return () => socket.off("newOrder");
  }, []);

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

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Devi effettuare il login per visualizzare gli ordini.
      </p>
    );

  if (loading)
    return <p style={{ textAlign: "center" }}>Caricamento ordini...</p>;

  if (orders.length === 0)
    return <p style={{ textAlign: "center" }}>Nessuna prenotazione trovata.</p>;

  return (
    <div className="admin-orders">
      <h2>Tutte le prenotazioni (in tempo reale)</h2>

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

          <p className="total">Totale: {"\u20AC"} {order.total.toFixed(2)}</p>

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

