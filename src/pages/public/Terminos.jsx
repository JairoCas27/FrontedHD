import Hero from "../../components/Hero";
import { Container } from "react-bootstrap";
import fondoParking from "../../images/FondoParking.png";

function Terminos() {
  return (
    <>
      <Hero
        title="Términos y Condiciones"
        subtitle="Transparencia y seguridad en la gestión de estacionamientos"
        description="Al utilizar URBANK PARK aceptas nuestras políticas de uso, seguridad y gestión de datos dentro de la plataforma SaaS."
        background={fondoParking}
        height="60vh"
        align="center"
        backgroundPosition="center top"
      />

      <section
        className="py-5 text-start"
        style={{
          backgroundColor: "#f5f7f9",
          color: "#1f2937"
        }}
      >
        <Container>
          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            1. Generalidades
          </h4>
          <p>
            <strong>URBANK PARK</strong> es una plataforma SaaS de gestión de estacionamientos para condominios,
            administrada por distintos tipos de usuarios (Super Admin, Administradores de condominio, Seguridad y Propietarios de vehículos).
            Al acceder o utilizar el sistema, aceptas estos términos.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            2. Uso de la Plataforma
          </h4>
          <p>
            El uso de URBANK PARK está restringido a usuarios autorizados. Cada usuario debe acceder únicamente
            con sus credenciales asignadas. Está prohibido compartir cuentas, manipular registros o interferir
            con el funcionamiento del sistema.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            3. Roles del Sistema
          </h4>
          <p>
            La plataforma opera bajo roles definidos:
            Super Admin (gestión global del sistema),
            Administrador de condominio (gestión del estacionamiento),
            Seguridad (control de accesos),
            Propietario de vehículo (uso del servicio).
            Cada rol tiene permisos específicos.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            4. Seguridad y Datos
          </h4>
          <p>
            URBANK PARK puede almacenar información como placas vehiculares, accesos, horarios y registros de entrada/salida.
            Nos comprometemos a proteger esta información, aunque el usuario acepta que ningún sistema es 100% infalible.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            5. Disponibilidad del Servicio
          </h4>
          <p>
            El servicio puede estar sujeto a mantenimiento, actualizaciones o fallos técnicos.
            No garantizamos disponibilidad ininterrumpida, aunque trabajamos para minimizar interrupciones.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            6. Responsabilidad
          </h4>
          <p>
            URBANK PARK no se responsabiliza por el mal uso del sistema por parte de los usuarios,
            ni por daños derivados de información incorrecta ingresada en la plataforma.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            7. Modificaciones
          </h4>
          <p>
            Nos reservamos el derecho de actualizar estos términos en cualquier momento.
            Los cambios serán notificados dentro de la plataforma o vía canales oficiales del sistema.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            8. Contacto
          </h4>
          <p>
            Para cualquier consulta relacionada con estos términos, puedes comunicarte con el administrador del sistema
            o con el soporte técnico de <strong>URBANK PARK</strong>.
          </p>
        </Container>
      </section>
    </>
  );
}

export default Terminos;