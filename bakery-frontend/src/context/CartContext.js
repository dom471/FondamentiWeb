import { createContext, useState } from "react";


export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
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
  };

  const syncCartWithProducts = (products) => {
    const ids = new Set(products.map((p) => p._id));
    setCart((prev) => prev.filter((item) => ids.has(item._id)));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, syncCartWithProducts, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}


