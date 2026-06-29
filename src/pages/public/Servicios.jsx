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
      titulo: "Gestión de Condominios",
      descripcion: "Administración de condominios, torres, pisos y unidades en una plataforma centralizada.",
      imagen: dashboardImg
    },
    {
      titulo: "Gestión de Residentes",
      descripcion: "Control de propietarios, inquilinos y usuarios con roles y permisos por condominio.",
      imagen: residentesImg
    },
    {
      titulo: "Control de Accesos",
      descripcion: "Registro y validación de ingresos de residentes, visitantes y personal en tiempo real.",
      imagen: monitorImg
    }
  ]

  const features = [
    { icon: "bi-buildings", text: "Gestión de condominios, torres y apartamentos" },
    { icon: "bi-people", text: "Administración de residentes y usuarios" },
    { icon: "bi-car-front", text: "Control de vehículos y accesos" },
    { icon: "bi-p-square", text: "Gestión de estacionamientos en tiempo real" },
    { icon: "bi-cart", text: "Administración de carritos compartidos" }
  ]

  return (
    <div className="bg-light">
      <Hero
        title="Servicios"
        description="Plataforma integral para la gestión de condominios con control de residentes, carritos y estacionamientos."
        background={parkingHero}
        height="80vh"
      />

      <section className="py-5">
        <Container>
          <div className="text-center mb-5 reveal">
            <h2 className="fw-bold">Módulos del Sistema</h2>
            <p className="text-muted">
              Soluciones completas para la administración moderna de condominios
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
        image={accessImg}
        imagePosition="right"
        features={features}
      />

      <section className="py-5 text-center bg-white">
        <Container>
          <h2 className="fw-bold">Gestión por Condominio</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Cada condominio opera de forma independiente dentro de Urbania,
            con control total de usuarios, accesos, vehículos, estacionamientos y servicios internos.
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