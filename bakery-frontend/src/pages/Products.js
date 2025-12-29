import { useEffect, useState, useContext, useRef } from "react";
import "./Products.css";
import { CartContext } from "../context/CartContext";
import API_URL from "../config";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, syncCartWithProducts } = useContext(CartContext);
  const [cartToast, setCartToast] = useState(null);
  const hideToastTimeoutRef = useRef(null);
  const removeToastTimeoutRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((product) => {
          return {
            ...product,
            image: product.image || "",
          };
        });
        setProducts(normalized);
        syncCartWithProducts(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento prodotti:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (hideToastTimeoutRef.current) {
        clearTimeout(hideToastTimeoutRef.current);
      }
      if (removeToastTimeoutRef.current) {
        clearTimeout(removeToastTimeoutRef.current);
      }
    };
  }, []);

  const showCartToast = (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    setCartToast({ x: clickX, y: clickY, fading: false });

    if (hideToastTimeoutRef.current) {
      clearTimeout(hideToastTimeoutRef.current);
    }
    if (removeToastTimeoutRef.current) {
      clearTimeout(removeToastTimeoutRef.current);
    }

    hideToastTimeoutRef.current = setTimeout(() => {
      setCartToast((prev) => (prev ? { ...prev, fading: true } : prev));
    }, 500);

    removeToastTimeoutRef.current = setTimeout(() => {
      setCartToast(null);
    }, 1500);
  };

  const handleAddToCart = (event, product) => {
    addToCart(product);
    showCartToast(event);
  };

  if (loading)
    return <p className="products-loading">Caricamento prodotti...</p>;

  return (
    <div className="products-page">
      <h2 className="products-title">I nostri prodotti</h2>
      {cartToast && (
        <div
          className={`cart-toast${cartToast.fading ? " fade-out" : ""}`}
          style={{ left: cartToast.x + 12, top: cartToast.y + 12 }}
        >
          Prodotto aggiunto al carrello
        </div>
      )}

      <div className="products-row">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            {p.image && (
              <img className="product-img" src={p.image} alt={p.name} />
            )}
            <h3>{p.name}</h3>
            <p className="price">{"\u20AC"} {Number(p.price).toFixed(2)}</p>
            {p.description && (
              <p className="product-description">{p.description}</p>
            )}
            <button
              className="button-cart"
              onClick={(event) => handleAddToCart(event, p)}
            >
              Aggiungi al carrello
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
