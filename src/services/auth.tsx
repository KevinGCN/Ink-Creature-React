import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Interfaz de usuario del sistema
 * Campos:
 * - uid: ID único (string)
 * - nombre: Nombre completo del usuario
 * - email: Correo electrónico
 * - photoURL: URL de la foto de perfil (Base64 o URL externa)
 * - charge: Cargo/rol ("Normal" o "Admin")
 * - password: Contraseña (solo para usuarios normales, se guarda en texto plano)
 */
interface Usuario {
  uid?: string;
  nombre?: string;
  email?: string;
  password?: string;
  photoURL?: string;
  charge?: string;
}

/**
 * Interfaz del contexto de autenticación
 * Provee: usuario, estado de login, y funciones CRUD + auxiliares
 */
interface AuthContextType {
  usuario: Usuario | null;
  isLoggedIn: boolean;
  login: (correo: string, password: string) => Promise<{ success: boolean, message?: string }>;
  loginConGoogle: () => Promise<boolean>;
  registrar: (nombre: string, correo: string, password: string) => Promise<{ success: boolean, message?: string }>;
  logout: () => void;
  actualizarUsuario: (u: Usuario) => void;
  obtenerUsuario: () => Usuario | null;
  estaLogueado: () => boolean;
}

// Creación del contexto React (tipado pero inicialmente undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personalizado para consumir el contexto de auth
 * Lanza error si se usa fuera de AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

