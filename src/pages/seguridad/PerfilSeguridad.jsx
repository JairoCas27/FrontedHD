import { useState, useEffect } from "react";
import { FiActivity, FiUser, FiMail, FiPhone, FiShield, FiEdit2, FiSave, FiLock } from "react-icons/fi";

export default function PerfilSeguridad() {
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [perfil, setPerfil] = useState({
    nombres: "Usuario",
    apellidos: "Demo",
    dni: "12345678",
    email: "seguridad@parking.com",
    telefono: "999999999",
    rol: "Seguridad",
    turno: "Noche (22:00 - 06:00)",
    fechaIngreso: "2024-01-15",
    ultimoAcceso: new Date().toLocaleString()
  });

  const [formData, setFormData] = useState({ ...perfil });

  // Cargar perfil del localStorage si existe
  useEffect(() => {
    const perfilGuardado = JSON.parse(localStorage.getItem("perfilSeguridad") || "null");
    if (perfilGuardado) {
      setPerfil(perfilGuardado);
      setFormData(perfilGuardado);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    
    const nuevoPerfil = { ...formData, ultimoAcceso: new Date().toLocaleString() };
    localStorage.setItem("perfilSeguridad", JSON.stringify(nuevoPerfil));
    setPerfil(nuevoPerfil);
    setEditando(false);
    setMensaje({ tipo: "success", texto: "✅ Perfil actualizado correctamente" });
    
    setTimeout(() => setMensaje(null), 3000);
  };

  const cancelarEdicion = () => {
    setFormData({ ...perfil });
    setEditando(false);
    setMensaje(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Perfil</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Información del agente de seguridad</p>
      </div>

      {/* TARJETA DE PERFIL */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* AVATAR */}
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 800
            }}>
              {perfil.nombres.charAt(0)}{perfil.apellidos.charAt(0)}
            </div>
            
            <div>
              <h3 style={{ margin: 0, color: "#1e293b", fontWeight: 800 }}>{perfil.nombres} {perfil.apellidos}</h3>
              <p style={{ margin: "0.25rem 0", color: "#64748b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiShield size={16} color="#10b981" />
                {perfil.rol}
              </p>
              <span style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundColor: "#dcfce7",
                color: "#166534"
              }}>
                Activo
              </span>
            </div>
          </div>
          
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f1f5f9",
                color: "#1e293b",
                border: "none",
                borderRadius: "10px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FiEdit2 size={16} />
              Editar Perfil
            </button>
          )}
        </div>

        {mensaje && (
          <div style={{
            padding: "1rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #10b981",
            color: "#166534"
          }}>
            {mensaje.texto}
          </div>
        )}

        {/* FORMULARIO DE EDICIÓN O DATOS */}
        {editando ? (
          <form onSubmit={guardarCambios}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", backgroundColor: "#f8fafc" }}
                  readOnly
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Email</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiMail size={16} color="#94a3b8" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Teléfono</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPhone size={16} color="#94a3b8" />
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Turno</label>
                <input
                  type="text"
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <FiSave size={18} />
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={cancelarEdicion}
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Nombre Completo</p>
              <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiUser size={16} color="#10b981" />
                {perfil.nombres} {perfil.apellidos}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>DNI</p>
              <p style={{ margin: 0, color: "#1e293b", fontWeight: 600 }}>{perfil.dni}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Email</p>
              <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiMail size={16} color="#10b981" />
                {perfil.email}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Teléfono</p>
              <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiPhone size={16} color="#10b981" />
                {perfil.telefono}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Turno</p>
              <p style={{ margin: 0, color: "#1e293b", fontWeight: 600 }}>{perfil.turno}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Fecha de Ingreso</p>
              <p style={{ margin: 0, color: "#1e293b", fontWeight: 600 }}>{perfil.fechaIngreso}</p>
            </div>
          </div>
        )}
      </div>

      {/* INFORMACIÓN DEL SISTEMA */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiLock size={20} />
          Información del Sistema
        </h5>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Rol Asignado</p>
            <p style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}>{perfil.rol}</p>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Último Acceso</p>
            <p style={{ margin: 0, color: "#1e293b", fontWeight: 600 }}>{perfil.ultimoAcceso}</p>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Estado de Cuenta</p>
            <p style={{ margin: 0, color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
              Activa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}