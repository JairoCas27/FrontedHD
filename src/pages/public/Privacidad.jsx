import Container from "react-bootstrap/Container";
import Hero from "../../components/Hero";
import urbanParkHero from "../../images/UrbanParkHero.jpg";

function Privacidad() {
  return (
    <>
      <Hero
        title="Política de Privacidad"
        subtitle="Tu información es gestionada de forma segura dentro del sistema UrbanPark."
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
            <strong>UrbanPark</strong> recopila, utiliza y protege la información
            proporcionada por los usuarios del sistema de gestión de estacionamientos
            para condominios.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Información que recopilamos
          </h3>
          <p>
            Podemos recopilar datos personales como nombres, DNI, correo electrónico,
            número de celular, placa de vehículo y datos necesarios para la gestión
            de accesos y reservas de estacionamiento.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Uso de la información
          </h3>
          <p>
            La información es utilizada exclusivamente para la administración del sistema,
            control de accesos, gestión de espacios de estacionamiento y comunicación
            relacionada al servicio dentro del condominio.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Cookies y almacenamiento local
          </h3>
          <p>
            UrbanPark puede utilizar cookies o almacenamiento local (LocalStorage)
            para mejorar la experiencia del usuario, mantener sesiones activas y
            optimizar el rendimiento del sistema.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Enlaces externos
          </h3>
          <p>
            El sistema puede contener enlaces a servicios externos. UrbanPark no
            se responsabiliza por las políticas de privacidad de dichos sitios.
          </p>

          <h3 className="mt-4" style={{ color: "#1e3a8a" }}>
            Protección de datos
          </h3>
          <p>
            UrbanPark implementa medidas de seguridad para proteger la información
            de los usuarios. No compartimos datos personales con terceros sin
            autorización, salvo requerimiento legal o necesidad operativa del sistema.
          </p>

          <p className="mt-4">
            Al utilizar UrbanPark, aceptas esta política de privacidad y el manejo
            responsable de tu información dentro del sistema.
          </p>
        </Container>
      </section>
    </>
  );
}

export default Privacidad;