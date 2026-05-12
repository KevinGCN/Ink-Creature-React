import "../styles/schedules.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { tatuadores } from "../services/data";
import { useAuth } from "../services/auth";

export const Schedules = () => {
  const location = useLocation();
  const citaEditar = location.state?.citaEditar;
  const { usuario } = useAuth();
  /* ======FECHA ACTUAL======= */
  // Guarda la fecha actual del computador del usuario
  const fecha = new Date();

  /* ======ESTADOS======= */
  // Guarda el número del mes actual
  // Marzo = 2
  const [mesActual, setMesActual] = useState(
    fecha.getMonth()
  );

  // Guarda el año actual
  const [anioActual, setAnioActual] = useState(
    fecha.getFullYear()
  );

  // Guarda todos los días que tendrá el mes
  const [diasMes, setDiasMes] = useState<number[]>([]);

  // Guarda el día seleccionado por el usuario
  // Puede ser null si no se ha seleccionado nada
  const [fechaSeleccionada, setFechaSeleccionada] =
    useState<number | null>(null);

  // Guarda la hora seleccionada
  // Ejemplo: "8:00 AM"
  const [horaSeleccionada, setHoraSeleccionada] =
    useState("");

  // Guarda el nombre del tatuador seleccionado
  const [tatuadorSeleccionado, setTatuadorSeleccionado] =
    useState("");

  // Guarda todas las citas creadas
  // Cada cita contiene:
  // fecha, hora y tatuador
  const [citas, setCitas] = useState<any[]>(() => {
    const citasGuardadas =
      localStorage.getItem("citas");
    return citasGuardadas
      ? JSON.parse(citasGuardadas)
      : [];
  });

  // Indica si se está editando una cita
  // false = creando nueva cita
  // true = editando una existente
  const [modoEdicion] = useState(false);

  /* =======DATOS======= */

  // Lista de nombres de meses
  // Se usa para mostrar texto en el calendario
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  // Lista de años disponibles
  // para reservar citas
  const anios = [
    2026,
    2027,
    2028
  ];

  /* ======GENERAR CALENDARIO======= */

  // Esta función crea automáticamente
  // todos los días del mes seleccionado
  const generarCalendario = () => {
    // Obtiene cuántos días tiene el mes actual
    const totalDias = new Date(
      anioActual,
      mesActual + 1,
      0
    ).getDate();
    // Array Temporal para guardar los días
    const dias = [];
    // Recorre desde el día 1
    // hasta el último día del mes
    for (let i = 1; i <= totalDias; i++) {
      dias.push(i);
    }
    // Guarda todos los días en el estado
    setDiasMes(dias);
  };

  /* =========USE EFFECT========= */

  // Ejecuta generarCalendario()
  // automáticamente cada vez que:
  // - cambia el mes
  // - cambia el año
  useEffect(() => {
    generarCalendario();
  }, [mesActual, anioActual]);

  useEffect(() => {
    localStorage.setItem(
      "citas",
      JSON.stringify(citas)
    );
  }, [citas]);

  useEffect(() => {
    if (citaEditar) {
      setFechaSeleccionada(
        Number(citaEditar.fecha.split("/")[0].trim())
      );
      setHoraSeleccionada(
        citaEditar.hora
      );
      setTatuadorSeleccionado(
        citaEditar.tatuador
      );
    }

  }, [citaEditar]);

  /* ============VALIDAR FECHA PASADA============= */

  // Verifica si una fecha ya pasó
  // para evitar reservar citas antiguas
  const esFechaPasada = (dia: number) => {
    // Fecha actual real
    const hoy = new Date();
    // Fecha que el usuario quiere seleccionar
    const fechaEvaluar = new Date(
      anioActual,
      mesActual,
      dia
    );

    // Retorna true si la fecha ya pasó
    return fechaEvaluar < new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );
  };

  /* ==========SELECCIONAR FECHA=========== */
  // Guarda el día seleccionado
  const seleccionarFecha = (dia: number) => {
    setFechaSeleccionada(dia);
  };

  /* =======SELECCIONAR HORA============ */

  // Guarda la hora seleccionada
  const seleccionarHora = (hora: string) => {
    setHoraSeleccionada(hora);
  };

  /* ===========SELECCIONAR TATUADOR=============== */
  // Guarda el tatuador seleccionado
  const seleccionarTatuador = (nombre: string) => {
    setTatuadorSeleccionado(nombre);
  };

  /* ========RESERVAR========*/

  // Crea una nueva cita
  const reservar = () => {
    // Verifica que todos los datos estén completos
    if (
      !fechaSeleccionada ||
      !horaSeleccionada ||
      !tatuadorSeleccionado
    ) {
      alert("Completa todos los campos");
      return;
    }

    // Crea el objeto de la nueva cita
    const nuevaCita = {
      id: citaEditar
        ? citaEditar.id
        : Date.now(),
      usuario: usuario?.nombre || "Invitado",

      // Construye la fecha completa
      fecha:
        fechaSeleccionada + " / " + meses[mesActual] + " / " + anioActual,

      // Hora seleccionada
      hora: horaSeleccionada,

      // Tatuador seleccionado
      tatuador: tatuadorSeleccionado
    };

    // Agrega la nueva cita
    // sin borrar las anteriores
    if (citaEditar) {
      const citasActualizadas =
        citas.map((cita) =>
          cita.id === citaEditar.id
            ? nuevaCita
            : cita
        );
      setCitas(citasActualizadas);
      localStorage.setItem(
        "citas",
        JSON.stringify(citasActualizadas)
      );
      alert("Cita actualizada");
    } else {
      const nuevasCitas = [
        ...citas,
        nuevaCita
      ];
      setCitas(nuevasCitas);
      localStorage.setItem(
        "citas",
        JSON.stringify(nuevasCitas)
      );
      alert("Cita reservada");
    }

    // Mensaje de confirmación
    alert("Cita reservada");
  };

  return (
    <div className="container">
      {/* Título principal */}
      <h1>Agenda tu Cita</h1>
      <div className="content">
        {/* ======CALENDARIO=======*/}
        <div className="calendar">
          <div className="calendar-header">

            {/* Selector de mes */}
            <select
              value={mesActual}
              onChange={(e) =>
                setMesActual(
                  Number(e.target.value)
                )
              }
            >

              {/* Genera automáticamente todos los meses */}
              {meses.map((mes, i) => (
                <option
                  key={i}
                  value={i}
                >
                  {mes}
                </option>
              ))}
            </select>
            {/* Selector de año */}
            <select
              value={anioActual}
              onChange={(e) =>
                setAnioActual(
                  Number(e.target.value)
                )
              }
            >

              {/* Genera automáticamente los años */}
              {anios.map((anio) => (
                <option
                  key={anio}
                  value={anio}
                >
                  {anio}
                </option>
              ))}
            </select>
          </div>

          {/* Días de la semana */}
          <div className="days">
            <span>D</span>
            <span>L</span>
            <span>M</span>
            <span>Mi</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
          </div>

          {/* Fechas del calendario */}
          <div className="dates">
            {/* Recorre todos los días del mes */}
            {diasMes.map((dia) => (
              <span
                key={dia}
                // Permite seleccionar la fecha
                // solo si no es una fecha pasada
                onClick={() =>
                  !esFechaPasada(dia) &&
                  seleccionarFecha(dia)
                }
                // Agrega estilos dinámicos
                className={`
                  ${fechaSeleccionada === dia
                    ? "active"
                    : ""
                  }
                  ${esFechaPasada(dia)
                    ? "disabled"
                    : ""
                  }
                `}
              >
                {dia}
              </span>
            ))}
          </div>
        </div>

        {/* =====HORARIOS=====*/}
        <div className="hours">
          {/* Lista de horarios disponibles */}
          {[
            "8:00 AM",
            "8:30 AM",
            "9:00 AM",
            "9:30 AM",
            "10:00 AM",
            "2:00 PM",
            "2:30 PM",
            "3:00 PM"
          ].map((hora) => (
            <button
              key={hora}
              // Selecciona una hora
              onClick={() =>
                seleccionarHora(hora)
              }
              // Marca visualmente la hora elegida
              className={
                horaSeleccionada === hora
                  ? "selected"
                  : ""
              }
            >
              {hora}
            </button>
          ))}
        </div>

        {/* ============TATUADORES============= */}
        <div className="artists">
          {/* Recorre todos los tatuadores */}
          {tatuadores.map((tatuador) => (
            <div
              key={tatuador.id}
              // Agrega estilo al tatuador seleccionado
              className={`
                artist
                ${tatuadorSeleccionado === tatuador.nombre
                  ? "selected"
                  : ""
                }
              `}
              // Selecciona un tatuador
              onClick={() =>
                seleccionarTatuador(
                  tatuador.nombre
                )
              }
            >
              {/* Nombre del tatuador */}
              {tatuador.nombre}
            </div>
          ))}
        </div>
      </div>

      {/* ==========BOTONES========== */}
      <div className="actions">
        {/* Botón cancelar */}
        <button className="cancelar">
          Cancelar
        </button>
        {/* Botón reservar */}
        <button
          className="reserve"
          onClick={reservar}
        >
          {/* Cambia texto si se edita */}
          {modoEdicion
            ? "Actualizar Cita"
            : "Reservar"}
        </button>
      </div>
      <hr />

      {/* ===========CITAS======== */}
      <div>
        {/* Recorre todas las citas */}
        {
          citas
            .filter(
              (cita) =>
                cita.usuario === usuario?.nombre
            )
            .map((cita, index) => (
              <p key={index}>
                {/* Información de cada cita */}
                {cita.fecha}
                {" - "}
                {cita.hora}
                {" - "}
                {cita.tatuador}
              </p>
            ))
        }
      </div>
    </div>
  );
};