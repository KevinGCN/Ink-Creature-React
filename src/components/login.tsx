import { useState } from "react";
import { useAuth } from "../services/auth";
import "../styles/Login.css";

/**
 * Props del componente Login
 * onClose: callback opcional para cerrar el modal
 */
interface LoginProps { onClose?: () => void; }

/**
 * Componente Login: Modal de autenticación
 * Modos:
 * - Login: correo + contraseña
 * - Registro: nombre + correo + contraseña (mín 8 chars)
 * - Google: login simulado (no integración real)
 */
export const Login = ({ onClose }: LoginProps) => {
  // Estado interno: controla si muestra formulario de login o registro
  const [modoRegistro, setModoRegistro] = useState(false);
  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  // Estado de feedback
  const [mensajeError, setMensajeError] = useState("");
  // Estado de loading para botón Google
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  
  // Hook de auth: funciones login, registrar, loginConGoogle
  const { login, registrar, loginConGoogle } = useAuth();

  /**
   * Limpia todos los campos y mensajes de error
   */
  const limpiar = () => { setMensajeError(""); setNombre(""); setCorreo(""); setPassword(""); };
  
  /**
   * Cambia a modo registro y limpia campos
   */
  const irARegistro = () => { setModoRegistro(true); limpiar(); };
  
  /**
   * Cambia a modo login y limpia campos
   */
  const irALogin = () => { setModoRegistro(false); limpiar(); };

  /**
   * Handler para envío de formulario de login
   * Validaciones:
   * 1. Correo y contraseña no vacíos
   * 2. Formato de correo válido con regex
   * Llama a auth.login() y en success cierra modal
   */
  const iniciarSesion = async () => {
    setMensajeError("");
    if (!correo || !password) return setMensajeError("Por favor, ingresa tu correo y contraseña");
    // Validación regex básica: algo@algo.algo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return setMensajeError("Por favor, ingresa un correo electrónico válido (ej: usuario@dominio.com)");
    const result = await login(correo, password);
    if (result.success) { onClose?.(); }
    else setMensajeError(result.message || "Correo o contraseña incorrectos.");
  };
   
  /**
   * Handler para envío de formulario de registro
   * Validaciones:
   * 1. Todos los campos llenos
   * 2. Correo con formato válido
   * 3. Contraseña mín 8 caracteres
   * Llama a auth.registrar() y en success cierra modal
   */
  const registrarse = async () => {
    setMensajeError("");
    if (!nombre || !correo || !password) return setMensajeError("Por favor, completa todos los campos");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return setMensajeError("Por favor, ingresa un correo electrónico válido (ej: usuario@dominio.com)");
    if (password.length < 8) return setMensajeError("La contraseña debe tener al menos 8 caracteres");
    const result = await registrar(nombre, correo, password);
    if (result.success) { onClose?.(); }
    else setMensajeError(result.message || "Error al registrar.");
  };

  /**
   * Handler para login con Google (simulado)
   * Muestra loading, llama a auth.loginConGoogle()
   * Muestra alerta en success o error en falla
   */
  const loginGoogle = async () => {
    setMensajeError(""); setCargandoGoogle(true);
    try {
      const ok = await loginConGoogle();
      if (ok) { alert("¡Inicio de sesión con Google exitoso!"); onClose?.(); }
      else setMensajeError("Error al iniciar con Google.");
    } catch { setMensajeError("No se pudo iniciar sesión con Google."); }
    finally { setCargandoGoogle(false); }
  };

  return (
    <div className="login-modal">
      <div className="login-container">
        {/* Header: título dinámico + botón X para cerrar */}
        <div className="login-header">
          <h2 style={{ margin: 0 }}>{modoRegistro ? "Crear cuenta" : "Iniciar sesión"}</h2>
          <button onClick={onClose} className="login-link" style={{ fontSize: "24px" }}>×</button>
        </div>

        {/* Mensaje de error (si existe) */}
        {mensajeError && <div className="login-error">{mensajeError}</div>}

        {/* Contenido dinámico según modo */}
        {!modoRegistro ? (
          /* FORMULARIO DE LOGIN */
          <>
            <div className="login-form-group">
              <label className="login-label">Correo electrónico</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu@email.com" className="login-input" />
            </div>
            <div className="login-form-group">
              <label className="login-label">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="login-input" />
            </div>
            <button onClick={iniciarSesion} className="login-button">Iniciar sesión</button>
          </>
        ) : (
          /* FORMULARIO DE REGISTRO */
          <>
            <div className="login-form-group">
              <label className="login-label">Nombre completo</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan Pérez" className="login-input" />
            </div>
            <div className="login-form-group">
              <label className="login-label">Correo electrónico</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu@email.com" className="login-input" />
            </div>
            <div className="login-form-group">
              <label className="login-label">Contraseña (mínimo 8)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="login-input" />
            </div>
            <button onClick={registrarse} className="login-button">Registrarse</button>
          </>
        )}

        {/* Botón Google - separado del formulario principal */}
        <button onClick={loginGoogle} disabled={cargandoGoogle} className="login-button login-button-google" style={{ opacity: cargandoGoogle ? 0.7 : 1 }}>
          {cargandoGoogle ? "Conectando..." : "Continuar con Google"}
        </button>

        {/* Footer con enlace para cambiar entre modo login/registro */}
        <div className="login-footer">
          {!modoRegistro ? (
            <p>¿No tienes cuenta? <button onClick={irARegistro} className="login-link">Regístrate</button></p>
          ) : (
            <p>¿Ya tienes cuenta? <button onClick={irALogin} className="login-link">Inicia sesión</button></p>
          )}
        </div>
      </div>
    </div>
  );
};