import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import { Login } from "./login";
import "../styles/Navbar.css";

export const Navbar = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const { usuario, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const abrirLogin = () => setMostrarLogin(true);
  const cerrarLogin = () => setMostrarLogin(false);

  const irPerfil = () => { setMostrarAjustes(false); navigate("/profile"); };
  const handleLogout = () => { logout(); setMostrarAjustes(false); navigate("/"); };

  return (
    <>
      <nav className="userbar">
        <div className="usuario">
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/gallery" className="navbar-link">Galería</Link>
            <Link to="/home" className="navbar-link">Home</Link>
          </div>
          <div className="menu-ajustes">
            {!isLoggedIn ? (
              <button onClick={abrirLogin} className="navbar-login-btn">Iniciar sesión</button>
            ) : (
              <>
                <button onClick={() => setMostrarAjustes(!mostrarAjustes)} className="navbar-user-btn">
                  <div className="navbar-avatar">
                    {(usuario?.nombre || usuario?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span>{usuario?.nombre?.split(" ")[0] || usuario?.email?.split("@")[0] || "Usuario"}</span>
                </button>
                <div className="dropdown">
                  <button onClick={irPerfil}>Perfil</button>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      {mostrarLogin && <Login onClose={cerrarLogin} />}
    </>
  );
};