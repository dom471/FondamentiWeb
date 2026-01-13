//Context per gestire l’autenticazione degli utenti con ruoli diversi: owner, worker, customer
import { createContext, useEffect, useState } from "react";

//Crea ed esporta il context
export const AuthContext = createContext();

//Definisce ed esporta il provider del context
export const AuthProvider = ({ children }) => {
  
  //Stato per memorizzare l’utente autenticato
  const [user, setUser] = useState(null);

  //Al caricamento controlla se ci sono token salvati per vari ruoli
  useEffect(() => {
    const checkAndSetToken = (tokenKey, timestampKey) => {
      const token = localStorage.getItem(tokenKey);
      const timestamp = localStorage.getItem(timestampKey);

      if (!token || token === "undefined" || token === "null") {
        return null;
      }

      if (!timestamp) {
        // Se non c'è timestamp, considera invalido e rimuovi
        localStorage.removeItem(tokenKey);
        return null;
      }

      const now = Date.now();
      const tokenAge = now - parseInt(timestamp, 10);
      const maxAge = 60 * 1000; // 2 ore in millisecondi

      if (tokenAge > maxAge) {
        // Token scaduto, rimuovi
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(timestampKey);
        console.log(`Token ${tokenKey} scaduto e rimosso`);
        return null;
      }

      try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const decoded = JSON.parse(atob(base64Url));
        return decoded;
      } catch (err) {
        console.error("Errore parsing token:", err);
        // Rimuovi token invalido
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(timestampKey);
        return null;
      }
    };

    const ownerUser = checkAndSetToken("token_owner", "token_owner_timestamp");
    const workerUser = checkAndSetToken("token_worker", "token_worker_timestamp");
    const customerUser = checkAndSetToken("token_customer", "token_customer_timestamp");

    const user = ownerUser || workerUser || customerUser;

    if (user) {
      setUser(user);
      console.log("Login automatico:", user);
    } else {
      console.log("Nessun token valido trovato");
    }
  }, []);

  //LOGIN: salva token in base al ruolo
  const login = (token) => {
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);

      const timestamp = Date.now();

      // Ogni ruolo ha la sua chiave nel localStorage
      if (decoded.role === "owner") {
        localStorage.setItem("token_owner", token);
        localStorage.setItem("token_owner_timestamp", timestamp);
      } else if (decoded.role === "worker") {
        localStorage.setItem("token_worker", token);
        localStorage.setItem("token_worker_timestamp", timestamp);
      } else {
        localStorage.setItem("token_customer", token);
        localStorage.setItem("token_customer_timestamp", timestamp);
      }

    } catch (err) {
      console.error("Errore parsing token:", err);
    }
  };

  //LOGOUT: cancella solo il token del ruolo corrente
  const logout = () => {
    if (user?.role === "owner") {
      localStorage.removeItem("token_owner");
      localStorage.removeItem("token_owner_timestamp");
    } else if (user?.role === "worker") {
      localStorage.removeItem("token_worker");
      localStorage.removeItem("token_worker_timestamp");
    } else {
      localStorage.removeItem("token_customer");
      localStorage.removeItem("token_customer_timestamp");
    }
    setUser(null);
  };

  //Restituisce il token corretto in base all’utente
  const getToken = () => {
    if (user?.role === "owner") return localStorage.getItem("token_owner");
    if (user?.role === "worker") return localStorage.getItem("token_worker");
    if (user?.role === "customer") return localStorage.getItem("token_customer");
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};