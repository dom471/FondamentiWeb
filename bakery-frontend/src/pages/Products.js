import { useEffect, useState, useContext } from "react";
import "./Products.css";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((product) => {
          const fallback = getProductImage(product.name);
          return {
            ...product,
            image: fallback || product.image || "",
          };
        });
        setProducts(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento prodotti:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>Caricamento prodotti...</p>;

  return (
    <div className="products-page">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        I nostri prodotti
      </h2>

      <div className="products-row">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            {p.image && (
              <img className="product-img" src={p.image} alt={p.name} />
            )}
            <h3>{p.name}</h3>
            <p className="price">{"\u20AC"} {Number(p.price).toFixed(2)}</p>
            <button onClick={() => addToCart(p)}>Aggiungi al carrello</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
