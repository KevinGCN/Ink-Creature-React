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
  login: (correo: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginConGoogle: () => Promise<boolean>;
  registrar: (nombre: string, correo: string, password: string) => Promise<{ success: boolean; message?: string }>;
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

const ADMIN_EMAILS = [
  "admin@inkcreature.com",
  "ceo@inkcreature.com",
  "owner@inkcreature.com",
  "administrador@inkcreature.com",
];

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

  const obtenerUsuariosRegistrados = (): Usuario[] => {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
  };

  const guardarUsuariosRegistrados = (usuarios: Usuario[]) => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  };

  const registrar = async (
    nombre: string,
    correo: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const usuarios = obtenerUsuariosRegistrados();
      const correoNormalizado = correo.toLowerCase().trim();

      const existe = usuarios.some((u) => u.email?.toLowerCase() === correoNormalizado);
      if (existe) {
        return { success: false, message: "El correo ya está registrado" };
      }

      let charge = "Normal";
      if (ADMIN_EMAILS.some((adminEmail) => correoNormalizado === adminEmail.toLowerCase().trim())) {
        charge = "Admin";
      }

      const userData: Usuario = {
        uid: Date.now().toString(),
        nombre,
        email: correoNormalizado,
        charge,
      };

      usuarios.push(userData);
      guardarUsuariosRegistrados(usuarios);
      actualizarEstadoLocal(userData);
      return { success: true };
    } catch {
      return { success: false, message: "Error al registrar" };
    }
  };

  const login = async (
    correo: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const usuarios = obtenerUsuariosRegistrados();
      const correoNormalizado = correo.toLowerCase().trim();
      const usuario = usuarios.find((u) => u.email?.toLowerCase() === correoNormalizado);

      if (!usuario) {
        return { success: false, message: "Usuario no encontrado" };
      }

      const esAdmin = ADMIN_EMAILS.some(
        (adminEmail) => correoNormalizado === adminEmail.toLowerCase().trim(),
      );
      if (esAdmin) {
        const passwordNum = parseInt(password);
        if (isNaN(passwordNum) || passwordNum < 1 || passwordNum > 8) {
          return { success: false, message: "Contraseña de administrador inválida" };
        }
      }

      actualizarEstadoLocal(usuario);
      return { success: true };
    } catch {
      return { success: false, message: "Error al iniciar sesión" };
    }
  };

  const loginConGoogle = async (): Promise<boolean> => {
    try {
      const userData: Usuario = {
        uid: Date.now().toString(),
        nombre: "Usuario Google",
        email: "google@example.com",
      };
      actualizarEstadoLocal(userData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => actualizarEstadoLocal(null);

  const enviarRecuperacionContrasena = async (correo: string): Promise<boolean> => {
    return true;
  };

  const actualizarUsuario = (u: Usuario) => {
    localStorage.setItem("usuario", JSON.stringify(u));
    setUsuario(u);
  };

  const obtenerUsuario = (): Usuario | null => {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
  };

  const estaLogueado = () => localStorage.getItem("logueado") === "true";

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isLoggedIn,
        login,
        loginConGoogle,
        registrar,
        logout,
        enviarRecuperacionContrasena,
        actualizarUsuario,
        obtenerUsuario,
        estaLogueado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};