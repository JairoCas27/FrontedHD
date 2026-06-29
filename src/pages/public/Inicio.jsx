import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "../../components/Hero";
import ListaConImagen from "../../components/ListaConImagen";
import CarruselCard from "../../components/CarruselCard";
import SistemaVideo from "../../images/ParkingVideo.mp4";

function Inicio() {
  const listaInicio = [
    {
      icon: "bi-check-circle-fill",
      text: "Administra condominios, torres, pisos y apartamentos desde una única plataforma centralizada."
    },
    {
      icon: "bi-check-circle-fill",
      text: "Gestiona residentes, propietarios, inquilinos y personal con control de roles y permisos."
    },
    {
      icon: "bi-check-circle-fill",
      text: "Controla vehículos, estacionamientos y accesos con trazabilidad completa en tiempo real."
    },
    {
      icon: "bi-check-circle-fill",
      text: "Administra préstamos y devoluciones de carritos compartidos de forma organizada."
    },
    {
      icon: "bi-check-circle-fill",
      text: "Obtén reportes, configuraciones y registros históricos para una gestión eficiente."
    }
  ];

  const carruselInicio = [
    {
      icon: "bi-buildings",
      title: "Gestión de Condominios",
      text: "Administra condominios, torres, pisos y apartamentos mediante una estructura organizada y escalable."
    },
    {
      icon: "bi-people",
      title: "Gestión de Residentes",
      text: "Controla propietarios, inquilinos y usuarios con roles específicos y acceso seguro."
    },
    {
      icon: "bi-car-front",
      title: "Control Vehicular",
      text: "Registra vehículos autorizados y mantiene el historial completo de ingresos y salidas."
    },
    {
      icon: "bi-p-square",
      title: "Administración de Estacionamientos",
      text: "Gestiona espacios disponibles y ocupados en tiempo real."
    },
    {
      icon: "bi-cart",
      title: "Carritos Compartidos",
      text: "Controla reservas, préstamos y devoluciones de carritos para los residentes."
    },
    {
      icon: "bi-shield-lock",
      title: "Seguridad y Accesos",
      text: "Protege la información mediante autenticación segura, permisos y trazabilidad de acciones."
    },
    {
      icon: "bi-bar-chart-line",
      title: "Reportes y Estadísticas",
      text: "Genera información clave para optimizar la administración y operación del condominio."
    },
    {
      icon: "bi-phone",
      title: "Plataforma Moderna",
      text: "Accede al sistema desde dispositivos web y móviles con una experiencia rápida y eficiente."
    }
  ];

  return (
    <>
      <Hero
        title="URBANIA"
        description="La plataforma integral para administrar condominios, residentes, vehículos, estacionamientos y carritos compartidos desde un solo lugar."
        video={SistemaVideo}
        height="90vh"
        align="center"
      />

      <ListaConImagen
        features={listaInicio}
        videoUrl="https://www.youtube.com/watch?v=ED3pxcplf3s"
        imagePosition="right"
        title="Todo lo que tu condominio necesita en una sola plataforma"
      />

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg,#0F172A,#1E293B)"
        }}
      >
        <CarruselCard features={carruselInicio} />
      </section>
    </>
  );
}

export default Inicio;