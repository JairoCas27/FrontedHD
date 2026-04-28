import { useState } from "react";
import { Car, Plus, X, Send, QrCode, Trash2, Calendar, Clock, User, ShieldCheck } from "lucide-react";

export default function PermisosEstacionamiento() {
  const getData = () => {
    const data = localStorage.getItem("permisos");
    return data ? JSON.parse(data) : {
      estacionamiento: "A-1234",
      permisos: []
    };
  };

  const [data, setData] = useState(getData());
  const [modal, setModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({ nombre: "", placa: "", inicio: "", fin: "" });

  const colores = {
    naranja: "#f97316",
    naranjaOscuro: "#ea580c",
    slate: "#1e293b",
    lightSlate: "#64748b",
    indigoPalido: "#94a3b8",
    bg: "#f8fafc"
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const hayCruce = (nuevoInicio, nuevoFin) => {
    return data.permisos.some(p => {
      if (p.estado !== "Activo") return false;
      const inicioExistente = new Date(p.inicio);
      const finExistente = new Date(p.fin);
      const inicioNuevo = new Date(nuevoInicio);
      const finNuevo = new Date(nuevoFin);
      return inicioNuevo < finExistente && finNuevo > inicioExistente;
    });
  };

  const generarPermiso = () => {
    if (!form.nombre || !form.placa || !form.inicio || !form.fin) {
      mostrarNotificacion("Completa todos los campos");
      return;
    }
    if (new Date(form.fin) <= new Date(form.inicio)) {
      mostrarNotificacion("La fecha fin debe ser mayor a inicio");
      return;
    }
    if (hayCruce(form.inicio, form.fin)) {
      mostrarNotificacion("Ya existe un permiso en ese horario");
      return;
    }

    const nuevo = { ...form, estado: "Activo", id: Date.now() };
    const actualizado = { ...data, permisos: [nuevo, ...data.permisos] };
    
    localStorage.setItem("permisos", JSON.stringify(actualizado));
    setData(actualizado);
    mostrarNotificacion("Permiso generado correctamente");
    setModal(false);
    setForm({ nombre: "", placa: "", inicio: "", fin: "" });
  };

  const mostrarNotificacion = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 3000);
  };

  const eliminarPermiso = (id) => {
    const nuevos = data.permisos.filter(p => p.id !== id);
    const actualizado = { ...data, permisos: nuevos };
    localStorage.setItem("permisos", JSON.stringify(actualizado));
    setData(actualizado);
    mostrarNotificacion("Permiso eliminado");
  };

  const inputStyle = { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.9rem", marginTop: "5px", transition: "0.2s" };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: "1.5rem", maxWidth: "800px", margin: "0 auto", backgroundColor: colores.bg, minHeight: "100vh" }}>

      {/* NOTIFICACIÓN ESTILO MODERNO */}
      {mensaje && (
        <div style={{ position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)", background: colores.slate, color: "white", padding: "12px 24px", borderRadius: "16px", zIndex: 3000, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", fontSize: "0.9rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldCheck size={18} color={colores.naranja} /> {mensaje}
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: colores.slate, margin: 0 }}>Estacionamiento</h1>
          <p style={{ color: colores.lightSlate, margin: "4px 0 0 0" }}>Gestiona accesos y permisos temporales</p>
        </div>
        <button
          onClick={() => setModal(true)}
          style={{ background: colores.naranja, color: "white", border: "none", padding: "10px 20px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 12px rgba(249,115,22,0.2)", transition: "0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = colores.naranjaOscuro}
          onMouseLeave={(e) => e.currentTarget.style.background = colores.naranja}
        >
          <Plus size={18} /> Nuevo Permiso
        </button>
      </div>

      {/* CARD PRINCIPAL - ESTADO ACTUAL */}
      <div style={{ background: `linear-gradient(135deg, ${colores.naranja} 0%, ${colores.naranjaOscuro} 100%)`, borderRadius: "28px", padding: "2rem", color: "white", boxShadow: "0 10px 25px rgba(234,88,12,0.2)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", padding: "15px", borderRadius: "20px" }}>
            <Car size={42} strokeWidth={1.5} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 800, opacity: 0.8, letterSpacing: "1px" }}>Espacio Asignado</span>
            <h2 style={{ margin: "2px 0", fontSize: "2rem", fontWeight: 800 }}>{data.estacionamiento}</h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.15)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>
               {data.permisos.some(p => p.estado === "Activo") ? "• En uso actualmente" : "• Espacio libre"}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE PERMISOS ACTIVOS */}
      <h3 style={{ color: colores.slate, fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Permisos Activos</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.2rem", marginBottom: "3rem" }}>
        {data.permisos.length === 0 ? (
          <div style={{ gridColumn: "1/-1", padding: "3rem", textAlign: "center", background: "white", borderRadius: "24px", border: "1px dashed #e2e8f0", color: colores.lightSlate }}>
            No hay permisos activos generados.
          </div>
        ) : (
          data.permisos.map((p) => (
            <div key={p.id} style={{ background: "white", borderRadius: "24px", padding: "1.5rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", position: "relative", transition: "0.3s" }}>
              <button
                onClick={() => eliminarPermiso(p.id)}
                style={{ position: "absolute", top: "15px", right: "15px", background: "#fee2e2", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer", color: "#dc2626" }}
              >
                <Trash2 size={16}/>
              </button>
              
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ margin: 0, color: colores.slate, fontSize: "1.1rem" }}>{p.nombre}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: colores.naranja, fontWeight: "700", marginTop: "4px" }}>
                  <Car size={14} /> {p.placa}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: colores.lightSlate }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar size={14} /> {new Date(p.inicio).toLocaleDateString()}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={14} /> {new Date(p.inicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(p.fin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>

              <div style={{ marginTop: "1.2rem", padding: "12px", background: "#f8fafc", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                <QrCode size={32} color={colores.slate} />
                <div style={{ fontSize: "0.7rem", color: colores.lightSlate, lineHeight: "1.2" }}>
                  Escanea para validar el acceso en garita
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* HISTORIAL ESTILO LISTA MINIMALISTA */}
      <h3 style={{ color: colores.slate, fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Historial Reciente</h3>
      <div style={{ background: "white", borderRadius: "24px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
        {[
          { nombre: "Carlos López", placa: "AAA-1111", fecha: "10/04/2026" },
          { nombre: "María Torres", placa: "BBB-2222", fecha: "12/04/2026" },
          { nombre: "Luis Gómez", placa: "CCC-3333", fecha: "15/04/2026" }
        ].map((h, i) => (
          <div key={i} style={{ padding: "1rem 1.5rem", borderBottom: i === 2 ? "none" : "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ background: "#f1f5f9", padding: "8px", borderRadius: "10px", color: colores.lightSlate }}>
                <User size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: colores.slate, fontSize: "0.95rem" }}>{h.nombre}</p>
                <p style={{ margin: 0, color: colores.lightSlate, fontSize: "0.8rem" }}>Placa: {h.placa}</p>
              </div>
            </div>
            <span style={{ color: colores.indigoPalido, fontSize: "0.8rem", fontWeight: "600" }}>{h.fecha}</span>
          </div>
        ))}
      </div>

            {/* MODAL  */}
      {modal && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(15, 23, 42, 0.4)", 
          backdropFilter: "blur(8px)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 2000 
        }}>
          <div style={{ 
            background: "#ffffff", 
            padding: "2.2rem", 
            borderRadius: "28px", 
            width: "90%", 
            maxWidth: "400px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", // Sombra suave, no negra sólida
            animation: "modalFadeUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: "none" // Aseguramos que no haya bordes negros en el contenedor
          }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h3 style={{ margin: 0, color: colores.slate, fontSize: "1.4rem", fontWeight: 800 }}>Nuevo Permiso</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: colores.lightSlate }}>Asigna acceso temporal</p>
              </div>
              <button 
                onClick={() => setModal(false)} 
                style={{ background: "#f1f5f9", border: "none", borderRadius: "12px", padding: "8px", cursor: "pointer", color: colores.lightSlate }}
              >
                <X size={20}/>
              </button>
            </div>

            {/* FORMULARIO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* INPUT NOMBRE */}
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 700, color: colores.indigoPalido, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>
                  Nombre del Invitado
                </label>
                <input 
                  name="nombre" 
                  placeholder="Ej. Carlos Rojas" 
                  onChange={handleChange} 
                  style={{ 
                    width: "100%", 
                    padding: "10px 0", 
                    border: "none", 
                    borderBottom: "2px solid #e2e8f0", 
                    outline: "none", 
                    fontSize: "1rem", 
                    color: "#334155", 
                    background: "transparent" 
                  }} 
                  onFocus={e => e.target.style.borderBottomColor = colores.naranja}
                  onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"}
                />
              </div>

              {/* INPUT PLACA */}
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 700, color: colores.indigoPalido, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>
                  Placa del Vehículo
                </label>
                <input 
                  name="placa" 
                  placeholder="ABC-123" 
                  onChange={handleChange} 
                  style={{ 
                    width: "100%", 
                    padding: "10px 0", 
                    border: "none", 
                    borderBottom: "2px solid #e2e8f0", 
                    outline: "none", 
                    fontSize: "1rem", 
                    color: "#334155", 
                    background: "transparent" 
                  }} 
                  onFocus={e => e.target.style.borderBottomColor = colores.naranja}
                  onBlur={e => e.target.style.borderBottomColor = "#e2e8f0"}
                />
              </div>

              {/* SECCIÓN HORARIOS */}
              <div style={{ marginTop: "5px", padding: "15px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Clock size={14} color={colores.naranja} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: colores.indigoPalido, textTransform: "uppercase" }}>Vigencia</span>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input 
                    name="inicio" 
                    type="datetime-local" 
                    onChange={handleChange} 
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.75rem", outline: "none", color: colores.lightSlate }} 
                  />
                  <input 
                    name="fin" 
                    type="datetime-local" 
                    onChange={handleChange} 
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.75rem", outline: "none", color: colores.lightSlate }} 
                  />
                </div>
              </div>
            </div>

            {/* BOTÓN FINAL */}
            <button
              onClick={generarPermiso}
              style={{ 
                marginTop: "2rem", 
                width: "100%", 
                background: colores.naranja, 
                color: "white", 
                border: "none", 
                padding: "1rem", 
                borderRadius: "16px", 
                fontWeight: "700", 
                cursor: "pointer", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                gap: "10px",
                boxShadow: `0 10px 20px -5px rgba(249,115,22,0.3)`
              }}
            >
              <Send size={18}/> Generar Acceso
            </button>
          </div>
        </div>
      )}
      {/* ESTILOS GLOBALES */}
      <style>{`
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        input:focus { border-color: ${colores.naranja} !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
      `}</style>
    </div>
  );
}