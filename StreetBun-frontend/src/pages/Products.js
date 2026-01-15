// Pagina "Ordina Ora" del menù
import { useEffect, useState, useContext, useRef } from "react";
import "./Products.css";
import { CartContext } from "../context/CartContext";
import API_URL from "../config";

// Componente Products
function Products() {
  //Stato dei prodotti
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartToast, setCartToast] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  
  // Contesto del carrello
  const { addToCart, syncCartWithProducts } = useContext(CartContext);

  // Riferimenti per i timeout delle notifiche
  const hideToastTimeoutRef = useRef(null);
  const removeToastTimeoutRef = useRef(null);

  // Effetto per caricare i prodotti dall'API
  useEffect(() => {
    fetch(`${API_URL}/api/products`) //richiesta HTTP GET
      .then((res) => res.json()) //da JSON a oggetto JS
      .then((data) => {
        const normalized = data.map((product) => {
          return {
            ...product,
            image: product.image || "",
          };
        });
        // Salva i prodotti nello stato
        setProducts(normalized);
        // Sincronizza il carrello con i prodotti caricati
        syncCartWithProducts(normalized);
        // Imposta lo stato di caricamento a false
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento prodotti:", err);
        setLoading(false);
      });
  }, []);

  // Effetto per pulire i timeout quando si esce dalla pagina
  useEffect(() => {
    return () => {
      // Se il ref contiene un ID di timeout, lo cancella (stessa cosa per i 2 timeout)
      if (hideToastTimeoutRef.current) {
        clearTimeout(hideToastTimeoutRef.current);
      }
      if (removeToastTimeoutRef.current) {
        clearTimeout(removeToastTimeoutRef.current);
      }
    };
  }, []);

  // Funzione per mostrare la notifica di aggiunta al carrello
  const showCartToast = (event) => {
    // Ottiene le coordinate del click
    const clickX = event.clientX;
    const clickY = event.clientY;
    // Imposta lo stato del toast con le coordinate del click
    setCartToast({ 
      x: clickX, 
      y: clickY, 
      fading: false 
    });
    // Pulisce eventuali timeout esistenti
    if (hideToastTimeoutRef.current) {
      clearTimeout(hideToastTimeoutRef.current);
    }
    if (removeToastTimeoutRef.current) {
      clearTimeout(removeToastTimeoutRef.current);
    }
    // Imposta i timeout per far scomparire e rimuovere il toast
    hideToastTimeoutRef.current = setTimeout(() => {
      setCartToast((prev) => (prev ? { ...prev, fading: true } : prev));
    }, 500);
    // Rimuove il toast dopo la dissolvenza
    removeToastTimeoutRef.current = setTimeout(() => {
      setCartToast(null);
    }, 1500);
  };

  // Funzione per gestire l'aggiunta al carrello
  const handleAddToCart = (event, product) => {
    addToCart(product);
    showCartToast(event);
  };

  // Se i prodotti sono in caricamento, mostra un messaggio di caricamento
  if (loading)
    return <p className="products-loading">Caricamento prodotti...</p>;

  // Renderizza la pagina dei prodotti
  return (
    <div className="products-page">
      <h2 className="products-title">I nostri prodotti</h2>
      {/* Notifica di aggiunta al carrello */}
      {cartToast && (
        <div
          className={`cart-toast${cartToast.fading ? " fade-out" : ""}`}
          style={{ left: cartToast.x + 12, top: cartToast.y + 12 }}
        >
          Prodotto aggiunto al carrello
        </div>
      )}

      {/* Lista dei prodotti */}
      <div className="products-row">
        {/* Ciclo che crea una card per ogni prodotto */}
        {products.map((p, index) => {
          const productId = p._id ?? `${p.name ?? "product"}-${index}`;
          return (
            <div
              className="product-card"
              key={productId}
              onMouseEnter={() => setHoveredProductId(productId)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              {p.image && (
                <img className="product-img" src={p.image} alt={p.name} />
              )}
              <h3>{p.name}</h3>
              <p className="price">{"\u20AC"} {Number(p.price).toFixed(2)}</p>
              {p.description && (
                <p
                  className={`product-description${
                    hoveredProductId === productId ? " is-visible" : ""
                  }`}
                >
                  {p.description}
                </p>
              )}
              <button
                className="button-cart"
                onClick={(event) => handleAddToCart(event, p)}
              >
                Aggiungi al carrello
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;