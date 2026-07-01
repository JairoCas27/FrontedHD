import Hero from "../../components/Hero";
import PricingCards from "../../components/PricingCards";
import FAQ from "../../components/FAQ";
import parkingPricing from "../../images/parking-pricing.jpg";

function Precios() {
  const planes = [
    {
      nombre: "Starter",
      precio: "S/ 49 / mes",
      descripcion: "Para condominios pequeños o en etapa inicial de digitalización",
      features: [
        "Gestión de hasta 50 unidades residenciales",
        "Control básico de accesos y residentes",
        "Registro de vehículos y visitantes",
        "Soporte estándar por correo electrónico"
      ]
    },
    {
      nombre: "Business",
      precio: "S/ 129 / mes",
      descripcion: "Para edificios y condominios en crecimiento",
      features: [
        "Hasta 200 unidades residenciales",
        "Control de accesos mediante códigos QR",
        "Monitoreo en tiempo real de ocupación",
        "Gestión de estacionamientos y reservas"
      ]
    },
    {
      nombre: "Enterprise",
      precio: "S/ 299 / mes",
      descripcion: "Para administradoras con múltiples condominios",
      features: [
        "Arquitectura multi-condominio escalable",
        "Gestión avanzada de roles y permisos",
        "API para integraciones externas",
        "Auditoría completa",
        "Soporte 24/7"
      ]
    }
  ]

  const faqs = [
    {
      pregunta: "¿Qué funcionalidades incluye el sistema?",
      respuesta:
        "Urbania incluye gestión de condominios, residentes, accesos vehiculares, estacionamientos, carritos compartidos y reportes en tiempo real."
    },
    {
      pregunta: "¿Puedo cambiar de plan en cualquier momento?",
      respuesta:
        "Sí, puedes escalar o reducir tu plan sin pérdida de información ni interrupción del servicio."
    },
    {
      pregunta: "¿El sistema soporta reconocimiento de placas?",
      respuesta:
        "Sí, los planes Business y Enterprise permiten integración con sistemas LPR para control automático de vehículos."
    },
    {
      pregunta: "¿Es posible administrar varios condominios?",
      respuesta:
        "Sí, el plan Enterprise está diseñado para gestión multi-condominio con control centralizado."
    }
  ]

  return (
    <div className="bg-light">
      <Hero
        title="Planes y Precios"
        description="Elige el plan adecuado para tu condominio y escala la gestión según el crecimiento de tu operación."
        background={parkingPricing}
        height="80vh"
      />

      <PricingCards planes={planes} />

      <FAQ items={faqs} />

      <section className="py-5 text-center bg-white">
        <div className="container">
          <h3 className="fw-bold">¿Necesitas una solución a medida?</h3>
          <p className="text-muted">
            Podemos adaptar Urbania según el número de condominios, usuarios y módulos que requieras.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Precios