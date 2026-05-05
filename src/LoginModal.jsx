import React from react 
import React, { useState } from 'react';
import './LoginModal.css';

export default function LoginModal({ onClose }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const cerrarModal = () => {
    onClose();
  };

  const irARegistro = () => {
    setModoRegistro(true);
    setMensajeError('');
    setNombre('');
    setCorreo('');
    setPassword('');
  };

  const irALogin = () => {
    setModoRegistro(false);
    setMensajeError('');
    setNombre('');
    setCorreo('');
    setPassword('');
  };

  const iniciarSesion = () => {
    console.log('Iniciar sesión:', { correo, password });
  };

  const registrarse = () => {
    console.log('Registrarse:', { nombre, correo, password });
  };

  return (
    <>
      <div className="overlay" onClick={cerrarModal}></div>

      <div className="login-container">
        <div className="header">
          <span>Ink-Creature</span>
          <button className="close-btn" onClick={cerrarModal}>✕</button>
        </div>

        <div className="content">
          {!modoRegistro ? (
            <div>
              <h2>Iniciar sesión</h2>
              <div id="googleLogin"></div>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Correo"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
              <button onClick={iniciarSesion}>Iniciar sesión</button>
              {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
              <button onClick={irARegistro}>Registrarse</button>
            </div>
          ) : (
            <div>
              <h2>Crear cuenta</h2>
              <div id="googleRegister"></div>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
              />
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Correo"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
              <button onClick={registrarse}>Registrarse</button>
              {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
              <button onClick={irALogin}>Volver</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}