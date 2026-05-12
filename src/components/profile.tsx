import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";

/**
 * Interfaz para objetos de cita
 */
interface Cita {
  id: number;
  fecha: string;
  hora: string;
  tatuador: string;
}

/**
 * Componente Profile: Muestra y edita información del usuario
 * Features:
 * - Foto de perfil (almacenada en localStorage como "fotoPerfil")
 * - Edición de nombre y email
 * - Lista de citas con opciones editar/eliminar
 * - Botón para ir a Agenda (schedules)
 */
export const Profile = () => {
   // Hook de autenticación: acceso a usuario y método actualizarUsuario
   const { usuario, actualizarUsuario } = useAuth();
   
   // Estado local para edición de campos del usuario
   const [usuarioLocal, setUsuarioLocal] = useState<any>(usuario || {});
   const [citas, setCitas] = useState<Cita[]>([]);
   const [foto, setFoto] = useState<string>("");
   const [editando, setEditando] = useState(false);
   const [mensajeError, setMensajeError] = useState("");
   const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      cargarCitas();
    }
    cargarFoto();
  }, [usuario]);

  const cargarCitas = () => {
    if (!usuario?.nombre) return;
    const citasGuardadas = localStorage.getItem(`citas_${usuario.nombre}`);
    setCitas(citasGuardadas ? JSON.parse(citasGuardadas) : []);
  };

   /**
    * Carga la foto de perfil desde localStorage key: "fotoPerfil"
    */
   const cargarFoto = () => {
     setFoto(localStorage.getItem("fotoPerfil") || "");
   };

  const eliminar = (id: number) => {
    const nuevasCitas = citas.filter((c) => c.id !== id);
    setCitas(nuevasCitas);
    if (usuario?.uid) {
      localStorage.setItem(
        `citas_${usuario.uid}`,
        JSON.stringify(nuevasCitas)
      );
    }
  };

   /**
    * Maneja el cambio de foto de perfil:
    * 1. Valida tamaño (máx 2MB)
    * 2. Convierte imagen a DataURL (Base64) con FileReader
    * 3. Guarda en localStorage ("fotoPerfil")
    * 4. Actualiza photoURL en el contexto de autenticación (para navbar)
    */
   const cambiarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;

     // Validación de tamaño: máximo 2 MB
     if (!validarTamanoArchivo(file, 2)) {
       e.target.value = "";
       return;
     }

     const reader = new FileReader();
     reader.onload = () => {
       const fotoDataUrl = reader.result as string;
       setFoto(fotoDataUrl);
       localStorage.setItem("fotoPerfil", fotoDataUrl);
       // Sincroniza con AuthContext para que navbar muestre la nueva foto
       actualizarUsuario({ ...usuario, photoURL: fotoDataUrl });
     };
     reader.readAsDataURL(file);
   };

   /**
    * Valida que el archivo no exceda el tamaño máximo en MB
    * @param file - Archivo a validar
    * @param maxMB - Tamaño máximo en megabytes (default 2)
    * @returns true si pasa validación
    */
   const validarTamanoArchivo = (file: File, maxMB: number = 2): boolean => {
     const maxBytes = maxMB * 1024 * 1024;
     if (file.size > maxBytes) {
       setMensajeError(`El archivo supera ${maxMB} MB`);
       return false;
     }
     setMensajeError("");
     return true;
   };

   const activarEdicion = () => setEditando(true);
   
   /**
    * Cancela la edición y restaura usuarioLocal al estado original
    */
   const cancelarEdicion = () => {
     setEditando(false);
     setUsuarioLocal(usuario);
   };

   /**
    * Guarda cambios en nombre/email:
    * 1. Valida campos obligatorios
    * 2. Actualiza AuthContext via actualizarUsuario()
    * 3. Sale del modo edición
    */
   const guardarCambios = () => {
     if (!usuarioLocal.nombre || !usuarioLocal.email) {
       setMensajeError("Nombre y correo son obligatorios");
       return;
     }
     actualizarUsuario(usuarioLocal);
     setEditando(false);
     setMensajeError("");
   };

   /**
    * Navega a la página de Agenda (schedules)
    */
   const irAgenda = () => navigate("/schedules");
   
   /**
    * Navega a schedules pasando la cita a editar por state
    * @param cita - Objeto cita a editar
    */
   const editarCita = (cita: Cita) => navigate("/schedules", { state: { citaEditar: cita } });

   return (
     <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
       <div style={{ marginBottom: "30px" }}>
         <h2 style={{ margin: 0 }}>Mi Perfil</h2>
       </div>

       {/* Mensajes de error con fondo rojo claro */}
       {mensajeError && (
         <div style={{ padding: "10px", backgroundColor: "#ffeeee", color: "#ff4444", borderRadius: "4px", marginBottom: "20px" }}>
           {mensajeError}
         </div>
       )}

       {/* Sección superior: Foto + Datos de usuario */}
       <div style={{ display: "flex", gap: "30px", marginBottom: "30px", alignItems: "flex-start" }}>
         {/* Columna izquierda: Foto de perfil */}
         <div style={{ flexShrink: 0 }}>
           {foto ? (
             <img src={foto} alt="Foto" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }} />
           ) : (
             <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#e5e4e7", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6375" }}>
               Sin foto
             </div>
           )}
           <label style={{ display: "block", marginTop: "10px", padding: "8px 16px", backgroundColor: "#aa3bff", color: "white", borderRadius: "4px", cursor: "pointer", textAlign: "center", fontSize: "14px" }}>
             {foto ? "Cambiar foto" : "Subir foto"}
             {/* Input file oculto que se activa al hacer clic en el label */}
             <input type="file" onChange={cambiarFoto} accept="image/*" style={{ display: "none" }} />
           </label>
         </div>

         {/* Columna derecha: Información editable */}
         <div style={{ flex: 1 }}>
           {!editando ? (
             /* Modo visualización */
             <>
               <p style={{ margin: "10px 0" }}><strong>Nombre:</strong> {usuarioLocal?.nombre || "No definido"}</p>
               <p style={{ margin: "10px 0" }}><strong>Email:</strong> {usuarioLocal?.email || "No definido"}</p>
               <button onClick={activarEdicion} style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#6b6375", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                 Editar
               </button>
             </>
           ) : (
             /* Modo edición */
             <>
               <div style={{ marginBottom: "10px" }}>
                 <label style={{ display: "block", marginBottom: "5px" }}>Nombre:</label>
                 <input type="text" value={usuarioLocal?.nombre || ""} onChange={(e) => setUsuarioLocal({ ...usuarioLocal, nombre: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
               </div>
               <div style={{ marginBottom: "10px" }}>
                 <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
                 <input type="email" value={usuarioLocal?.email || ""} onChange={(e) => setUsuarioLocal({ ...usuarioLocal, email: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }} />
               </div>
               <div>
                 <button onClick={guardarCambios} style={{ padding: "8px 16px", backgroundColor: "#aa3bff", color: "white", border: "none", borderRadius: "4px", marginRight: "10px", cursor: "pointer" }}>
                   Guardar
                 </button>
                 <button onClick={cancelarEdicion} style={{ padding: "8px 16px", backgroundColor: "#6b6375", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                   Cancelar
                 </button>
               </div>
             </>
           )}
         </div>
       </div>

       {/* Sección inferior: Lista de citas */}
       <div>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
           <h3 style={{ margin: 0 }}>Mis Citas</h3>
           <button onClick={irAgenda} style={{ padding: "8px 16px", backgroundColor: "#6b6375", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
             Ir a Agenda
           </button>
         </div>

         {/* Si no hay citas → mensaje informativo */}
         {citas.length === 0 ? (
           <div style={{ padding: "20px", textAlign: "center", color: "#6b6375", backgroundColor: "#f4f3ec", borderRadius: "8px" }}>
             No tienes citas registradas
           </div>
         ) : (
           /* Renderizado de cada cita con botones editar/eliminar */
           citas.map(cita => (
             <div key={cita.id} style={{ padding: "15px", border: "1px solid #e5e4e7", borderRadius: "8px", marginBottom: "10px" }}>
               <p style={{ margin: "5px 0" }}><strong>Fecha:</strong> {cita.fecha}</p>
               <p style={{ margin: "5px 0" }}><strong>Hora:</strong> {cita.hora}</p>
               <p style={{ margin: "5px 0" }}><strong>Tatuador:</strong> {cita.tatuador}</p>
               <div style={{ marginTop: "10px" }}>
                 <button onClick={() => editarCita(cita)} style={{ padding: "6px 12px", backgroundColor: "#aa3bff", color: "white", border: "none", borderRadius: "4px", marginRight: "10px", cursor: "pointer" }}>
                   Editar
                 </button>
                 <button onClick={() => eliminar(cita.id)} style={{ padding: "6px 12px", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                   Eliminar
                 </button>
               </div>
             </div>
           ))
         )}
       </div>
     </div>
   );
    };