import "../styles/workers.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/auth";
import { tatuadores } from "../services/data";

export const Workers = () => {
  const { usuario, estaLogueado } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");

  // Verificar si es admin o CEO basado en el cargo
  const esAdmin = estaLogueado() && (usuario?.charge === "Admin" || usuario?.charge === "CEO");

  // Formulario
  const [form, setForm] = useState({
    nombre: "",
    cargo: "Tatuador",
    especialidad: "",
    experiencia: 1,
    descripcion: "",
    estrellas: 5,
    foto: ""
  });

  // Lista de tatuadores
  const [listaTatuadores, setListaTatuadores] =
    useState(tatuadores);

  // ============ FUNCIONES ================
  // Genera estrellas
  const obtenerEstrellas = (num: number) => {
    return "⭐".repeat(num);
  };

  // Abrir modal agregar
  const abrirAgregar = () => {
    setModoEdicion(false);
    setMostrarModal(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
  };

  // Abrir modal editar
  const abrirEditar = (t: any) => {
    setModoEdicion(true);
    setForm({
      nombre: t.nombre,
      cargo: t.cargo,
      especialidad: t.especialidad,
      experiencia: t.experiencia,
      descripcion: t.descripcion || "",
      estrellas: t.estrellas,
      foto: t.foto
    });
    setFotoPreview(t.foto);
    setMostrarModal(true);
  };

  // Eliminar tatuador
  const eliminar = (id: number) => {
    const nuevaLista = listaTatuadores.filter(
      (t) => t.id !== id
    );
    setListaTatuadores(nuevaLista);
  };

  // Cargar imagen
  const cargarFoto = (e: any) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFotoPreview(reader.result as string);
      setForm({
        ...form,
        foto: reader.result as string
      });
    };
    reader.readAsDataURL(archivo);
  };

  // Guardar tatuador
  const guardar = () => {
    if (!form.nombre || !form.especialidad) {
      setErrorForm(
        "Completa los campos obligatorios"
      );
      return;
    }
    setErrorForm("");

    // Agregar nuevo
    if (!modoEdicion) {
      const nuevoTatuador = {
        id: Date.now(),
        ...form
      };
      setListaTatuadores([
        ...listaTatuadores,
        nuevoTatuador
      ]);
    }
    cerrarModal();
  };

  // =========== RENDER ==============
  return (
    <>
      <main className="employees-page">
        {/* Encabezado */}
        <div className="encabezado">
          <h1>Nuestros Tatuadores</h1>
          <p>
            Conoce al equipo de artistas
            de Ink Creature
          </p>
          {esAdmin && (
            <button
              className="btn-agregar"
              onClick={abrirAgregar}
            >
              Agregar Tatuador
            </button>
          )}
        </div>

        {/* Catalogo */}
        <div className="catalogo">
          {listaTatuadores.map((t) => (
            <div
              className="tarjeta"
              key={t.id}
            >
              {/* Imagen */}
              <div className="tarjeta-foto">
                <img
                  src={t.foto}
                  alt={t.nombre}
                />
                <span className="badge">
                  {t.especialidad}
                </span>
              </div>
              {/* Información */}
              <div className="tarjeta-info">
                <h2>{t.nombre}</h2>
                <p className="cargo">
                  {t.cargo}
                </p>
                <p className="experiencia">
                  {t.experiencia}
                  {" "}años de experiencia
                </p>
                <div className="estrellas">
                  {obtenerEstrellas(t.estrellas)}
                </div>
              </div>
              {/* Footer */}
              <Link
                to="/Schedules"
                state={{
                  tatuadorSeleccionado: t.nombre
                }}
                className="btn-perfil"
              >
                Agendar Cita
              </Link>
              {esAdmin && (
                <div className="admin-btns">
                  <button
                    className="btn-editar"
                    onClick={() => abrirEditar(t)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminar(t.id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main >
      {/* ======== MODAL ======= */}
      {
        mostrarModal && (
          <>
            <div
              className="modal-overlay"
              onClick={cerrarModal}
            />
            <div className="modal">
              {/* Header */}
              <div className="modal-header">
                <h2>
                  {modoEdicion
                    ? "Editar Tatuador"
                    : "Agregar Tatuador"}
                </h2>
                <button
                  className="modal-close"
                  onClick={cerrarModal}
                >
                  X
                </button>
              </div>
              {/* Body */}
              <div className="modal-body">
                {fotoPreview && (
                  <div className="foto-preview">
                    <img
                      src={fotoPreview}
                      alt="preview"
                    />
                  </div>
                )}
                <label>
                  Foto del tatuador *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={cargarFoto}
                />
                <label>Nombre *</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nombre: e.target.value
                    })
                  }
                />
                <label>Cargo</label>
                <select
                  value={form.cargo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cargo: e.target.value
                    })
                  }
                >
                  <option value="Tatuador">
                    Tatuador
                  </option>

                  <option value="Tatuadora">
                    Tatuadora
                  </option>
                </select>
                <label>Especialidad *</label>
                <input
                  type="text"
                  placeholder="Ej: Anime"
                  value={form.especialidad}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      especialidad: e.target.value
                    })
                  }
                />
                <label>Años de experiencia</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.experiencia}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      experiencia: Number(e.target.value)
                    })
                  }
                />
                <label>Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Descripción..."
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descripcion: e.target.value
                    })
                  }
                />
                <label>Estrellas</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.estrellas}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estrellas: Number(e.target.value)
                    })
                  }
                />
                {/* Error */}
                {errorForm && (
                  <p className="error-msg">
                    {errorForm}
                  </p>
                )}
              </div>
              {/* Footer */}
              <div className="modal-footer">
                <button
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  className="btn-guardar"
                  onClick={guardar}
                >
                  {modoEdicion
                    ? "Guardar cambios"
                    : "Agregar"}
                </button>
              </div>
            </div>
          </>
        )
      }
    </>
  );
};