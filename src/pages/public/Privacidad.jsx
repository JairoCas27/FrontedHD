import Container from "react-bootstrap/Container";
import Hero from "../../components/Hero";
import urbanParkHero from "../../images/UrbanParkHero.jpg";

function Privacidad() {
  return (
    <>
      <Hero
        title="Política de Privacidad"
        description="Urbania protege la información de los usuarios mediante estándares de seguridad, cifrado y control de acceso en toda la plataforma."
        background={urbanParkHero}
        height="60vh"
        align="center"
        backgroundPosition="center top"
      />

      <section
        className="py-5"
        style={{
          backgroundColor: "#f4f6fb",
          color: "#1e1b4b"
        }}
      >
        <Container>
          <p>
            La presente Política de Privacidad describe cómo{" "}
            <strong>Urbania</strong> recopila, utiliza y protege la información de los usuarios dentro del sistema de gestión de condominios.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Información que recopilamos
          </h3>
          <p>
            Urbania puede recopilar datos personales como nombres, documentos de identidad, correo electrónico, número de contacto,
            placas de vehículos y registros de acceso necesarios para la administración del condominio.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Uso de la información
          </h3>
          <p>
            Los datos se utilizan exclusivamente para la gestión operativa del sistema, incluyendo control de accesos,
            administración de residentes, vehículos, estacionamientos y servicios internos del condominio.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Almacenamiento y sesiones
          </h3>
          <p>
            Urbania puede utilizar almacenamiento local y cookies para mantener sesiones activas, mejorar la experiencia del usuario
            y optimizar el rendimiento de la plataforma.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Enlaces externos
          </h3>
          <p>
            El sistema puede incluir enlaces a servicios externos. Urbania no se responsabiliza por las políticas de privacidad
            de plataformas de terceros.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Protección de datos
          </h3>
          <p>
            Urbania implementa medidas de seguridad como autenticación, control de roles y cifrado para proteger la información.
            No se comparten datos personales con terceros, salvo requerimiento legal o necesidad operativa del sistema.
          </p>

          <p className="mt-4">
            Al utilizar Urbania, el usuario acepta esta Política de Privacidad y el tratamiento responsable de su información dentro del sistema.
          </p>
        </Container>
      </section>
    </>
  )
}

export default Privacidad