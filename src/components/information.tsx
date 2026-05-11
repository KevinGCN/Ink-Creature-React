import "../styles/Information.css";

export const Information = () => {

  return (

    <main className="info-content">

      {/* =========================
          BANNER PRINCIPAL
      ========================= */}

      <section className="banner">

        <h1>Ink Creature</h1>

        <div className="imgback"></div>

      </section>


      {/* =========================
          INFORMACIÓN
      ========================= */}

      <section className="information">

        <h2>Información</h2>

        <h3>
          Estudio de Tatuajes & Arte Corporal
        </h3>

        <p>
          Ink Creature es un estudio de tatuajes
          <strong> imaginario </strong>
          funcionando en 2026 con un equipo
          directivo de 3 personas y un equipo
          de trabajo <strong> ficticio </strong>
          conformado por tatuadores,
          diseñadores y personal administrativo.
        </p>


        {/* Directivos */}

        <div className="directivos">

          <h3>Directivos:</h3>

          <ul>

            <li>
              Kevin Giancarlo Cobo Narvaéz
            </li>

            <li>
              Emerson Duvan Mosquera Ortega
            </li>

            <li>
              Juan Andres Patiño Castillo
            </li>

          </ul>

        </div>


        {/* Lema */}

        <div className="lema">

          <h3>Nuestro Lema:</h3>

          <p>
            "Tu templo es nuestro lienzo
            donde la tinta se cobra vida".
          </p>

          <p>
            El concepto del estudio es que
            cada pieza sea única y tenga
            una historia detrás.
          </p>

        </div>

      </section>


      {/* =========================
          CONTACTO
      ========================= */}

      <section className="contacto">

        {/* Instagram */}

        <a
          href="https://www.instagram.com/emersonmo.3?igsh=YjA3OXBob2ppYzd1"
          target="_blank"
          rel="noreferrer"
          className="contact-card"
        >
          <img
            src="/image/instagram.png"
            alt="Instagram"
          />
        </a>


        {/* WhatsApp */}

        <a
          href="https://wa.me/573113884278"
          target="_blank"
          rel="noreferrer"
          className="contact-card"
        >
          <img
            src="/image/whatsapp.webp"
            alt="WhatsApp"
          />
        </a>


        {/* Ubicación */}

        <a
          href="https://maps.app.goo.gl/dMdXs4T1nfcDEc2BA"
          target="_blank"
          rel="noreferrer"
          className="contact-card"
        >
          <img
            src="/image/ubicacion.png"
            alt="Ubicación"
          />
        </a>

      </section>

    </main>

  );
};