import React from "react";
import Hero from "../../components/Hero";
import SeccionConImg from "../../components/SeccionImg";
import parkingAbout from "../../images/parking-about.jpg";
import parkingSystem from "../../images/parking-system.jpg";
import parkingTech from "../../images/parking-tech.jpg";
import parkingFuture from "../../images/parking-future.jpg";

function Nosotros() {
  return (
    <>
      <Hero
        title="URBAN PARK"
        subtitle="La plataforma inteligente de gestión de estacionamientos"
        description="Un sistema SaaS escalable que digitaliza, automatiza y optimiza el control de parqueos en condominios, edificios corporativos y complejos residenciales."
        background={parkingAbout}
        height="70vh"
        align="center"
        backgroundPosition="center"
      />

      <SeccionConImg
        title="Plataforma SaaS para Smart Parking"
        text={[
          "Urban Park es una solución SaaS (Software as a Service) diseñada para la gestión inteligente de estacionamientos en tiempo real.",
          "Centraliza el control de accesos, disponibilidad de espacios, reservas y monitoreo desde una única plataforma accesible desde web y dispositivos móviles.",
          "Actualmente es utilizada como base tecnológica para entornos residenciales y corporativos que buscan automatizar su operación de parqueo."
        ]}
        image={parkingSystem}
        imageAlt="Sistema Urban Park"
        imagePosition="left"
        bgColor="#0f172a"
        textColor="#ffffff"
      />

      <SeccionConImg
        title="Arquitectura Escalable y Modular"
        text={[
          "El sistema está construido bajo una arquitectura moderna full-stack, preparada para escalar a múltiples condominios y miles de usuarios concurrentes.",
          "Incluye módulos independientes para administración, seguridad, residentes y reportes en tiempo real.",
          "Su diseño permite integración con tecnologías como cámaras LPR, QR dinámico y control de accesos automatizado."
        ]}
        image={parkingTech}
        imageAlt="Tecnología Urban Park"
        imagePosition="right"
        bgColor="#111827"
        textColor="#e5e7eb"
      />

      <SeccionConImg
        title="Visión de Futuro en Smart Cities"
        text={[
          "Urban Park no es solo un sistema de estacionamientos, es una plataforma orientada a la evolución de las ciudades inteligentes.",
          "Buscamos convertirnos en el estándar de gestión de parqueos en Latinoamérica, integrando IA, automatización y analítica avanzada.",
          "Nuestro objetivo es reducir tiempos de gestión, mejorar la seguridad y optimizar el uso del espacio urbano."
        ]}
        image={parkingFuture}
        imageAlt="Futuro Smart Parking"
        imagePosition="left"
        bgColor="#0b1220"
        textColor="#ffffff"
      />
    </>
  );
}

export default Nosotros;