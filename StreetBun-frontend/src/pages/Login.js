// Pagina del login
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API_URL from "../config";

// Componente Login
function Login() {
  // Stati
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("customer");
  // Contesto di autenticazione
  const { login } = useContext(AuthContext);
  // Navigazione tra pagine
  const navigate = useNavigate();

  // Gestione del login
  const handleLogin = async (e) => {
    // Per bloccare il refresh della pagina
    e.preventDefault();

    // Chiamata API per il login
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      
      const data = await res.json();

      // Se il login ha successo
      if (res.ok) { //res.ok se lo status HTTP è tra 200 e 299
        login(data.token);
        setMessage("Login effettuato con successo!");
        navigate("/");
      } else {
        setMessage(data.error || "Credenziali non valide");
      }
    } catch (err) {
      console.error("Errore login:", err);
      setMessage("Problema nel server");
    }
  };

  // Render del componente
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
      {/* Messaggio di stato del login */}
      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default Login;