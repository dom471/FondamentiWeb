import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
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
      <h1><img src="/StreetBun-Icona.png"/>StreetBun</h1>
      <div className="hamburger-menu">
        <MenuIcon className="hamburger-icon" sx={{ fontSize: 48 }} />
        <ul className="dropdown-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Prodotti</Link></li>
          <li><Link to="/orders">Carrello</Link></li>
          {user?.role === "owner" && <li><Link to="/admin">Gestione prodotti</Link></li>}
          {(user?.role === "owner" || user?.role === "worker") && <li><Link to="/admin/orders">Visualizzazione Ordini</Link></li>}
          {user?.role === "worker" && <li><Link to="/ricette">Ricettario</Link></li>}
          {user ? (
            <>
              {user.role === "owner" && <li><Link to="/history">Resoconto</Link></li>}
              <li>
                <span style={{ color: "#f7f3ef" }}>
                  Ciao {user.name.split(" ")[0]}
                  {user.role === "owner" && " (admin)"}
                  {user.role === "worker" && " (lavoratore)"}
                  {user.role === "customer" && " (cliente)"}
                </span>
              </li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Registrati</Link></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