/**
 * AuthProvider: Componente proveedor del contexto de autenticación
 * Almacena estado en:
 * - Estado React (usuario, isLoggedIn)
 * - localStorage (persistencia entre recargas)
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * useEffect inicial: Al montar, recupera estado desde localStorage
   * Keys:
   * - "logueado": boolean (true/false)
   * - "usuario": objeto Usuario serializado como JSON
   */
  useEffect(() => {
    const storedAuth = localStorage.getItem("logueado") === "true";
    setIsLoggedIn(storedAuth);
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
  }, []);

  /**
   * Actualiza el estado de auth y persiste en localStorage
   * Si user es null → borra datos (logout)
   * Si user existe → guarda usuario y marca logueado
   * Además, recupera photoURL de "fotoPerfil" si no viene en el objeto user
   */
  const actualizarEstadoLocal = (user: Usuario | null) => {
    if (user) {
      // Si el usuario no tiene photoURL pero hay una foto guardada, agregarla
      const usuarioConFoto = { ...user };
      if (!usuarioConFoto.photoURL) {
        const fotoGuardada = localStorage.getItem("fotoPerfil");
        if (fotoGuardada) {
          usuarioConFoto.photoURL = fotoGuardada;
        }
      }
      localStorage.setItem("usuario", JSON.stringify(usuarioConFoto));
      localStorage.setItem("logueado", "true");
      setUsuario(usuarioConFoto);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("logueado");
      localStorage.removeItem("usuario");
      setUsuario(null);
      setIsLoggedIn(false);
    }
  };

  /**
   * Obtiene todos los usuarios registrados desde localStorage
   * Key: "usuarios" → array de objetos Usuario (sin passwords de admin)
   */
  const obtenerUsuariosRegistrados = (): Usuario[] => {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
  };

  /**
   * Guarda el array de usuarios en localStorage
   * @param usuarios - Array de objetos Usuario
   */
  const guardarUsuariosRegistrados = (usuarios: Usuario[]) => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  };

  /**
   * Función de registro de nuevo usuario
   * Validaciones:
   * 1. Correo no debe existir ya en la lista
   * 2. Asigna cargo "Admin" si correo está en lista adminEmails
   * 3. Guarda en localStorage("usuarios") y actualiza estado local
   */
  const registrar = async (nombre: string, correo: string, password: string): Promise<{ success: boolean, message?: string }> => {
    try {
      const usuarios = obtenerUsuariosRegistrados();
      const correoNormalizado = correo.toLowerCase().trim();

      const existe = usuarios.some(u => u.email?.toLowerCase() === correoNormalizado);
      if (existe) {
        return { success: false, message: "El correo ya está registrado" };
      }

      // Array de correos admin predefinidos
      const adminEmails = [
        "admin@inkcreature.com",
        "ceo@inkcreature.com",
        "owner@inkcreature.com",
        "administrador@inkcreature.com"
      ];

      // Determinar cargo basado en si el correo está en la lista de admins
      let charge = "Normal";
      if (adminEmails.some(adminEmail => correoNormalizado === adminEmail.toLowerCase().trim())) {
        charge = "Admin";
      }

      const userData: Usuario = {
        uid: Date.now().toString(),
        nombre,
        email: correoNormalizado,
        password,
        charge
      };

      usuarios.push(userData);
      guardarUsuariosRegistrados(usuarios);
      actualizarEstadoLocal(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Error al registrar" };
    }
  };

  /**
   * Función de login con correo y contraseña
   * Validaciones:
   * 1. Usuario debe existir en localStorage("usuarios")
   * 2. Admin: password numérico 1-8
   * 3. Normal: password debe coincidir exactamente con la guardada
   */
  const login = async (correo: string, password: string): Promise<{ success: boolean, message?: string }> => {
    try {
      const usuarios = obtenerUsuariosRegistrados();
      const correoNormalizado = correo.toLowerCase().trim();
      let usuario = usuarios.find(u => u.email?.toLowerCase() === correoNormalizado && u.password === password);
      // Admin email list
      const adminEmails = [
        "admin@inkcreature.com",
        "ceo@inkcreature.com",
        "owner@inkcreature.com",
        "administrador@inkcreature.com"
      ];

      const esAdmin = adminEmails.some(adminEmail => correoNormalizado === adminEmail.toLowerCase().trim());

      // If user doesn't exist but is an admin email, allow login with specific password
      if (!usuario && esAdmin) {
        if (password !== "12345678") {
          return { success: false, message: "Contraseña de administrador inválida" };
        }
        // Create admin user on the fly
        usuario = {
          uid: "admin-" + correoNormalizado,
          nombre: "Administrador",
          email: correoNormalizado,
          charge: "Admin"
        };
        actualizarEstadoLocal(usuario);
        return { success: true };
      }

      // User must exist for non-admin emails
      if (!usuario) {
        return { success: false, message: "Usuario no encontrado" };
      }

      // Normal user: verify stored password
      if (!usuario.password || usuario.password !== password) {
        return { success: false, message: "Contraseña incorrecta" };
      }

      actualizarEstadoLocal(usuario);
      return { success: true };
    } catch {
      return { success: false, message: "Error al iniciar sesión" };
    }
  };

  /**
   * Login con Google (simulado)
   * Crea usuario fake y actualiza estado local
   * NOTA: No hay integración real con Google OAuth
   */
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

  /**
   * Cierra sesión: limpia estado y localStorage
   */
  const logout = () => actualizarEstadoLocal(null);

  /**
   * Actualiza solo el usuario en el contexto (sin tocar localStorage directamente)
   * Se usa para cambios parciales como photoURL
   * @param u - Objeto Usuario (parcial o completa)
   */
  const actualizarUsuario = (u: Usuario) => {
    localStorage.setItem("usuario", JSON.stringify(u));
    setUsuario(u);
  };

  /**
   * Retorna el usuario actual desde localStorage
   * Útil para acceder al usuario fuera del Provider
   */
  const obtenerUsuario = () => {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
  };

  /**
   * Chequea si hay sesión activa (leyendo localStorage)
   * Retorna true si "logueado" === "true"
   */
  const estaLogueado = () => localStorage.getItem("logueado") === "true";

  /**
   * Proveedor del contexto: envía valores a hijos
   */
  return (
    <AuthContext.Provider value={{
      usuario,
      isLoggedIn,
      login,
      loginConGoogle,
      registrar,
      logout,
      actualizarUsuario,
      obtenerUsuario,
      estaLogueado
    }}>
      {children}
    </AuthContext.Provider>
  );
};