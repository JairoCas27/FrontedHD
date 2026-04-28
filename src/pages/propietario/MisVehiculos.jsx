import { useState, useEffect } from "react";
import { FiTruck } from "react-icons/fi";
import { Car, Send, Save, X } from "lucide-react";

export default function MisVehiculos() {
  const getVehiculo = () => {
    const data = localStorage.getItem("vehiculo");
    return data ? JSON.parse(data) : {
      estacionamiento: "A-1234",
      marca: "Toyota",
      modelo: "Camry 2022",
      color: "Plata",
      placa: "ABC-1234",
    };
  };
  const [vehiculo, setVehiculo] = useState(getVehiculo());
  const [form, setForm] = useState(vehiculo);
  const [modal, setModal] = useState(false);
  const [animarSalida, setAnimarSalida] = useState(false);
  useEffect(() => {
    setForm(vehiculo);
  }, [vehiculo]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const guardar = () => {
    localStorage.setItem("vehiculo", JSON.stringify(form));
    setVehiculo(form);
    alert("Cambios guardados correctamente");
    cerrarModal();
  };
  const solicitar = () => {
    alert("Solicitud enviada correctamente");
  };
  const cerrarModal = () => {
    setAnimarSalida(true);
    setTimeout(() => {
      setModal(false);
      setAnimarSalida(false);
    }, 200);
  };
  const colores = {
    naranjaPrincipal: "#f97316",
    naranjaOscuro: "#ea580c",
    naranjaSuave: "#ffedd5",
    textoCuerpo: "#475569"
  };
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1rem' }}>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Mis Vehículos</h1>
        <p style={{ color: "#64748b", fontSize: "1rem" }}>Registro y gestión de tus vehículos</p>
      </div>
      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* CARD MEJORADA */}
        <div
          style={{ background: `linear-gradient(135deg, ${colores.naranjaPrincipal} 0%, ${colores.naranjaOscuro} 100%)`, borderRadius: "24px", padding: "2rem", color: "white", boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 20px 30px -10px rgba(249, 115, 22, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(249, 115, 22, 0.4)";
          }}
        >
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", padding: "12px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.3)" }}>
              <Car size={40} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.4rem", letterSpacing: "0.5px" }}>{vehiculo.estacionamiento}</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.9, fontWeight: 500 }}>UBICACIÓN ASIGNADA</p>
            </div>
          </div>
          <div style={{ background: "rgba(0, 0, 0, 0.05)", padding: "1.2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Marca", value: vehiculo.marca },
              { label: "Modelo", value: vehiculo.modelo },
              { label: "Color", value: vehiculo.color },
              { label: "Placa", value: vehiculo.placa }
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4px" }}>
                <span style={{ opacity: 0.8, fontSize: "0.9rem" }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setModal(true)}
            style={{ width: "100%", background: "white", padding: "0.8rem", borderRadius: "12px", border: "none", color: colores.naranjaOscuro, fontWeight: "700", cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            Editar Información
          </button>
        </div>
      </div>
      {/* MODAL REFINADO */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "28px", width: "90%", maxWidth: "380px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transform: animarSalida ? "scale(0.95) opacity(0)" : "scale(1) opacity(1)", transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
              <div>
                <h3 style={{ color: "#1e293b", margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Editar Vehículo</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Actualiza los detalles de tu registro</p>
              </div>
              <button onClick={cerrarModal} style={{ background: "#f1f5f9", border: "none", borderRadius: "12px", padding: "8px", cursor: "pointer", color: "#64748b", display: "flex" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {[
                { name: "marca", label: "Marca" },
                { name: "modelo", label: "Modelo" },
                { name: "color", label: "Color" },
                { name: "placa", label: "Placa" }
              ].map((field) => (
                <div key={field.name} style={{ position: "relative" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", display: "block" }}>{field.label}</label>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "2px solid #e2e8f0", outline: "none", fontSize: "1rem", color: "#334155", transition: "border-color 0.2s", boxSizing: "border-box", background: "transparent" }}
                    onFocus={(e) => e.target.style.borderBottomColor = "#f97316"}
                    onBlur={(e) => e.target.style.borderBottomColor = "#e2e8f0"}
                  />
                </div>
              ))}
              <div style={{ background: "#f8fafc", padding: "10px 15px", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>ESTACIONAMIENTO</span>
                <span style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: 500 }}>{form.estacionamiento}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "2.5rem" }}>
              <button onClick={solicitar} style={{ flex: 1, background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", padding: "0.8rem", borderRadius: "14px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "0.2s" }}
                onMouseEnter={(e) => e.target.style.background = "#f8fafc"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                <Send size={16}/> Solicitar
              </button>
              <button onClick={guardar} style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "0.8rem", borderRadius: "14px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 8px 15px rgba(249, 115, 22, 0.2)", transition: "0.2s" }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                <Save size={16}/> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      
      
      <div style={{ background: "#f8fafc", border: "2px dashed #e2e8f0", borderRadius: "24px", padding: "3rem 2rem", textAlign: "center", marginTop: "2rem", color: "#94a3b8" }}>
        <FiTruck size={48} style={{ color: "#94a3b8"}} />
        <p style={{ fontWeight: 500 }}>Módulo de carga en construcción</p>
      </div>
    </div>
  );
}