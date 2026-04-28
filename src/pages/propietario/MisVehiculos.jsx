import { useState } from "react";
import { FiTruck } from "react-icons/fi";
import { Car, Send, Save, X, Plus } from "lucide-react";

export default function MisVehiculos() {

  const getVehiculos = () => {
  const data = localStorage.getItem("vehiculos");
  return data ? JSON.parse(data) : [
      {
        estacionamiento: "A-1234",
        marca: "Toyota",
        modelo: "Camry 2022",
        color: "Plata",
        placa: "ABC-1234",
      },
      {
        estacionamiento: "B-5678",
        marca: "Honda",
        modelo: "Civic 2023",
        color: "Negro",
        placa: "XYZ-5678",
      }
    ];
  };

  const [vehiculos, setVehiculos] = useState(getVehiculos());
  const [modal, setModal] = useState(false);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [indexEditando, setIndexEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({ marca: "", modelo: "", color: "", placa: "" });
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ marca: "", modelo: "", color: "", placa: "" });
  const colores = { naranjaPrincipal: "#f97316", naranjaOscuro: "#ea580c", indigoPalido: "#94a3b8", slate: "#1e293b", lightSlate: "#64748b" };
  const abrirEditar = (vehiculo, index) => {
    setForm(vehiculo);
    setIndexEditando(index);
    setModal(true);
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const guardar = () => {
    const copia = [...vehiculos];
    copia[indexEditando] = { ...copia[indexEditando], ...form };
    setVehiculos(copia);
    localStorage.setItem("vehiculos", JSON.stringify(copia));
    setMensaje("Cambios guardados correctamente ");
    setModal(false);
    setTimeout(() => setMensaje(""), 3000);
  };
  const solicitar = () => {
    setMensaje("Solicitud enviada correctamente ");
    setModal(false);
    setTimeout(() => setMensaje(""), 3000);
  };
  const handleNuevo = (e) => setNuevoVehiculo({ ...nuevoVehiculo, [e.target.name]: e.target.value });
  const enviarNuevo = () => {
    setMensaje("Solicitud enviada correctamente ");
    setModalNuevo(false);
    setNuevoVehiculo({ marca: "", modelo: "", color: "", placa: "" });
    setTimeout(() => setMensaje(""), 3000);
  };
  const inputStyle = { width: "100%", padding: "10px 0", border: "none", borderBottom: "2px solid #e2e8f0", outline: "none", fontSize: "1rem", color: "#334155", background: "transparent", transition: "border-color 0.2s" };
  const labelStyle = { fontSize: "0.75rem", fontWeight: 600, color: colores.indigoPalido, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" };
  const modalOverlayStyle = { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
  const modalContentStyle = { background: "#ffffff", padding: "2rem", borderRadius: "28px", width: "90%", maxWidth: "380px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1rem' }}>
      {/* MENSAJE */}
      {mensaje && (
        <div style={{ marginBottom: "1rem", padding: "0.8rem", background: colores.naranjaPrincipal, color: "white", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 12px rgba(249,115,22,0.2)" }}>{mensaje}</div>
      )}
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: colores.slate, margin: 0 }}>Mis Vehículos</h1>
        <p style={{ color: colores.lightSlate, margin: "4px 0 0 0" }}>Registro y gestión de tus vehículos</p>
      </div>
      {/* BOTÓN AÑADIR */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button onClick={() => setModalNuevo(true)} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.background = colores.naranjaOscuro; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = colores.naranjaPrincipal; }} style={{ background: colores.naranjaPrincipal, color: "white", 
          border: "none", padding: "0.8rem 1.2rem", borderRadius: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 12px rgba(249,115,22,0.2)", transition: "all 0.2s ease" }}>
          <Plus size={18}/> Añadir vehículo
        </button>
      </div>
      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {vehiculos.map((v, index) => (
          <div key={index} style={{ background: `linear-gradient(135deg, ${colores.naranjaPrincipal} 0%, ${colores.naranjaOscuro} 100%)`, borderRadius: "24px", padding: "2rem", color: "white", position: "relative", overflow: "hidden", transition: "0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "12px" }}><Car size={32} /></div>
              <div><h3 style={{ margin: 0, fontSize: "1.3rem" }}>{v.estacionamiento}</h3><p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>UBICACIÓN ASIGNADA</p></div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.05)", padding: "1rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
              {[{l: "Marca", v: v.marca}, {l: "Modelo", v: v.modelo}, {l: "Color", v: v.color}, {l: "Placa", v: v.placa}].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "2px" }}>
                  <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{item.l}</span><span style={{ fontWeight: 600 }}>{item.v}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => abrirEditar(v, index)}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              style={{ width: "100%", background: "white", padding: "0.7rem", borderRadius: "12px", border: "none", color: colores.naranjaOscuro, fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" }}>Editar Información
            </button>
            </div>
        ))}
      </div>
      {/* MODAL EDITAR */}
      {modal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
              <div><h3 style={{ color: colores.slate, margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Editar Vehículo</h3><p style={{ margin: 0, fontSize: "0.85rem", color: colores.lightSlate }}>Actualiza los detalles</p></div>
              <button 
                onClick={() => setModal(false)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f3e3ce"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", padding: "6px", cursor: "pointer", color: colores.lightSlate, transition: "0.2s" }}>
                  <X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {["marca", "modelo", "color", "placa"].map(f => (
                <div key={f}><label style={labelStyle}>{f}</label><input name={f} value={form[f]} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderBottomColor = colores.naranjaPrincipal} onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"}/></div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "2rem" }}>
              <button 
                onClick={solicitar}
                onMouseEnter={(e) => e.currentTarget.style.background = "#cfcfcf"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                style={{ flex: 1, background: "transparent", color: colores.lightSlate, border: "1px solid #e2e8f0", padding: "0.8rem", borderRadius: "14px", fontWeight: "600", cursor: "pointer", transition: "0.2s ease" }}
              >Solicitar</button>
              <button 
                onClick={guardar}
                onMouseEnter={(e) => { e.currentTarget.style.background = colores.naranjaOscuro; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colores.naranjaPrincipal; e.currentTarget.style.transform = "translateY(0)"; }}
                style={{ flex: 1, background: colores.naranjaPrincipal, color: "white", border: "none", padding: "0.8rem", borderRadius: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }}
              >Guardar</button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL NUEVO */}
      {modalNuevo && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
              <div><h3 style={{ color: colores.slate, margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Nuevo Vehículo</h3><p style={{ margin: 0, fontSize: "0.85rem", color: colores.lightSlate }}>Envía una solicitud de registro</p></div>
              <button 
                onClick={() => setModalNuevo(false)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f3e3ce"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", padding: "6px", cursor: "pointer", color: colores.lightSlate, transition: "0.2s" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {["marca", "modelo", "color", "placa"].map(f => (
                <div key={f}><label style={labelStyle}>{f}</label><input name={f} placeholder={`Ingresa ${f}`} onChange={handleNuevo} style={inputStyle} onFocus={e => e.target.style.borderBottomColor = colores.naranjaPrincipal} onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"}/></div>
              ))}
            </div>
            <button onClick={enviarNuevo} style={{ width: "100%", background: colores.naranjaPrincipal, color: "white", border: "none", padding: "0.9rem", borderRadius: "14px", fontWeight: "600", cursor: "pointer", marginTop: "2rem" }}>Enviar solicitud</button>
          </div>
        </div>
      )}
      {/* BLOQUE ORIGINAL */}
      <div style={{ marginTop: "3rem", textAlign: "center", color: "#94a3b8" }}>
        <FiTruck size={48} style={{ opacity: 0.5 }} /><p style={{ fontWeight: 500 }}>Módulo de carga en construcción</p>
      </div>
    </div>
  );
}