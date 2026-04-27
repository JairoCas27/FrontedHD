import { useEffect } from "react"
import Hero from "../../components/Hero"
import CardDescrip from "../../components/CardDescrip"
import ListaConImagen from "../../components/ListaConImagen"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

import parkingHero from "../../images/parking-hero.jpg"
import accessImg from "../../images/access.jpg"
import residentesImg from "../../images/residentes.jpg"
import monitorImg from "../../images/monitor.jpg"
import dashboardImg from "../../images/dashboard.jpg"

function Servicios() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active")
          else entry.target.classList.remove("active")
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const servicios = [
    {
      titulo: "Control de Accesos Vehiculares",
      descripcion: "Ingreso automatizado mediante QR o lectura de placas.",
      imagen: accessImg
    },
    {
      titulo: "Gestión de Vehículos Autorizados",
      descripcion: "Registro y control de residentes y visitantes en tiempo real.",
      imagen: residentesImg
    },
    {
      titulo: "Monitoreo en Tiempo Real",
      descripcion: "Visualización de ocupación y disponibilidad de espacios.",
      imagen: monitorImg
    }
  ]

  const features = [
    { icon: "bi-shield-lock", text: "Acceso seguro y controlado" },
    { icon: "bi-qr-code", text: "Ingreso con QR dinámico" },
    { icon: "bi-speedometer2", text: "Monitoreo en tiempo real" },
    { icon: "bi-building", text: "Control independiente por condominio" }
  ]

  return (
    <div className="bg-light">
      <Hero
        title="Sistema de Gestión de Parking"
        subtitle="Control centralizado para condominios y edificios"
        description="Administración de accesos, vehículos y espacios de estacionamiento en una sola plataforma."
        background={parkingHero}
        height="80vh"
      />

      <section className="py-5">
        <Container>
          <div className="text-center mb-5 reveal">
            <h2 className="fw-bold">Módulos del Sistema</h2>
            <p className="text-muted">
              Herramientas para una gestión eficiente de estacionamientos
            </p>
          </div>

          <Row className="g-4">
            {servicios.map((s, i) => (
              <Col md={4} key={i}>
                <CardDescrip
                  titulo={s.titulo}
                  descripcion={s.descripcion}
                  imagen={s.imagen}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <ListaConImagen
        title="Panel de Control Centralizado"
        image={dashboardImg}
        imagePosition="right"
        features={features}
      />

      <section className="py-5 text-center bg-white">
        <Container>
          <h2 className="fw-bold">Gestión por Condominio</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Cada condominio opera de forma independiente dentro del sistema,
            con control de accesos, usuarios y espacios totalmente administrable.
          </p>

          <Link to="/login" className="btn btn-dark mt-3 px-4">
            Acceder al sistema
          </Link>
        </Container>
      </section>
    </div>
  )
}

export default Servicios