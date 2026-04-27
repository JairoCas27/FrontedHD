import "bootstrap/dist/css/bootstrap.min.css"
import Hero from "../../components/Hero"
import { useState } from "react"
import parkingContact from "../../images/parking-contact.jpg"

function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <>
      <Hero
        title="Contactanos"
        subtitle="Estamos aquí para ayudarte a optimizar tu sistema de parking"
        description="Soporte técnico, ventas o consultas sobre Urban Park."
        background={parkingContact}
        height="70vh"
        align="center"
        backgroundPosition="center"
      />

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
        }}
      >
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-dark">
            Envíanos un mensaje
          </h2>

          <form
            className="mx-auto p-5 rounded-4 shadow-lg"
            style={{
              maxWidth: "650px",
              background: "#ffffff",
              border: "1px solid #e2e8f0"
            }}
            onSubmit={handleSubmit}
          >
            <div className="mb-4 text-start">
              <label className="form-label fw-semibold text-dark">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                placeholder="Tu nombre completo"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  padding: "12px"
                }}
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-semibold text-dark">
                Correo
              </label>
              <input
                type="email"
                name="email"
                placeholder="tuemail@empresa.com"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  padding: "12px"
                }}
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-semibold text-dark">
                Mensaje
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder="Describe tu consulta o requerimiento..."
                className="form-control"
                value={formData.message}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  padding: "12px"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold py-3 mt-2"
              style={{
                background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease"
              }}
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Contacto