// Avvia l'applicazione React e la rende disponibile nel DOM
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Importa i provider di contesto per l'autenticazione e il carrello
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Crea la radice dell'applicazione React e la rende nel DOM
const root = ReactDOM.createRoot(document.getElementById("root"));

// Avvolge l'applicazione con i provider di contesto e la renderizza
root.render(
  <React.StrictMode>  
    <AuthProvider> 
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);