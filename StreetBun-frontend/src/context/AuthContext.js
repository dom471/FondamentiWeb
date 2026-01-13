// Context per gestire l’autenticazione degli utenti con ruoli diversi: owner, worker, customer
import { createContext, useEffect, useState } from "react";

// Crea ed esporta il context
export const AuthContext = createContext();

// Definisce ed esporta il provider del context
export const AuthProvider = ({ children }) => {
  
  // Stato per memorizzare l’utente autenticato
  const [user, setUser] = useState(null);

  // AUTOLOGIN: controlla se c’è un token salvato nel localStorage e decodificalo
  useEffect(() => {
    // Controlla i token per tutti i ruoli
    const ownerToken = localStorage.getItem("token_owner");
    const workerToken = localStorage.getItem("token_worker");
    const customerToken = localStorage.getItem("token_customer");

    const token = ownerToken || workerToken || customerToken;

    if (!token || token === "undefined" || token === "null") {
      console.log("Nessun token valido trovato");
      return;
    }
    // Decodifica il token per ottenere i dati dell’utente
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return;
      const decoded = JSON.parse(atob(base64Url));
      setUser(decoded);
      console.log("Login automatico:", decoded);
    } catch (err) {
      console.error("Errore parsing token:", err);
    }
  }, []);

  // LOGIN: salva il token nel localStorage in base al ruolo
  const login = (token) => {
    if (!token) return;
    // Decodifica il token per ottenere i dati dell’utente
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);

      // Ogni ruolo ha la sua chiave nel localStorage
      if (decoded.role === "owner") {
        localStorage.setItem("token_owner", token);
      } else if (decoded.role === "worker") {
        localStorage.setItem("token_worker", token);
      } else {
        localStorage.setItem("token_customer", token);
      }

    } catch (err) {
      console.error("Errore parsing token:", err);
    }
  };

  // LOGOUT: rimuove il token dal localStorage
  const logout = () => {
    if (user?.role === "owner") {
      localStorage.removeItem("token_owner");
    } else if (user?.role === "worker") {
      localStorage.removeItem("token_worker");
    } else {
      localStorage.removeItem("token_customer");
    }
    setUser(null);
  };

  // Funzione per ottenere il token corrente in base al ruolo
  const getToken = () => {
    if (user?.role === "owner") return localStorage.getItem("token_owner");
    if (user?.role === "worker") return localStorage.getItem("token_worker");
    if (user?.role === "customer") return localStorage.getItem("token_customer");
    return null;
  };

  // Funzione per effettuare fetch autenticate
  const authenticatedFetch = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
      throw new Error("No token available");
    }
    // Aggiunge l’header di autorizzazione
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    // Fetch
    const response = await fetch(url, { ...options, headers });
    // Caso di token invalido
    if (response.status === 401) {
      // Token invalido, fai logout
      logout();
      throw new Error("Token invalido, logout effettuato");
    }

    return response;
  };
  // Fornisce il context ai componenti figli
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, getToken, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
};