// Per gestire il carrello 
import { createContext, useState, useCallback } from "react";

// Crea ed esporta il context
export const CartContext = createContext();

// Definisce ed esporta il provider del context
export function CartProvider({ children }) {
  
  // Stato per memorizzare gli articoli nel carrello
  const [cart, setCart] = useState([]);

  // Aggiunge un prodotto al carrello
  const addToCart = useCallback((product) => {
    // Controlla se il prodotto è già nel carrello
    const existing = cart.find((item) => item._id === product._id); // find restituisce il primo elemento che soddisfa la condizione
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }, [cart]);

  // Sincronizza il carrello con i prodotti disponibili (rimuove quelli che non esistono più)
  const syncCartWithProducts = useCallback((products) => {
    const ids = new Set(products.map((p) => p._id));
    setCart((prev) => prev.filter((item) => ids.has(item._id)));
  }, []);

  // Rimuove un prodotto dal carrello
  const removeFromCart = useCallback((id) => {
    setCart(cart.filter((item) => item._id !== id));
  }, [cart]);

  // Svuota il carrello
  const clearCart = useCallback(() => setCart([]), []);

  // Fornisce il context ai componenti figli
  return (
    <CartContext.Provider value={{ cart, addToCart, syncCartWithProducts, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}