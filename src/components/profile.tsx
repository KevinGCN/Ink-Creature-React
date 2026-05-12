import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  tatuador: string;
}

export const Profile = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [usuarioLocal, setUsuarioLocal] = useState<any>(usuario || {});
  const [citas, setCitas] = useState<Cita[]>([]);
  const [foto, setFoto] = useState<string>("");
  const [editando, setEditando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarCitas();
    cargarFoto();
  }, []);

  const cargarCitas = () => {
    const citasGuardadas = localStorage.getItem("citas");
    setCitas(citasGuardadas ? JSON.parse(citasGuardadas) : []);
  };

  const cargarFoto = () => {
    setFoto(localStorage.getItem("fotoPerfil") || "");
  };

  const eliminar = (id: number) => {
    const nuevasCitas = citas.filter(c => c.id !== id);
    setCitas(nuevasCitas);
    localStorage.setItem("citas", JSON.stringify(nuevasCitas));
  };

  const cambiarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validarTamanoArchivo(file, 2)) {
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFoto(reader.result as string);
      localStorage.setItem("fotoPerfil", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
  const cancelarEdicion = () => {
    setEditando(false);
    setUsuarioLocal(usuario);
  };

  const guardarCambios = () => {
    if (!usuarioLocal.nombre || !usuarioLocal.email) {
      setMensajeError("Nombre y correo son obligatorios");
      return;
    }
    actualizarUsuario(usuarioLocal);
    setEditando(false);
    setMensajeError("");
  };

  const irAgenda = () => navigate("/schedules");
  const editarCita = (cita: Cita) => navigate("/schedules", { state: { citaEditar: cita } });

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>Mi Perfil</h2>
      </div>

      {mensajeError && (
        <div style={{ padding: "10px", backgroundColor: "#ffeeee", color: "#ff4444", borderRadius: "4px", marginBottom: "20px" }}>
          {mensajeError}
        </div>
      )}

      <div style={{ display: "flex", gap: "30px", marginBottom: "30px", alignItems: "flex-start" }}>
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
            <input type="file" onChange={cambiarFoto} accept="image/*" style={{ display: "none" }} />
          </label>
        </div>

        <div style={{ flex: 1 }}>
          {!editando ? (
            <>
              <p style={{ margin: "10px 0" }}><strong>Nombre:</strong> {usuarioLocal?.nombre || "No definido"}</p>
              <p style={{ margin: "10px 0" }}><strong>Email:</strong> {usuarioLocal?.email || "No definido"}</p>
              <button onClick={activarEdicion} style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#6b6375", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Editar
              </button>
            </>
          ) : (
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

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0 }}>Mis Citas</h3>
          <button onClick={irAgenda} style={{ padding: "8px 16px", backgroundColor: "#6b6375", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Ir a Agenda
          </button>
        </div>

        {citas.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#6b6375", backgroundColor: "#f4f3ec", borderRadius: "8px" }}>
            No tienes citas registradas
          </div>
        ) : (
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