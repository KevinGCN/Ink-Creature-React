import "../styles/workers.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Workers = () => {
  // ================= ESTADOS ==================
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");
  const esAdmin = true;

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
  const [tatuadores, setTatuadores] = useState([
    {
      id: 1,
      nombre: 'Emilia Soplano',
      cargo: 'Tatuador',
      especialidad: 'Estilo Anime',
      experiencia: 5,
      descripcion: 'Tatuadora especializada en anime y Dragon Ball: líneas que parecen Kamehamehas y color digno de una esfera del dragón.',
      foto: 'image/Emilia Soplano.jpg',
      estrellas: 5
    },
    {
      id: 2,
      nombre: 'Gabe Fernandez',
      cargo: 'Tatuador',
      especialidad: 'Realismo y Fantasía Oscura',
      experiencia: 4,
      descripcion: 'Tatuador especializado en estilo Souls: cinismo, armaduras rotas y fuegos fatuos con la misma elegancia oscura de morir una y otra vez.',
      foto: 'image/Gabe Fernandez.jpg',
      estrellas: 5
    },
    {
      id: 3,
      nombre: 'Juan David Vernadez',
      cargo: 'Tatuador',
      especialidad: 'Arte Fantástico y de videojuegos',
      experiencia: 4,
      descripcion: 'Soy bueno dandole caracteristicas unicas a los personajes.',
      foto: 'image/Juan David Vernadez.webp',
      estrellas: 4
    },
    {
      id: 4,
      nombre: 'Valentina Ríos',
      cargo: 'Tatuadora',
      especialidad: 'Minimalismo',
      experiencia: 3,
      descripcion: 'Tatuadora de mundos fantasticos: personajes memorables, magia arcana y KasuGOD > Basuro.',
      foto: 'image/Valentina Ríos.jpg',
      estrellas: 5
    },
    {
      id: 5,
      nombre: 'Sebastián Morales',
      cargo: 'Tatuador',
      especialidad: 'Chivi',
      experiencia: 6,
      descripcion: 'Soy experto en hacer arte lindo y adorable.',
      foto: 'image/Sebastián Morales.jpg',
      estrellas: 4
    },
    {
      id: 6,
      nombre: 'Leonardo Taza',
      cargo: 'Tatuador',
      especialidad: 'Warhammer 40k',
      experiencia: 3,
      descripcion: 'Quieres el tatuaje de una monja de batalla con lanzallamas? Pues si la respuesta es si, yo soy tu hombre.',
      foto: 'image/Leonardo Taza.png',
      estrellas: 5
    }
  ]);

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
    const nuevaLista = tatuadores.filter(
      (t) => t.id !== id
    );
    setTatuadores(nuevaLista);
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
      setTatuadores([
        ...tatuadores,
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
          {tatuadores.map((t) => (
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
              <div className="tarjeta-footer">
                <Link
                  to={`/employeeCV/${t.id}`}
                  className="btn-perfil"
                >
                  Ver perfil
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
            </div>
          ))}
        </div>
      </main>
      {/* ======== MODAL ======= */}
      {mostrarModal && (
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
      )}
    </>
  );
};