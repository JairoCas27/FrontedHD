import { useState, useEffect } from "react";
import { FiActivity, FiSearch, FiTruck, FiShield, FiCheckCircle, FiAlertCircle, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import { verifyVehiclePlate, getSecurityParkingSlots } from "../../services/api";

const estiloTh = {
  padding: "0.85rem 1rem",
  textAlign: "center",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const estiloTd = { padding: "0.85rem 1rem", color: "#64748b", fontSize: "0.9rem", textAlign: "center", verticalAlign: "middle" };

const estiloLabel = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
};

export default function VehiculosSeguridad() {
  const [placaBusqueda, setPlacaBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const data = await getSecurityParkingSlots();
        setSlots(data || []);
      } catch (err) {
        toast.error(err.message || "Error al cargar estacionamientos");
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, []);

  const buscarVehiculo = async () => {
    setResultado(null);
    if (!placaBusqueda.trim()) {
      toast.warning("Ingrese una placa para buscar");
      return;
    }
    setLoadingBusqueda(true);
    try {
      const data = await verifyVehiclePlate(placaBusqueda.trim().toUpperCase());
      setResultado(data);
      toast.success("Vehículo encontrado");
    } catch (err) {
      toast.error(err.message || "Vehículo no registrado en el sistema");
    } finally {
      setLoadingBusqueda(false);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Estacionamientos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Verificación de vehículos y disponibilidad de slots
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiSearch size={20} color="#64748b" />
          Buscar por Placa
        </h5>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaBusqueda}
            onChange={(e) => { setPlacaBusqueda(e.target.value.toUpperCase()); setResultado(null); }}
            onKeyDown={(e) => e.key === "Enter" && buscarVehiculo()}
            style={{
              flex: 1, minWidth: "200px", padding: "0.75rem 1rem",
              borderRadius: "10px", border: "1px solid #e2e8f0",
              fontSize: "1.1rem", letterSpacing: "2px", outline: "none",
              background: "#f8fafc", color: "#1e293b", fontWeight: 700,
            }}
          />
          <button
            onClick={buscarVehiculo}
            disabled={loadingBusqueda}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: loadingBusqueda ? "#cbd5e1" : "rgb(34,197,94)",
              color: "#fff", border: "none", borderRadius: "10px",
              fontWeight: 700, cursor: loadingBusqueda ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "all 0.2s ease",
            }}
          >
            <FiSearch size={18} />
            {loadingBusqueda ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {resultado && (
          <div style={{ padding: "1.5rem", borderRadius: "12px", backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <FiCheckCircle size={18} color="#16a34a" />
              <span style={{ fontWeight: 700, color: "#166534", fontSize: "0.95rem" }}>Vehículo Autorizado</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Propietario", value: resultado.nombrePropietario },
                { label: "Placa", value: resultado.placa },
                { label: "Marca", value: resultado.marca },
                { label: "Modelo", value: resultado.modelo },
                { label: "Color", value: resultado.color },
                { label: "Tipo", value: resultado.tipo },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={estiloLabel}>{label}</p>
                  <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiMapPin size={20} color="#64748b" />
            Slots de Estacionamiento
          </h5>
          <span style={{ padding: "0.35rem 0.75rem", backgroundColor: "#f1f5f9", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
            {slots.length} slots
          </span>
        </div>

        {loadingSlots ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiTruck size={36} style={{ display: "block", margin: "0 auto 1rem", opacity: 0.35 }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Cargando slots...</p>
          </div>
        ) : slots.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={40} style={{ display: "block", margin: "0 auto 1rem", opacity: 0.35 }} />
            <p style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>Sin slots disponibles</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Los slots aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["N°", "Tipo Vehículo", "Cap. Máxima", "Cantidad Actual", "Disponible"].map((h) => (
                    <th key={h} style={estiloTh}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...estiloTd, fontWeight: 700, color: "#1e293b", fontFamily: "monospace" }}>{slot.numero}</td>
                    <td style={estiloTd}>{slot.tipoVehiculo}</td>
                    <td style={estiloTd}>{slot.capacidadMaxima}</td>
                    <td style={estiloTd}>{slot.cantidadActual}</td>
                    <td style={estiloTd}>
                      <span style={{
                        padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                        backgroundColor: slot.disponible ? "#dcfce7" : "#fee2e2",
                        color: slot.disponible ? "#166534" : "#991b1b",
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      }}>
                        {slot.disponible ? <FiCheckCircle size={11} /> : <FiAlertCircle size={11} />}
                        {slot.disponible ? "Disponible" : "Lleno"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}