import { createContext, useState } from "react";
import { getProductImage } from "../utils/productImages";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  console.log("Cart aggiornato:", cart);

  const addToCart = (product) => {
    const fallback = getProductImage(product.name);
    const imageSource = fallback || product.image || "";
    const productWithImage = {
      ...product,
      image: imageSource,
    };

    const existing = cart.find((item) => item._id === productWithImage._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === productWithImage._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                image: productWithImage.image,
              }
            : item
        )
      );
    } else {
      setCart([...cart, { ...productWithImage, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
