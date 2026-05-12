import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import { Login } from "./login";
import "../styles/Navbar.css";

/**
 * Navbar principal de la aplicación.
 * Muestra:
 * - Enlaces de navegación (Home, Galería, Tatuadores, Información, Citas)
 * - Botón "Iniciar sesión" si NO hay usuario logueado
 * - Botón con avatar y nombre si hay usuario logueado
 * - Dropdown con opciones "Perfil" y "Cerrar sesión" (solo visible al hacer clic)
 * - Modal de login (condicional)
 */
export const Navbar = () => {
  // Estado local para controlar visibilidad del modal de login
  const [mostrarLogin, setMostrarLogin] = useState(false);
  // Estado local para controlar visibilidad del dropdown de ajustes (Perfil / Cerrar sesión)
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  
  // Hook personalizado que provee estado y métodos de autenticación
  const { usuario, isLoggedIn, logout } = useAuth();
  // Hook para navegación programática entre páginas
  const navigate = useNavigate();

  // Handlers
  const abrirLogin = () => setMostrarLogin(true);
  const cerrarLogin = () => setMostrarLogin(false);

  /**
   * Navega a la página de perfil y cierra el dropdown
   */
  const irPerfil = () => { setMostrarAjustes(false); navigate("/profile"); };
  
  /**
   * Cierra sesión, limpia estado local y redirige al home
   */
  const handleLogout = () => { logout(); setMostrarAjustes(false); navigate("/"); };

  return (
    <>
      {/* Barra de navegación superior */}
      <nav className="userbar">
        <div className="usuario">
          {/* Enlaces de navegación principales */}
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/gallery" className="navbar-link">Galería</Link>
            <Link to="/workers" className="navbar-link">Tatuadores</Link>
            <Link to="/info" className="navbar-link">Información</Link>
            <Link to="/schedules" className="navbar-link">Citas</Link>
          </div>
          
          {/* Sección derecha: Botón de login o usuario */}
          <div className="menu-ajustes">
            {/* Si NO está logueado → muestra botón "Iniciar sesión" */}
            {!isLoggedIn ? (
              <button onClick={abrirLogin} className="navbar-login-btn">Iniciar sesión</button>
            ) : (
              /* Si está logueado → muestra botón con avatar y nombre */
              <>
                {/* Botón que alterna el dropdown de ajustes */}
                <button onClick={() => setMostrarAjustes(!mostrarAjustes)} className="navbar-user-btn">
                  <div className="navbar-avatar">
                    {/* Muestra foto de perfil si existe, sino la primera letra */}
                    {usuario?.photoURL ? (
                      <img src={usuario.photoURL} alt="Foto" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      (usuario?.nombre || usuario?.email || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                  {/* Muestra primer nombre o username de email */}
                  <span>{usuario?.nombre?.split(" ")[0] || usuario?.email?.split("@")[0] || "Usuario"}</span>
                </button>
                
                {/* Dropdown con opciones - SOLO SE MUESTRA cuando mostrarAjustes === true */}
                {mostrarAjustes && (
                  <div className="dropdown">
                    <button onClick={irPerfil}>Perfil</button>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Modal de login - condicional según estado mostrarLogin */}
      {mostrarLogin && <Login onClose={cerrarLogin} />}
    </>
  );
};