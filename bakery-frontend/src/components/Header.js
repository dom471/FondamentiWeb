import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>Panificio Stefàno</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Prodotti</Link>
        <Link to="/orders">Carrello</Link>
        <Link to="/info">Info</Link>
        {user?.role === "owner" && <Link to="/admin">Gestione prodotti</Link>}
        {(user?.role === "owner" || user?.role === "worker") && <Link to="/admin/orders">Visualizzazione Ordini</Link>}
        {user?.role === "worker" && <Link to="/ricette">Ricettario</Link>}
        {user ? (
          <>
            {user.role === "owner" && <Link to="/history">Resoconto</Link>}
            <span style={{ margin: "15px", color: "#a04f16ff" }}>
              Ciao {user.name.split(" ")[0]}
              {user.role === "owner" && " (admin)"}
              {user.role === "worker" && " (lavoratore)"}
              {user.role === "customer" && " (cliente)"}
            </span>

            <button onClick={handleLogout}>Logout</button>
              </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrati</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
