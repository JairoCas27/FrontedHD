import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "../../components/Hero";
import ListaConImagen from "../../components/ListaConImagen";
import CarruselCard from "../../components/CarruselCard";
import ParkingVideo from "../../images/ParkingVideo.mp4";

function Inicio() {
  const listaInicio = [
    { icon: "bi-check-circle-fill", text: "Gestión en tiempo real de la ocupación de estacionamientos del condominio." },
    { icon: "bi-check-circle-fill", text: "Control automatizado de ingresos y salidas con registro ordenado de vehículos." },
    { icon: "bi-check-circle-fill", text: "Reservas digitales rápidas desde web o aplicación móvil." },
    { icon: "bi-check-circle-fill", text: "Gestión por roles y permisos para mayor seguridad y control operativo." },
    { icon: "bi-check-circle-fill", text: "Integración flexible con condominios mediante APIs y sistemas existentes." }
  ];

  const carruselInicio = [
    { icon: "bi-speedometer2", title: "Monitoreo en tiempo real", text: "Visualiza en tiempo real la ocupación, disponibilidad y actividad del estacionamiento." },
    { icon: "bi-shield-lock", title: "Control de acceso seguro", text: "Administra permisos de usuarios y vehículos desde un panel centralizado seguro." },
    { icon: "bi-graph-up", title: "Analítica inteligente", text: "Genera reportes detallados sobre uso de espacios y flujo vehicular del sistema." },
    { icon: "bi-phone", title: "Acceso multiplataforma", text: "Gestiona la plataforma desde web o aplicación móvil en cualquier momento disponible." },
    { icon: "bi-clock-history", title: "Trazabilidad completa", text: "Registra entradas, salidas y movimientos de vehículos con historial completo." },
    { icon: "bi-building", title: "Gestión multi-condominio", text: "Administra múltiples edificios desde una sola plataforma centralizada escalable." },
    { icon: "bi-car-front", title: "Optimización de espacios", text: "Mejora la asignación y uso eficiente de todos los estacionamientos disponibles." },
    { icon: "bi-diagram-3", title: "Arquitectura flexible", text: "Sistema adaptable y escalable para cualquier tipo de condominio o edificio." }
  ];

  return (
    <>
      <Hero
        title="URBAN PARK"
        description="Gestión inteligente y en tiempo real de estacionamientos para edificios modernos."
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