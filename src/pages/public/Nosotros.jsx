import React from "react"
import Hero from "../../components/Hero"
import SeccionConImg from "../../components/SeccionImg"
import parkingAbout from "../../images/parking-about.jpg"
import parkingSystem from "../../images/parking-system.jpg"
import controlOperativo from "../../images/control-operativo.jpg"
import parkingTech from "../../images/parking-tech.jpg"
import parkingFuture from "../../images/parking-future.jpg"

function Nosotros() {
  return (
    <>
      <Hero
        title="Sobre Nosotros"
        description="Urbania es un sistema de gestión de condominios que centraliza la administración operativa, digitaliza procesos internos y mejora el control de residentes, accesos y recursos del edificio."
        background={parkingAbout}
        height="70vh"
        align="center"
        backgroundPosition="center"
      />

      <SeccionConImg
        title="Digitalización de la administración residencial"
        text={[
          "Urbania reemplaza procesos manuales en condominios por una gestión completamente digital basada en roles y permisos.",
          "Permite administrar estructuras complejas como condominios con múltiples torres, edificios y unidades habitacionales.",
          "Incluye control detallado de residentes, propietarios, visitantes y personal de seguridad con historial de actividad."
        ]}
        image={parkingSystem}
        imageAlt="Sistema Urbania"
        imagePosition="left"
        bgColor="#0f172a"
        textColor="#ffffff"
      />

      <SeccionConImg
        title="Control operativo y automatización"
        text={[
          "El sistema gestiona accesos vehiculares y peatonales mediante registros digitales y validaciones en tiempo real.",
          "Incluye administración de estacionamientos con asignación dinámica y control de ocupación por condominio.",
          "Permite la gestión de carritos compartidos con flujo de préstamo, devolución y trazabilidad completa."
        ]}
        image={controlOperativo}
        imageAlt="Control Operativo"
        imagePosition="right"
        bgColor="#111827"
        textColor="#e5e7eb"
      />

      <SeccionConImg
        title="Arquitectura preparada para crecimiento"
        text={[
          "Urbania está construida bajo un modelo modular que permite escalar a múltiples condominios sin afectar el rendimiento.",
          "Su backend soporta autenticación segura, control por roles, auditoría de acciones y comunicación entre módulos.",
          "Está preparada para integrarse con sistemas externos como cámaras, lectores QR y soluciones de monitoreo inteligente."
        ]}
        image={parkingTech}
        imageAlt="Arquitectura Urbania"
        imagePosition="left"
        bgColor="#0b1220"
        textColor="#ffffff"
      />

      <SeccionConImg
        title="Evolución hacia gestión urbana inteligente"
        text={[
          "Urbania busca evolucionar la administración de condominios hacia un modelo basado en datos y automatización.",
          "El sistema permite generar reportes de uso, comportamiento de residentes y eficiencia de espacios comunes.",
          "Su visión es convertirse en una herramienta clave para la modernización de comunidades residenciales en entornos urbanos."
        ]}
        image={parkingFuture}
        imageAlt="Futuro Urbania"
        imagePosition="right"
        bgColor="#0b1220"
        textColor="#ffffff"
      />
    </>
  )
}

export default Nosotros