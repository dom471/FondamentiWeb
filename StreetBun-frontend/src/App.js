// definisce la struttura generale dell’app e le route
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./global.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import History from "./pages/History";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import Recipes from "./pages/Recipes";
import { AuthContext } from "./context/AuthContext";

// componente principale dell’applicazione
function App() {
  // ottiene l’utente autenticato dal contesto
  const { user } = useContext(AuthContext);
  const canViewAdmin = user?.role === "owner";
  const canViewRecipes = user?.role === "worker";
  // definisce le route dell’applicazione
  return (
    <Router>
      <Header />
      <div className="background-container">
        <img src="/StreetBun-Sfondo.png" alt="StreetBun Background" />
      </div>
      <main className="content">
        {/* definisce le route e i componenti associati */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          {/* protezione accesso pagine tramite URL */}
          <Route
            path="/history"
            element={canViewAdmin ? <History /> : <Navigate to="/" replace />}
          />
          <Route 
            path="/admin" 
            element={canViewAdmin ? <AdminProducts /> : <Navigate to="/" replace />}
          />
          <Route 
          path="/admin/orders" 
          element={(canViewAdmin || canViewRecipes) ? <AdminOrders /> : <Navigate to="/" replace />}
          />
          <Route 
          path="/ricette" 
            element={canViewRecipes ? <Recipes /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;