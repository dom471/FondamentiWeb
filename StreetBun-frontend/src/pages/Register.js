import { useState } from "react";
import "./Register.css";
import API_URL from "../config";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "customer" }),
      });

      const data = await response.json();

      if (response.ok) {
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

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default Register;
