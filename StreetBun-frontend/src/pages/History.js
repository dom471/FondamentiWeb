// Pagina "Resoconto" del menù (solo accessibile ad admin)
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import "./History.css";
import API_URL from "../config";

//Crea una connessione socket.io al backend
const socket = io(`${API_URL}`);

// Componente principale per la visualizzazione dello storico delle vendite
function History() {
  // Context di autenticazione
  const { user, getToken } = useContext(AuthContext);
  // Stati
  const [orders, setOrders] = useState([]); // lista di ordini
  const [loading, setLoading] = useState(true); // indica se gli ordini stanno caricando
  const [dailySummary, setDailySummary] = useState({}); // per il resoconto giornaliero

  // Funzione per aggregare gli ordini per giorno
  const aggregateByDay = (arrayOrders) => {
    const summary = {};
    // Itera su ogni ordine
    arrayOrders.forEach((order) => {
      // Estrae la data dall'ordine
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!summary[date]) {
        summary[date] = { 
          products: {}, //sotto-oggetto
          total: 0 
        };
      }
      order.items.forEach((item) => {
        if (!summary[date].products[item.name]) {
          summary[date].products[item.name] = {
            quantity: 0,
            totalPrice: 0,
          };
        }
        // Aggiorna quantità e prezzo totale per ogni prodotto
        summary[date].products[item.name].quantity += item.quantity;
        summary[date].products[item.name].totalPrice += (item.price * item.quantity);
      });
      // Aggiorna il totale giornaliero
      summary[date].total += order.total;
    });
    return summary;
  };

  // Caricamento storico ordini (quando cambia user o token)
  useEffect(() => {
    if (!user || user.role !== "owner") return;
    // Recupera il token di autenticazione da AuthContext
    const token = getToken();
    fetch(`${API_URL}/api/orders/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const arrayOrders = Array.isArray(data) ? data : data.orders || [];
        const paidOrders = arrayOrders.filter((order) => order.status === "paid");
        setOrders(paidOrders);
        setDailySummary(aggregateByDay(paidOrders));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento storico:", err);
        setLoading(false);
      });
  }, [user, getToken]);

  // Gestione nuovi ordini pagati in tempo reale tramite socket.io
  useEffect(() => {
    socket.on("newOrder", (order) => {
      if (order.status !== "paid") return;
      setOrders((prev) => {
        const updated = [order, ...prev];
        setDailySummary(aggregateByDay(updated));
        return updated;
      });
    });
    return () => socket.off("newOrder");
  }, []);

  if (!user)
    return (
      <p className="status-message">
        Devi effettuare il login per vedere lo storico.
      </p>
    );

  if (loading)
    return <p className="status-message">Caricamento storico...</p>;

  if (orders.length === 0)
    return <p className="status-message">Nessuna prenotazione trovata.</p>;

  return (
    <div className="history-container">
      <h2>Storico vendite giornaliere</h2>

      {Object.entries(dailySummary).map(([date, summary]) => (
        <div key={date} className="day-group">
          <h3 className="day-header">
            {date} - Totale giornaliero: {"\u20AC"} {summary.total.toFixed(2)}
          </h3>
          <ul>
            {Object.entries(summary.products).map(([name, info]) => (
              <li key={name}>
                {name} - {info.quantity} - {"\u20AC"} {info.totalPrice.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default History;