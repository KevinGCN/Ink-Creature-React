import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../services/auth";

export const UserNavbar = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const { usuario, isLoggedIn, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const abrirLogin = () => {
    setMostrarLogin(true);
  };

  const cerrarLogin = () => {
    setMostrarLogin(false);
  };

  const toggleAjustes = () => {
    setMostrarAjustes(!mostrarAjustes);
  };

  const irPerfil = () => {
    setMostrarAjustes(false);
    navigate("/profile");
  };

  const logout = () => {
    authLogout();
    setMostrarAjustes(false);
    navigate("/");
  };

  return (
    <>
      <div style={{
        position: "fixed",
        top: "10px",
        right: "20px",
        zIndex: 1000
      }}>
        {!isLoggedIn ? (
          <button
            onClick={abrirLogin}
            style={{
              padding: "8px 16px",
              backgroundColor: "#aa3bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sesión
          </button>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleAjustes}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 10px",
                backgroundColor: "#f4f3ec",
                border: "1px solid #ddd",
                borderRadius: "20px",
                cursor: "pointer"
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#aa3bff",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {(usuario?.nombre || usuario?.email || "U").charAt(0).toUpperCase()}
              </div>
              <span>{usuario?.nombre || usuario?.email?.split("@")[0] || "Usuario"}</span>
            </button>

            {mostrarAjustes && (
              <div style={{
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "150px",
                padding: "8px"
              }}>
                <button
                  onClick={irPerfil}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f4f3ec"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Perfil
                </button>
                <button
                  onClick={logout}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                    color: "#ff4444"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f4f3ec"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {mostrarLogin && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "90%"
          }}>
            <h3 style={{ marginTop: 0 }}>Iniciar sesión</h3>
            <p>Modal de login pendiente de implementar</p>
            <button
              onClick={cerrarLogin}
              style={{
                padding: "8px 16px",
                backgroundColor: "#aa3bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};