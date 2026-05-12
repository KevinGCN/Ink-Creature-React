// ─────────────────────────────────────────────────────────────
// Importaciones:
// - useState: maneja el estado local (reseñas, texto, estrellas, modo edición)
// - useEffect: sincroniza las reseñas con localStorage cada vez que cambian
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "../services/auth"; // Hook para acceder al usuario y saber si está logueado
import "../styles/lobby.css";

// ─────────────────────────────────────────────────────────────
// Interfaz que define la estructura de cada reseña:
// - id: identificador único (timestamp como string)
// - uid: ID del usuario que la escribió (para saber a quién pertenece)
// - autor: nombre visible del usuario
// - texto: contenido de la reseña
// - estrellas: puntuación del 1 al 5
// - fecha: fecha de publicación formateada en español
// ─────────────────────────────────────────────────────────────
interface Resena {
  id: string;
  uid: string;
  autor: string;
  texto: string;
  estrellas: number;
  fecha: string;
}

export const Lobby = () => {
  // Obtiene el usuario actual y si hay sesión activa desde el contexto de autenticación
  const { usuario, isLoggedIn } = useAuth();

  // ── Lista de reseñas.
  //    Se inicializa leyendo desde localStorage para persistir entre recargas.
  //    Si no hay nada guardado, empieza con un array vacío.
  const [resenas, setResenas] = useState<Resena[]>(() => {
    const guardadas = localStorage.getItem("resenas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  // ── Texto que el usuario está escribiendo en el formulario de nueva reseña
  const [texto, setTexto] = useState("");

  // ── Puntuación seleccionada para una nueva reseña (por defecto 5 estrellas)
  const [estrellas, setEstrellas] = useState(5);

  // ── ID de la reseña que está siendo editada actualmente.
  //    null significa que no hay ninguna en modo edición.
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // ── Texto temporal mientras se edita una reseña existente
  const [textoEdicion, setTextoEdicion] = useState("");

  // ── Estrellas temporales mientras se edita una reseña existente
  const [estrellasEdicion, setEstrellasEdicion] = useState(5);

  // ── Mensaje de error que se muestra si el usuario intenta publicar sin texto
  const [error, setError] = useState("");

  // ── Cada vez que el array de reseñas cambia, lo guarda en localStorage.
  //    Así las reseñas sobreviven a recargas de página.
  useEffect(() => {
    localStorage.setItem("resenas", JSON.stringify(resenas));
  }, [resenas]);

  // ─────────────────────────────────────────────────────────────
  // AGREGAR RESEÑA
  // Valida que haya texto, construye el objeto Resena y lo antepone
  // al array (las más nuevas aparecen primero). Luego limpia el formulario.
  // ─────────────────────────────────────────────────────────────
  const agregarResena = () => {
    setError("");
    if (!texto.trim()) return setError("Escribe algo antes de publicar.");

    const nueva: Resena = {
      id: Date.now().toString(),       // ID único basado en el timestamp actual
      uid: usuario!.uid!,              // UID del usuario logueado
      autor: usuario!.nombre || "Anónimo",
      texto: texto.trim(),
      estrellas,
      fecha: new Date().toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    setResenas((prev) => [nueva, ...prev]); // Agrega al inicio del array
    setTexto("");       // Limpia el campo de texto
    setEstrellas(5);    // Resetea la puntuación a 5
  };

  // ─────────────────────────────────────────────────────────────
  // ELIMINAR RESEÑA
  // Filtra el array eliminando la reseña con el id indicado.
  // Solo aparece el botón para reseñas propias del usuario.
  // ─────────────────────────────────────────────────────────────
  const eliminarResena = (id: string) => {
    setResenas((prev) => prev.filter((r) => r.id !== id));
  };

  // ─────────────────────────────────────────────────────────────
  // INICIAR EDICIÓN
  // Guarda el id de la reseña a editar y carga sus datos actuales
  // en los estados temporales de edición.
  // ─────────────────────────────────────────────────────────────
  const iniciarEdicion = (r: Resena) => {
    setEditandoId(r.id);
    setTextoEdicion(r.texto);
    setEstrellasEdicion(r.estrellas);
  };

  // ─────────────────────────────────────────────────────────────
  // GUARDAR EDICIÓN
  // Recorre el array y reemplaza la reseña editada con los nuevos
  // valores. Cierra el modo edición al terminar.
  // ─────────────────────────────────────────────────────────────
  const guardarEdicion = () => {
    if (!textoEdicion.trim()) return;
    setResenas((prev) =>
      prev.map((r) =>
        r.id === editandoId
          ? { ...r, texto: textoEdicion.trim(), estrellas: estrellasEdicion }
          : r
      )
    );
    setEditandoId(null); // Sale del modo edición
  };

  // ── Cancela la edición sin guardar cambios
  const cancelarEdicion = () => setEditandoId(null);

  // ── Compara el uid de la reseña con el del usuario actual.
  //    Retorna true si la reseña pertenece a quien está logueado.
  const esPropia = (r: Resena) => usuario?.uid === r.uid;

  // ─────────────────────────────────────────────────────────────
  // RENDERIZAR ESTRELLAS
  // Función reutilizable que dibuja 5 estrellas.
  // - valor: cuántas están activas (amarillas)
  // - onChange: callback para actualizar la puntuación al hacer click
  // - interactivo: si es true, el cursor cambia y las estrellas son clicables
  // Se usa tanto en el formulario (interactivo) como en las tarjetas (solo lectura).
  // ─────────────────────────────────────────────────────────────
  const renderEstrellas = (
    valor: number,
    onChange?: (n: number) => void,
    interactivo = false
  ) => (
    <div className="lobby-estrellas">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`lobby-estrella ${n <= valor ? "activa" : ""} ${interactivo ? "interactiva" : ""}`}
          onClick={() => interactivo && onChange?.(n)} // Solo llama onChange si es interactivo
        >
          ★
        </span>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="lobby-page">

      {/* ── Sección hero: presentación visual del estudio ── */}
      <section className="lobby-hero">
        <h1 className="lobby-titulo">Ink Creature</h1>
        <p className="lobby-subtitulo">
          Arte en tu piel, hecho con pasión y precisión.
        </p>
      </section>

      {/* ── Sección principal de reseñas ── */}
      <section className="lobby-resenas-section">
        <h2 className="lobby-resenas-titulo">Reseñas de clientes</h2>

        {/* Formulario de nueva reseña: solo visible si el usuario tiene sesión activa.
            Si no está logueado, muestra un aviso invitándolo a iniciar sesión. */}
        {isLoggedIn ? (
          <div className="lobby-form">
            {/* Saludo personalizado con el nombre del usuario logueado */}
            <p className="lobby-form-saludo">
              Hola, <strong>{usuario?.nombre}</strong> — comparte tu experiencia
            </p>

            {/* Campo de texto para escribir la reseña */}
            <textarea
              className="lobby-textarea"
              placeholder="¿Cómo fue tu experiencia con nosotros?"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
            />

            {/* Fila inferior del formulario: estrellas interactivas + botón publicar */}
            <div className="lobby-form-fila">
              {renderEstrellas(estrellas, setEstrellas, true)}
              <button className="lobby-btn-publicar" onClick={agregarResena}>
                Publicar reseña
              </button>
            </div>

            {/* Mensaje de error si se intenta publicar sin texto */}
            {error && <p className="lobby-error">{error}</p>}
          </div>
        ) : (
          /* Aviso para usuarios no autenticados */
          <div className="lobby-aviso-login">
            <span>🔒</span>
            <p>Inicia sesión para dejar una reseña.</p>
          </div>
        )}

        {/* ── Lista de reseñas ──
            Si no hay ninguna, muestra un mensaje vacío.
            Si hay, recorre el array y renderiza cada tarjeta. */}
        <div className="lobby-resenas-lista">
          {resenas.length === 0 ? (
            <p className="lobby-sin-resenas">
              Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
            </p>
          ) : (
            resenas.map((r) => (
              <div key={r.id} className="lobby-resena-card">

                {/* Si esta tarjeta está en modo edición, muestra el formulario
                    de edición en lugar del contenido normal. */}
                {editandoId === r.id ? (
                  <div className="lobby-edicion">
                    {/* Campo para modificar el texto de la reseña */}
                    <textarea
                      className="lobby-textarea"
                      value={textoEdicion}
                      onChange={(e) => setTextoEdicion(e.target.value)}
                      rows={3}
                    />
                    <div className="lobby-form-fila">
                      {/* Estrellas interactivas para cambiar la puntuación */}
                      {renderEstrellas(estrellasEdicion, setEstrellasEdicion, true)}
                      <div className="lobby-edicion-btns">
                        <button className="lobby-btn-guardar" onClick={guardarEdicion}>
                          Guardar
                        </button>
                        <button className="lobby-btn-cancelar" onClick={cancelarEdicion}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Vista normal de la tarjeta (no en edición) */
                  <>
                    {/* Cabecera: avatar, nombre, fecha y botones de acción */}
                    <div className="lobby-resena-header">

                      {/* Avatar generado con la primera letra del nombre del autor */}
                      <div className="lobby-resena-avatar">
                        {r.autor.charAt(0).toUpperCase()}
                      </div>

                      {/* Nombre y fecha de publicación */}
                      <div className="lobby-resena-meta">
                        <span className="lobby-resena-autor">{r.autor}</span>
                        <span className="lobby-resena-fecha">{r.fecha}</span>
                      </div>

                      {/* Botones editar/eliminar: solo aparecen si el usuario
                          está logueado Y la reseña le pertenece (mismo uid) */}
                      {isLoggedIn && esPropia(r) && (
                        <div className="lobby-resena-acciones">
                          <button
                            className="lobby-btn-editar"
                            onClick={() => iniciarEdicion(r)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="lobby-btn-eliminar"
                            onClick={() => eliminarResena(r.id)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Estrellas en modo solo lectura (no interactivo) */}
                    {renderEstrellas(r.estrellas)}

                    {/* Contenido de la reseña */}
                    <p className="lobby-resena-texto">{r.texto}</p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};