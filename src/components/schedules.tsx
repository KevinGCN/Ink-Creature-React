import "../styles/schedules.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { tatuadores } from "../services/data";
import { useAuth } from "../services/auth";

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  tatuador: string;
  usuario: string;
}

export const Schedules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const citaEditar = location.state?.citaEditar;
  const { usuario } = useAuth();

  const fecha = new Date();
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const anios = [2026, 2027, 2028];

  /* ======ESTADOS======= */
  const [mesActual, setMesActual] = useState(fecha.getMonth());
  const [anioActual, setAnioActual] = useState(fecha.getFullYear());
  const [diasMes, setDiasMes] = useState<number[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [tatuadorSeleccionado, setTatuadorSeleccionado] = useState("");
  const [citas, setCitas] = useState<Cita[]>(() => {
    const citasGuardadas = localStorage.getItem("citas");
    return citasGuardadas ? JSON.parse(citasGuardadas) : [];
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Drag & Drop state
  const [draggedCita, setDraggedCita] = useState<Cita | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const dragCounter = useRef(0);

  /* =======CALENDARIO======= */
  const generarCalendario = () => {
    const totalDias = new Date(anioActual, mesActual + 1, 0).getDate();
    const dias: number[] = [];
    for (let i = 1; i <= totalDias; i++) {
      dias.push(i);
    }
    setDiasMes(dias);
  };

  useEffect(() => {
    generarCalendario();
  }, [mesActual, anioActual]);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    if (citaEditar) {
      setFechaSeleccionada(Number(citaEditar.fecha.split("/")[0].trim()));
      setHoraSeleccionada(citaEditar.hora);
      setTatuadorSeleccionado(citaEditar.tatuador);
    }
  }, [citaEditar]);

  /* ============VALIDAR FECHA PASADA============= */
  const esFechaPasada = (dia: number) => {
    const hoy = new Date();
    const fechaEvaluar = new Date(anioActual, mesActual, dia);
    return fechaEvaluar < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  };

  /* ==========SELECCIONAR=========== */
  const seleccionarFecha = (dia: number) => setFechaSeleccionada(dia);
  const seleccionarHora = (hora: string) => setHoraSeleccionada(hora);
  const seleccionarTatuador = (nombre: string) => setTatuadorSeleccionado(nombre);

  /* ========RESERVAR========*/
  const reservar = () => {
    if (!fechaSeleccionada || !horaSeleccionada || !tatuadorSeleccionado) {
      alert("Completa todos los campos");
      return;
    }

    const nuevaCita: Cita = {
      id: citaEditar ? citaEditar.id : Date.now(),
      usuario: usuario?.nombre || "Invitado",
      fecha: `${fechaSeleccionada} / ${meses[mesActual]} / ${anioActual}`,
      hora: horaSeleccionada,
      tatuador: tatuadorSeleccionado,
    };

    if (citaEditar) {
      const citasActualizadas = citas.map((c) =>
        c.id === citaEditar.id ? nuevaCita : c
      );
      setCitas(citasActualizadas);
      alert("Cita actualizada");
    } else {
      setCitas((prev) => [...prev, nuevaCita]);
      alert("Cita reservada");
    }

    // Resetear formulario
    setFechaSeleccionada(null);
    setHoraSeleccionada("");
    setTatuadorSeleccionado("");
    setMostrarFormulario(false);
    navigate("/schedules", { replace: true });
  };

  /* ========ELIMINAR CITA========*/
  const eliminarCita = (citaId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta cita?")) return;
    const nuevasCitas = citas.filter((c) => c.id !== citaId);
    setCitas(nuevasCitas);
  };

  /* ========DRAG & DROP========*/
  const handleDragStart = (e: React.DragEvent, cita: Cita) => {
    setDraggedCita(cita);
    e.dataTransfer.effectAllowed = "move";
    // Hacer el elemento original semi-transparente
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedCita(null);
    setDragOverCol(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragEnter = (e: React.DragEvent, tatuadorNombre: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverCol(tatuadorNombre);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverCol(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, tatuadorNombre: string) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragOverCol(null);

      if (!draggedCita) return;

      // Si se soltó en la misma columna, no hacer nada
      if (draggedCita.tatuador === tatuadorNombre) return;

      setCitas((prev) =>
        prev.map((c) =>
          c.id === draggedCita.id
            ? { ...c, tatuador: tatuadorNombre }
            : c
        )
      );
    },
    [draggedCita]
  );

  /* ========FILTRAR CITAS POR TATUADOR========*/
  const getCitasByTatuador = (nombreTatuador: string) => {
    return citas.filter((c) => c.tatuador === nombreTatuador);
  };

  /* ========FORMATEAR FECHA PARA MOSTRAR========*/
  const formatearFecha = (fechaStr: string) => {
    // "12 / Mayo / 2026" -> "12 May 2026"
    const partes = fechaStr.split("/").map((p) => p.trim());
    if (partes.length === 3) {
      return `${partes[0]} ${partes[1].substring(0, 3)} ${partes[2]}`;
    }
    return fechaStr;
  };

  /* ========RENDER========*/
  return (
    <div className="kanban-container">
      {/* HEADER */}
      <header className="kanban-header">
        <h1>🎨 Kanban de Citas — Ink Creature</h1>
        <p className="kanban-subtitle">
          Arrastra y suelta citas entre tatuadores para reasignarlas
        </p>
      </header>

      {/* BOTÓN NUEVA CITA */}
      <div className="new-cita-bar">
        <button
          className="btn-nueva-cita"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            if (citaEditar) {
              navigate("/schedules", { replace: true });
              setFechaSeleccionada(null);
              setHoraSeleccionada("");
              setTatuadorSeleccionado("");
            }
          }}
        >
          {mostrarFormulario ? "✕ Cerrar formulario" : "＋ Nueva Cita"}
        </button>

        <div className="user-greeting">
          {usuario?.nombre
            ? `Hola, ${usuario.nombre}`
            : "Hola, Invitado"}
        </div>
      </div>

      {/* FORMULARIO NUEVA CITA */}
      {mostrarFormulario && (
        <section className="form-section">
          <div className="form-card">
            <h2>{citaEditar ? "✏️ Editar Cita" : "📅 Nueva Cita"}</h2>

            {/* Calendario mini */}
            <div className="mini-calendar">
              <div className="calendar-header">
                <select
                  value={mesActual}
                  onChange={(e) => setMesActual(Number(e.target.value))}
                >
                  {meses.map((mes, i) => (
                    <option key={i} value={i}>
                      {mes}
                    </option>
                  ))}
                </select>
                <select
                  value={anioActual}
                  onChange={(e) => setAnioActual(Number(e.target.value))}
                >
                  {anios.map((anio) => (
                    <option key={anio} value={anio}>
                      {anio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="days">
                <span>D</span><span>L</span><span>M</span>
                <span>Mi</span><span>J</span><span>V</span><span>S</span>
              </div>

              <div className="dates">
                {diasMes.map((dia) => (
                  <span
                    key={dia}
                    onClick={() => !esFechaPasada(dia) && seleccionarFecha(dia)}
                    className={`
                      ${fechaSeleccionada === dia ? "active" : ""}
                      ${esFechaPasada(dia) ? "disabled" : ""}
                    `}
                  >
                    {dia}
                  </span>
                ))}
              </div>
            </div>

            {/* Horarios */}
            <div className="hours-picker">
              <label className="section-label">Horario</label>
              <div className="hours-grid">
                {[
                  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
                  "10:00 AM", "2:00 PM", "2:30 PM", "3:00 PM",
                ].map((hora) => (
                  <button
                    key={hora}
                    onClick={() => seleccionarHora(hora)}
                    className={`hour-btn ${horaSeleccionada === hora ? "selected" : ""}`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>

            {/* Tatuadores */}
            <div className="artists-picker">
              <label className="section-label">Tatuador</label>
              <div className="artists-grid">
                {tatuadores.map((tatuador) => (
                  <div
                    key={tatuador.id}
                    onClick={() => seleccionarTatuador(tatuador.nombre)}
                    className={`artist-card ${tatuadorSeleccionado === tatuador.nombre ? "selected" : ""}`}
                  >
                    <div className="artist-avatar">
                      {tatuador.nombre.charAt(0)}
                    </div>
                    <span className="artist-name">{tatuador.nombre}</span>
                    <span className="artist-specialty">{tatuador.especialidad}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarFormulario(false);
                  setFechaSeleccionada(null);
                  setHoraSeleccionada("");
                  setTatuadorSeleccionado("");
                }}
              >
                Cancelar
              </button>
              <button className="btn-reservar" onClick={reservar}>
                {citaEditar ? "Actualizar Cita" : "Reservar Cita"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* KANBAN BOARD */}
      <div className="kanban-board">
        {tatuadores.map((tatuador) => {
          const citasTatuador = getCitasByTatuador(tatuador.nombre);
          const isDragOver = dragOverCol === tatuador.nombre;

          return (
            <div
              key={tatuador.id}
              className={`kanban-column ${isDragOver ? "drag-over" : ""}`}
              onDragEnter={(e) => handleDragEnter(e, tatuador.nombre)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tatuador.nombre)}
              ref={(el) => {
                // Cleanup drag counter on unmount
                if (!el) dragCounter.current = 0;
              }}
            >
              {/* Column Header */}
              <div className="column-header">
                <div className="column-avatar">
                  {tatuador.nombre.charAt(0)}
                </div>
                <div className="column-info">
                  <h3>{tatuador.nombre}</h3>
                  <span className="column-count">
                    {citasTatuador.length} cit{citasTatuador.length === 1 ? "a" : "as"}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="column-cards">
                {citasTatuador.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <p>Sin citas asignadas</p>
                  </div>
                ) : (
                  citasTatuador.map((cita) => (
                    <div
                      key={cita.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cita)}
                      onDragEnd={handleDragEnd}
                      className="cita-card"
                    >
                      <div className="card-header">
                        <span className="card-usuario">👤 {cita.usuario}</span>
                        <button
                          className="card-delete"
                          onClick={() => eliminarCita(cita.id)}
                          title="Eliminar cita"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="card-body">
                        <div className="card-detail">
                          <span className="detail-icon">📅</span>
                          <span>{formatearFecha(cita.fecha)}</span>
                        </div>
                        <div className="card-detail">
                          <span className="detail-icon">⏰</span>
                          <span>{cita.hora}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <footer className="kanban-footer">
        <p>💡 Arrastra una tarjeta a otra columna para reasignar la cita a otro tatuador</p>
      </footer>
    </div>
  );
};