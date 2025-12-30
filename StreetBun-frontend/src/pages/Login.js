import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API_URL from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        setMessage("Login effettuato con successo!");

        switch (data.role) {
          case "owner":
            navigate("/admin/orders");
            break;
          case "worker":
            navigate("/ricette");
            break;
          default:
            navigate("/");
        }
      } else {
        setMessage(data.error || "Credenziali non valide");
      }
    } catch (err) {
      console.error("Errore login:", err);
      setMessage("Problema nel server");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Ruolo
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Cliente</option>
            <option value="worker">Lavoratore</option>
            <option value="owner">Proprietario</option>
          </select>
        </label>

        <button type="submit">Accedi</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default Login;
