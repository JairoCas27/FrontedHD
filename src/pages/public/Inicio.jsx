import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "../../components/Hero";
import ListaConImagen from "../../components/ListaConImagen";
import CarruselCard from "../../components/CarruselCard";
import ParkingVideo from "../../images/ParkingVideo.mp4";

function Inicio() {
  const listaInicio = [
    { icon: "bi-check-circle-fill", text: "Control de estacionamientos en tiempo real dentro del condominio." },
    { icon: "bi-check-circle-fill", text: "Gestión de ingresos y salidas de vehículos de forma ordenada." },
    { icon: "bi-check-circle-fill", text: "Reservas digitales rápidas desde web o app." },
    { icon: "bi-check-circle-fill", text: "Accesos por roles para mayor control y seguridad." }
  ];

  const carruselInicio = [
    { icon: "bi-speedometer2", title: "Monitoreo en tiempo real", text: "Visualiza la ocupación y disponibilidad de los espacios en todo momento." },
    { icon: "bi-shield-lock", title: "Acceso seguro", text: "Control de permisos por usuario para una gestión ordenada del condominio." },
    { icon: "bi-graph-up", title: "Reportes inteligentes", text: "Analiza el uso de los espacios y el flujo de vehículos dentro del condominio." },
    { icon: "bi-phone", title: "Acceso móvil", text: "Gestiona los estacionamientos desde cualquier dispositivo 24/7." },
    { icon: "bi-clock-history", title: "Historial completo", text: "Registro detallado de todos los movimientos de vehículos." },
    { icon: "bi-building", title: "Multi-condominio", text: "Administra varios edificios desde un solo panel centralizado." },
    { icon: "bi-car-front", title: "Optimización de espacios", text: "Mejora la asignación y uso eficiente de cada estacionamiento." },
    { icon: "bi-geo-alt", title: "Asignación inteligente", text: "Distribución ordenada de espacios según disponibilidad del condominio." }
  ];

  return (
    <>
      <Hero
        title="URBAN PARK"
        subtitle="Sistema de gestión de parking para condominios"
        description="Control, organización y monitoreo en tiempo real para la administración eficiente de estacionamientos en edificios modernos."
        video={ParkingVideo}
        height="90vh"
        align="center"
      />

      <ListaConImagen
        features={listaInicio}
        videoUrl="https://www.youtube.com/watch?v=bQ5Uoepy0kg"
        imagePosition="right"
        title="¿Por qué elegir Urban Park?"
      />

      <section className="py-5" style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)" }}>
        <CarruselCard features={carruselInicio} />
      </section>
    </>
  );
}

export default Inicio;