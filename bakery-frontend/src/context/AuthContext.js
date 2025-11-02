import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //Al caricamento controlla se ci sono token salvati per vari ruoli
  useEffect(() => {
    // Proviamo a leggere tutti e 3 i token
    const ownerToken = localStorage.getItem("token_owner");
    const workerToken = localStorage.getItem("token_worker");
    const customerToken = localStorage.getItem("token_customer");

    const token = ownerToken || workerToken || customerToken;

    if (!token || token === "undefined" || token === "null") {
      console.log("Nessun token valido trovato");
      return;
    }

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

  //LOGIN: salva token in base al ruolo
  const login = (token) => {
    if (!token) return;

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

  //LOGOUT: cancella solo il token del ruolo corrente
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


