import { useState } from "react";
import { User, Mail, Home, Save, Send, X, MapPin, Building } from "lucide-react";

export default function PerfilPropietario() {
  const getUsuario = () => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : {
      nombre: "Juan Pérez",
      email: "juan@email.com",
      condominio: "Condominio Los Pinos",
      torre: "Torre A",
      piso: "Piso 3",
      departamento: "Dpto 302",
      rol: "Propietario"
    };
  };

  const [usuario, setUsuario] = useState(getUsuario());
  const [form, setForm] = useState(usuario);
  const [modal, setModal] = useState(false);
  const [animarModal, setAnimarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const colores = {
    naranja: "#f97316",
    naranjaOscuro: "#ea580c",
    texto: "#1e293b",
    subtitulo: "#64748b",
    indigoPalido: "#94a3b8"
  };

  const abrirEditar = () => {
    setForm(usuario);
    setModal(true);
    setTimeout(() => setAnimarModal(true), 10);
  };

  const cerrarModal = () => {
    setAnimarModal(false);
    setTimeout(() => setModal(false), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    localStorage.setItem("usuario", JSON.stringify(form));
    setUsuario(form);
    setMensaje("Perfil actualizado correctamente");
    cerrarModal();
    setTimeout(() => setMensaje(""), 3000);
  };

  const solicitar = () => {
    setMensaje("Solicitud de cambio enviada");
    cerrarModal();
    setTimeout(() => setMensaje(""), 3000);
  };

  const inputStyle = { width: "100%", padding: "10px 0", border: "none", borderBottom: "2px solid #e2e8f0", outline: "none", fontSize: "1rem", color: "#334155", background: "transparent", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: "0.75rem", fontWeight: 600, color: colores.indigoPalido, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: "600px", margin: "0 auto" }}>
      
      {/* MENSAJE */}
      {mensaje && (
        <div style={{ marginBottom: "1rem", padding: "0.8rem", background: colores.naranja, color: "white", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 12px rgba(249,115,22,0.2)" }}>{mensaje}</div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: colores.texto, margin: 0 }}>Mi Perfil</h1>
        <p style={{ color: colores.subtitulo, margin: "4px 0 0 0" }}>Gestiona tus datos personales y ubicación</p>
      </div>

      {/* CARD PRINCIPAL (IDENTIDAD) */}
      <div style={{
        background: `linear-gradient(135deg, ${colores.naranja} 0%, ${colores.naranjaOscuro} 100%)`,
        borderRadius: "28px",
        padding: "2rem",
        color: "white",
        boxShadow: "0 10px 25px rgba(234,88,12,0.2)",
        position: "relative",
        overflow: "hidden",
        marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", padding: "15px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={48} strokeWidth={1.5} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>{usuario.nombre}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.9, fontSize: "0.9rem" }}>
              <Mail size={14} /> {usuario.email}
            </div>
            <span style={{ display: "inline-block", marginTop: "8px", background: "rgba(0,0,0,0.15)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>{usuario.rol}</span>
          </div>
        </div>
      </div>

      {/* CARD DETALLES (UBICACIÓN) */}
      <div style={{ background: "white", borderRadius: "24px", padding: "1.5rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem", color: colores.texto }}>
          <Home size={20} color={colores.naranja} />
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Detalles de Vivienda</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "16px" }}>
            <label style={{ ...labelStyle, fontSize: "0.65rem" }}>Condominio</label>
            <div style={{ fontWeight: 600, color: colores.texto }}>{usuario.condominio}</div>
          </div>
          <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "16px" }}>
            <label style={{ ...labelStyle, fontSize: "0.65rem" }}>Ubicación Interna</label>
            <div style={{ fontWeight: 600, color: colores.texto }}>{usuario.torre} • {usuario.piso}</div>
          </div>
          <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "16px", gridColumn: "span 2" }}>
            <label style={{ ...labelStyle, fontSize: "0.65rem" }}>Departamento</label>
            <div style={{ fontWeight: 600, color: colores.texto }}>{usuario.departamento}</div>
          </div>
        </div>

        <button
          onClick={abrirEditar}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 5px 15px rgba(249,115,22,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            background: colores.naranja,
            color: "white",
            padding: "0.8rem",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            fontWeight: "700",
            transition: "all 0.2s ease"
          }}
        >
          Editar Información
        </button>
      </div>

      {/* MODAL EDITAR */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, opacity: animarModal ? 1 : 0, transition: "opacity 0.3s ease" }}>
          <div style={{ 
            background: "#ffffff", padding: "2rem", borderRadius: "28px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            opacity: animarModal ? 1 : 0,
            transform: animarModal ? "scale(1) translateY(0)" : "scale(0.9) translateY(-20px)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, color: colores.texto, fontSize: "1.3rem" }}>Editar Perfil</h3>
              <button onClick={cerrarModal} style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", padding: "6px", cursor: "pointer", color: colores.subtitulo }}><X size={20}/></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "5px" }}>
              {["nombre", "email", "condominio", "torre", "piso", "departamento"].map(f => (
                <div key={f}>
                  <label style={labelStyle}>{f}</label>
                  <input name={f} value={form[f]} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderBottomColor = colores.naranja} onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.8rem", marginTop: "2rem" }}>
              <button onClick={solicitar} style={{ flex: 1, background: "transparent", color: colores.subtitulo, border: "1px solid #e2e8f0", padding: "0.8rem", borderRadius: "14px", fontWeight: "600", cursor: "pointer" }}>Solicitar</button>
              <button onClick={guardar} style={{ flex: 1, background: colores.naranja, color: "white", border: "none", padding: "0.8rem", borderRadius: "14px", fontWeight: "600", cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}