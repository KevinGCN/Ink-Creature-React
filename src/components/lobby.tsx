import { useState, useEffect } from "react";
import { useAuth } from "../services/auth";
import "../styles/lobby.css";

interface Resena {
  id: string;
  uid: string;
  autor: string;
  texto: string;
  estrellas: number;
  fecha: string;
}

export const Lobby = () => {
  const { usuario, isLoggedIn } = useAuth();

  const [resenas, setResenas] = useState<Resena[]>(() => {
    const guardadas = localStorage.getItem("resenas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [texto, setTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [estrellasEdicion, setEstrellasEdicion] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("resenas", JSON.stringify(resenas));
  }, [resenas]);

  const agregarResena = () => {
    setError("");
    if (!texto.trim()) return setError("Escribe algo antes de publicar.");

    const nueva: Resena = {
      id: Date.now().toString(),
      uid: usuario!.uid!,
      autor: usuario!.nombre || "Anónimo",
      texto: texto.trim(),
      estrellas,
      fecha: new Date().toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    setResenas((prev) => [nueva, ...prev]);
    setTexto("");
    setEstrellas(5);
  };

  const eliminarResena = (id: string) => {
    setResenas((prev) => prev.filter((r) => r.id !== id));
  };

  const iniciarEdicion = (r: Resena) => {
    setEditandoId(r.id);
    setTextoEdicion(r.texto);
    setEstrellasEdicion(r.estrellas);
  };

  const guardarEdicion = () => {
    if (!textoEdicion.trim()) return;
    setResenas((prev) =>
      prev.map((r) =>
        r.id === editandoId
          ? { ...r, texto: textoEdicion.trim(), estrellas: estrellasEdicion }
          : r
      )
    );
    setEditandoId(null);
  };

  const cancelarEdicion = () => setEditandoId(null);

  const esPropia = (r: Resena) => usuario?.uid === r.uid;

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
          onClick={() => interactivo && onChange?.(n)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="lobby-page">
      {/* Hero */}
      <section className="lobby-hero">
        <h1 className="lobby-titulo">Ink Creature</h1>
        <p className="lobby-subtitulo">
          Arte en tu piel, hecho con pasión y precisión.
        </p>
      </section>

      {/* Sección de reseñas */}
      <section className="lobby-resenas-section">
        <h2 className="lobby-resenas-titulo">Reseñas de clientes</h2>

        {/* Formulario — solo si está logueado */}
        {isLoggedIn ? (
          <div className="lobby-form">
            <p className="lobby-form-saludo">
              Hola, <strong>{usuario?.nombre}</strong> — comparte tu experiencia
            </p>
            <textarea
              className="lobby-textarea"
              placeholder="¿Cómo fue tu experiencia con nosotros?"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={3}
            />
            <div className="lobby-form-fila">
              {renderEstrellas(estrellas, setEstrellas, true)}
              <button className="lobby-btn-publicar" onClick={agregarResena}>
                Publicar reseña
              </button>
            </div>
            {error && <p className="lobby-error">{error}</p>}
          </div>
        ) : (
          <div className="lobby-aviso-login">
            <span>🔒</span>
            <p>Inicia sesión para dejar una reseña.</p>
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="lobby-resenas-lista">
          {resenas.length === 0 ? (
            <p className="lobby-sin-resenas">
              Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
            </p>
          ) : (
            resenas.map((r) => (
              <div key={r.id} className="lobby-resena-card">
                {editandoId === r.id ? (
                  /* Modo edición */
                  <div className="lobby-edicion">
                    <textarea
                      className="lobby-textarea"
                      value={textoEdicion}
                      onChange={(e) => setTextoEdicion(e.target.value)}
                      rows={3}
                    />
                    <div className="lobby-form-fila">
                      {renderEstrellas(
                        estrellasEdicion,
                        setEstrellasEdicion,
                        true
                      )}
                      <div className="lobby-edicion-btns">
                        <button
                          className="lobby-btn-guardar"
                          onClick={guardarEdicion}
                        >
                          Guardar
                        </button>
                        <button
                          className="lobby-btn-cancelar"
                          onClick={cancelarEdicion}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Vista normal */
                  <>
                    <div className="lobby-resena-header">
                      <div className="lobby-resena-avatar">
                        {r.autor.charAt(0).toUpperCase()}
                      </div>
                      <div className="lobby-resena-meta">
                        <span className="lobby-resena-autor">{r.autor}</span>
                        <span className="lobby-resena-fecha">{r.fecha}</span>
                      </div>
                      {/* Botones solo si la reseña es propia y el usuario está logueado */}
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
                    {renderEstrellas(r.estrellas)}
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
