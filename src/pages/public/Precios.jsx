import Hero from "../../components/Hero";
import PricingCards from "../../components/PricingCards";
import FAQ from "../../components/FAQ";
import parkingPricing from "../../images/parking-pricing.jpg";

function Precios() {
  const planes = [
    {
      nombre: "Starter",
      precio: "S/ 49 / mes",
      descripcion: "Ideal para condominios pequeños",
      features: [
        "Hasta 50 residentes",
        "Control de acceso básico",
        "Soporte estándar"
      ]
    },
    {
      nombre: "Business",
      precio: "S/ 129 / mes",
      descripcion: "Para edificios medianos",
      features: [
        "Hasta 200 residentes",
        "QR + LPR",
        "Monitoreo en tiempo real"
      ]
    },
    {
      nombre: "Enterprise",
      precio: "S/ 299 / mes",
      descripcion: "Para múltiples condominios",
      features: [
        "Multi-tenant",
        "Roles avanzados",
        "API + soporte 24/7"
      ]
    }
  ];

  const faqs = [
    {
      pregunta: "¿Qué incluye cada plan?",
      respuesta:
        "Incluye control de accesos, gestión de residentes y funcionalidades según el nivel."
    },
    {
      pregunta: "¿Puedo escalar mi plan?",
      respuesta:
        "Sí, puedes cambiar de plan en cualquier momento sin perder información."
    },
    {
      pregunta: "¿Funciona con cámaras LPR?",
      respuesta:
        "Sí, contamos con integración para reconocimiento de placas en planes superiores."
    },
    {
      pregunta: "¿Puedo tener múltiples condominios?",
      respuesta:
        "Sí, el plan Enterprise está diseñado para gestión multi-condominio."
    }
  ];

  return (
    <div className="bg-light">
      <Hero
        title="Únete a URBANK PARK"
        subtitle="Escalables según tu condominio"
        description="Paga solo por lo que necesitas, crece cuando quieras."
        background={parkingPricing}
        height="80vh"
      />

      <PricingCards planes={planes} />

      <FAQ items={faqs} />

      <section className="py-5 text-center bg-white">
        <div className="container">
          <h3 className="fw-bold">¿Necesitas un plan personalizado?</h3>
          <p className="text-muted">
            Podemos adaptar el sistema a la cantidad de condominios que administres.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Precios;