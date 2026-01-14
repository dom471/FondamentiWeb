// Pagina della registrazione
import { useState } from "react";
import "./Register.css";
import API_URL from "../config";

// Componente Register
function Register() {
  // Stati
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Gestione della registrazione
  const handleRegister = async (e) => {
    e.preventDefault();

    // Chiamata API per la registrazione
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "customer" }),
      });
      // Risposta in formato JSON
      const data = await res.json();

      // Se la registrazione ha successo
      if (res.ok) { //res.ok se lo status HTTP è tra 200 e 299
        setMessage("Registrazione completata con successo!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage("Errore: " + (data.error || "Registrazione fallita"));
      }
    } catch (err) {
      console.error("Errore:", err);
      setMessage("Impossibile contattare il server");
    }
  };

  // Render del componente
  return (
    <div className="register-container">
      <h2>Registrati</h2>
      <form onSubmit={handleRegister} className="register-form">
        <label>
          Nome
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

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

        <button type="submit">Registrati</button>
      </form>
      {/* Messaggio di stato del login */}
      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default Register;