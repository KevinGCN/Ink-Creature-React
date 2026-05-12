import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";

/**
 * UserNavbar: Componente de barra de usuario posiciónada en la esquina superior derecha.
 * Similar a Navbar pero con estilos diferentes (Tailwind CSS).
 * Features:
 * - Si NO logueado → botón "Sesión" que abre modal de login
 * - Si logueado → avatar con foto o inicial + nombre, y dropdown de ajustes
 * - Dropdown incluye: Perfil y Cerrar sesión
 * - Usa clases de Tailwind para posicionamiento fijo (fixed) y estilos
 */
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

  /**
   * Alterna la visibilidad del dropdown de ajustes
   */
  const toggleAjustes = () => {
    setMostrarAjustes(!mostrarAjustes);
  };

  /**
   * Navega a la página de perfil y cierra el dropdown
   */
  const irPerfil = () => {
    setMostrarAjustes(false);
    navigate("/profile");
  };

  /**
   * Cierra sesión, limpia estado y regresa al home
   */
  const logout = () => {
    authLogout();
    setMostrarAjustes(false);
    navigate("/");
  };

  return (
    <>
      <div
        className="
          fixed top-2 right-2
          sm:top-10px sm:right-20px
          z-1000
        "
      >
        {/* Si no está logueado → botón de login */}
        {!isLoggedIn ? (
          <button
            onClick={abrirLogin}
            className="
              px-3 py-2
              sm:px-4
              bg-[#aa3bff]
              text-white
              border-none
              rounded-md
              cursor-pointer
              text-sm
              transition
              hover:bg-[#922de0]
            "
          >
            Sesión
          </button>
        ) : (
          /* Si está logueado → botón de usuario con avatar */
          <div className="relative">
            <button
              onClick={toggleAjustes}
              className="
                flex items-center gap-2
                px-2 py-1
                sm:px-10px
                bg-[#f4f3ec]
                border border-[#ddd]
                rounded-[20px]
                cursor-pointer
                max-w-180px
                overflow-hidden
              "
            >
              {/* Avatar circular con foto o inicial */}
              <div
                className="
                  w-8 h-8
                  min-w-8
                  rounded-full
                  bg-[#aa3bff]
                  text-white
                  flex items-center justify-center
                  font-bold
                "
              >
                {usuario?.photoURL ? (
                  <img
                    src={usuario.photoURL}
                    alt="Foto"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  (usuario?.nombre || usuario?.email || "U")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              {/* Nombre o username */}
              <span
                className="
                  text-sm
                  truncate
                  max-w-90px
                  sm:max-w-140px
                "
              >
                {usuario?.nombre ||
                  usuario?.email?.split("@")[0] ||
                  "Usuario"}
              </span>
            </button>

            {/* Dropdown condicional - solo si mostrarAjustes es true */}
            {mostrarAjustes && (
              <div
                className="
                  absolute top-45px right-0
                  bg-white
                  border border-[#ddd]
                  rounded-lg
                  shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                  min-w-150px
                  p-2
                  z-1100
                "
              >
                <button
                  onClick={irPerfil}
                  className="
                    w-full
                    px-3 py-2
                    text-left
                    bg-transparent
                    border-none
                    cursor-pointer
                    rounded
                    text-sm
                    hover:bg-[#f4f3ec]
                  "
                >
                  Perfil
                </button>

                <button
                  onClick={logout}
                  className="
                    w-full
                    px-3 py-2
                    text-left
                    bg-transparent
                    border-none
                    cursor-pointer
                    rounded
                    text-sm
                    text-[#ff4444]
                    hover:bg-[#f4f3ec]
                  "
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de login - implementación pendiente, solo placeholder */}
      {mostrarLogin && (
        <div
          className="
            fixed inset-0
            bg-[rgba(0,0,0,0.5)]
            flex items-center justify-center
            z-2000
            p-4
          "
        >
          <div
            className="
              bg-white
              p-5
              rounded-lg
              w-[90%]
              max-w-400px
            "
          >
            <h3 className="mt-0 text-lg font-semibold">
              Iniciar sesión
            </h3>

            <p className="text-sm text-gray-600">
              Modal de login pendiente de implementar
            </p>

            <button
              onClick={cerrarLogin}
              className="
                mt-4
                px-4 py-2
                bg-[#aa3bff]
                text-white
                border-none
                rounded-md
                cursor-pointer
                hover:bg-[#922de0]
                transition
              "
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};