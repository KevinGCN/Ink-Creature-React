import { useState } from "react";
import { useAuth } from "../services/auth";
import "./Login.css";

interface LoginProps { onClose?: () => void; }

export const Login = ({ onClose }: LoginProps) => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const { login, registrar, loginConGoogle } = useAuth();

  const limpiar = () => { setMensajeError(""); setNombre(""); setCorreo(""); setPassword(""); };
  const irARegistro = () => { setModoRegistro(true); limpiar(); };
  const irALogin = () => { setModoRegistro(false); limpiar(); };

  const iniciarSesion = async () => {
    setMensajeError("");
    if (!correo || !password) return setMensajeError("Por favor, ingresa tu correo y contraseña");
    if (!correo.includes("@")) return setMensajeError("Por favor, ingresa un correo electrónico válido");
    const ok = await login(correo, password);
    if (ok) { alert("¡Inicio de sesión exitoso!"); onClose?.(); }
    else setMensajeError("Correo o contraseña incorrectos.");
  };

  const registrarse = async () => {
    setMensajeError("");
    if (!nombre || !correo || !password) return setMensajeError("Por favor, completa todos los campos");
    if (!correo.includes("@")) return setMensajeError("Por favor, ingresa un correo electrónico válido");
    if (password.length < 8) return setMensajeError("La contraseña debe tener al menos 8 caracteres");
    const ok = await registrar(nombre, correo, password);
    if (ok) { alert("¡Registro exitoso!"); onClose?.(); }
    else setMensajeError("Error al registrar.");
  };

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
        <div className="login-header">
          <h2 style={{ margin: 0 }}>{modoRegistro ? "Crear cuenta" : "Iniciar sesión"}</h2>
          <button onClick={onClose} className="login-link" style={{ fontSize: "24px" }}>×</button>
        </div>

        {mensajeError && <div className="login-error">{mensajeError}</div>}

        {!modoRegistro ? (
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

        <button onClick={loginGoogle} disabled={cargandoGoogle} className="login-button login-button-google" style={{ opacity: cargandoGoogle ? 0.7 : 1 }}>
          {cargandoGoogle ? "Conectando..." : "Continuar con Google"}
        </button>

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