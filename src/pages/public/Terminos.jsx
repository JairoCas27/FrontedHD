import Hero from "../../components/Hero";
import { Container } from "react-bootstrap";
import fondoParking from "../../images/FondoParking.png";

function Terminos() {
  return (
    <>
      <Hero
        title="Términos y Condiciones"
        description="Condiciones de uso de la plataforma Urbania y políticas de servicio para la gestión de condominios."
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
            <strong>URBANIA</strong> es una plataforma SaaS para la gestión de condominios que permite administrar residentes,
            accesos, vehículos, estacionamientos y servicios internos. Al acceder o utilizar el sistema, el usuario acepta estos términos.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            2. Uso de la Plataforma
          </h4>
          <p>
            El uso de Urbania está restringido a usuarios autorizados según su rol dentro de cada condominio.
            Cada usuario debe acceder con credenciales personales, siendo responsable del uso de su cuenta.
            Se prohíbe compartir accesos, manipular datos o afectar el funcionamiento del sistema.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            3. Roles del Sistema
          </h4>
          <p>
            La plataforma opera bajo roles definidos como Super Administrador, Administrador de Condominio, Seguridad y Residente.
            Cada rol cuenta con permisos específicos para garantizar el control y la seguridad de la información.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            4. Seguridad y Datos
          </h4>
          <p>
            Urbania almacena información operativa como registros de acceso, vehículos, horarios y actividad de usuarios.
            Se aplican medidas de seguridad para proteger los datos, aunque el usuario reconoce que ningún sistema digital es totalmente infalible.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            5. Disponibilidad del Servicio
          </h4>
          <p>
            El sistema puede estar sujeto a mantenimiento, actualizaciones o interrupciones técnicas.
            Se trabaja continuamente para garantizar la mayor disponibilidad posible del servicio.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            6. Responsabilidad
          </h4>
          <p>
            Urbania no se hace responsable por el uso indebido de la plataforma ni por información incorrecta ingresada por los usuarios.
            Cada usuario es responsable del uso adecuado del sistema dentro de su rol asignado.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            7. Modificaciones
          </h4>
          <p>
            Urbania se reserva el derecho de modificar estos términos en cualquier momento.
            Las actualizaciones serán comunicadas dentro de la plataforma o por canales oficiales.
          </p>

          <h4 className="mt-4" style={{ color: "#1e3a8a" }}>
            8. Contacto
          </h4>
          <p>
            Para consultas relacionadas con estos términos, el usuario puede comunicarse con el administrador del sistema o soporte técnico de Urbania.
          </p>
        </Container>
      </section>
    </>
  )
}

export default Terminos