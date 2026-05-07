import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Usuario {
  uid?: string;
  nombre?: string;
  email?: string;
  photoURL?: string;
  charge?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  isLoggedIn: boolean;
  login: (correo: string, password: string) => Promise<boolean>;
  loginConGoogle: () => Promise<boolean>;
  registrar: (nombre: string, correo: string, password: string) => Promise<boolean>;
  logout: () => void;
  enviarRecuperacionContrasena: (correo: string) => Promise<boolean>;
  actualizarUsuario: (u: Usuario) => void;
  obtenerUsuario: () => Usuario | null;
  estaLogueado: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("logueado") === "true";
    setIsLoggedIn(storedAuth);
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  const actualizarEstadoLocal = (user: Usuario | null) => {
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
      localStorage.setItem("logueado", "true");
      setUsuario(user);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("logueado");
      localStorage.removeItem("usuario");
      setUsuario(null);
      setIsLoggedIn(false);
    }
  };

  const registrar = async (nombre: string, correo: string, password: string): Promise<boolean> => {
    try {
      const userData: Usuario = {
        uid: Date.now().toString(),
        nombre,
        email: correo,
        charge: "Normal"
      };
      actualizarEstadoLocal(userData);
      return true;
    } catch { return false; }
  };

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      const userData: Usuario = {
        uid: Date.now().toString(),
        nombre: correo.split("@")[0],
        email: correo
      };
      actualizarEstadoLocal(userData);
      return true;
    } catch { return false; }
  };

  const loginConGoogle = async (): Promise<boolean> => {
    try {
      const userData: Usuario = {
        uid: Date.now().toString(),
        nombre: "Usuario Google",
        email: "google@example.com"
      };
      actualizarEstadoLocal(userData);
      return true;
    } catch { return false; }
  };

  const logout = () => actualizarEstadoLocal(null);

  const enviarRecuperacionContrasena = async (correo: string) => true;
  const actualizarUsuario = (u: Usuario) => { localStorage.setItem("usuario", JSON.stringify(u)); setUsuario(u); };
  const obtenerUsuario = () => JSON.parse(localStorage.getItem("usuario") || "{}");
  const estaLogueado = () => localStorage.getItem("logueado") === "true";

  return (
    <AuthContext.Provider value={{ usuario, isLoggedIn, login, loginConGoogle, registrar, logout, enviarRecuperacionContrasena, actualizarUsuario, obtenerUsuario, estaLogueado }}>
      {children}
    </AuthContext.Provider>
  );
};