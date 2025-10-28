import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import "./History.css";
import API_URL from "../config";

const socket = io(`${API_URL}`);

function History() {
  const { user, getToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailySummary, setDailySummary] = useState({});

  const aggregateByDay = (arrayOrders) => {
    const summary = {};

    arrayOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!summary[date]) summary[date] = { products: {}, total: 0 };

      order.items.forEach((item) => {
        if (!summary[date].products[item.name]) {
          summary[date].products[item.name] = {
            quantity: 0,
            totalPrice: 0,
          };
        }
        summary[date].products[item.name].quantity += item.quantity;
        summary[date].products[item.name].totalPrice +=
          item.price * item.quantity;
      });

      summary[date].total += order.total;
    });

    return summary;
  };

  useEffect(() => {
    if (!user || user.role !== "owner") return;

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
      <p style={{ textAlign: "center" }}>
        Devi effettuare il login per vedere lo storico.
      </p>
    );

  if (loading)
    return <p style={{ textAlign: "center" }}>Caricamento storico...</p>;

  if (orders.length === 0)
    return <p style={{ textAlign: "center" }}>Nessuna prenotazione trovata.</p>;

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
