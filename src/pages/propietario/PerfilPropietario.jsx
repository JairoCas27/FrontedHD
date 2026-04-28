import { FiUser } from "react-icons/fi"

export default function PerfilPropietario() {
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1e293b" }}>Mi Perfil</h1>
        <p style={{ color: "#64748b" }}>Información personal del propietario</p>
      </div>

      <div style={{
        maxWidth: "500px",
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        borderRadius: "24px",
        padding: "2rem",
        color: "white"
      }}>
        <FiUser size={40} />
        <h2>Nombre Usuario</h2>
        <p>Propietario</p>
      </div>
    </div>
  );
}