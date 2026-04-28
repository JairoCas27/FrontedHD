import { useState, useEffect } from "react";
import { FiActivity, FiSearch, FiTruck, FiUser, FiShield } from "react-icons/fi";

export default function VehiculosSeguridad() {
  const [placaBusqueda, setPlacaBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [todosVehiculos, setTodosVehiculos] = useState([]);

  // Cargar vehículos al iniciar
  useEffect(() => {
    const residente = JSON.parse(localStorage.getItem("urbanParkUser") || "null");
    const vehiculos = [];
    
    if (residente && residente.vehicle) {
      vehiculos.push({
        placa: residente.vehicle.placa,
        modelo: residente.vehicle.modelo,
        color: residente.vehicle.color,
        residente: `${residente.nombres} ${residente.apellidos}`,
        dni: residente.dni,
        celular: residente.celular
      });
    }
    
    setTodosVehiculos(vehiculos);
  }, []);

  const buscarVehiculo = () => {
    setMensaje(null);
    setResultado(null);
    
    if (!placaBusqueda.trim()) {
      setMensaje({ tipo: "warning", texto: "Ingrese una placa para buscar" });
      return;
    }

    const residente = JSON.parse(localStorage.getItem("urbanParkUser") || "null");
    
    if (residente && residente.vehicle && residente.vehicle.placa.toUpperCase() === placaBusqueda.toUpperCase()) {
      setResultado(residente);
      setMensaje({ tipo: "success", texto: "✅ Vehículo encontrado" });
    } else {
      setMensaje({ tipo: "danger", texto: "❌ Vehículo no registrado en el sistema" });
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Vehículos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Verificación de vehículos registrados</p>
      </div>

      {/* BÚSQUEDA */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiSearch size={20} />
          Buscar por Placa
        </h5>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaBusqueda}
            onChange={(e) => setPlacaBusqueda(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "1.1rem",
              letterSpacing: "1px",
              outline: "none"
            }}
          />
          <button
            onClick={buscarVehiculo}
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
            <FiSearch size={18} />
            Buscar
          </button>
        </div>

        {mensaje && (
          <div style={{
            padding: "1rem",
            borderRadius: "10px",
            marginBottom: "1rem",
            backgroundColor: mensaje.tipo === "success" ? "#f0fdf4" : mensaje.tipo === "danger" ? "#fef2f2" : "#fffbeb",
            border: `1px solid ${mensaje.tipo === "success" ? "#10b981" : mensaje.tipo === "danger" ? "#ef4444" : "#f59e0b"}`,
            color: mensaje.tipo === "success" ? "#166534" : mensaje.tipo === "danger" ? "#991b1b" : "#92400e"
          }}>
            {mensaje.texto}
          </div>
        )}

        {/* RESULTADO DE BÚSQUEDA */}
        {resultado && (
          <div style={{
            padding: "1.5rem",
            borderRadius: "12px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #10b981"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <FiShield size={20} color="#10b981" />
              <h6 style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>Vehículo Autorizado</h6>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Residente</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{resultado.nombres} {resultado.apellidos}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>DNI</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{resultado.dni}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Celular</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{resultado.celular}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Placa</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{resultado.vehicle?.placa}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Modelo</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{resultado.vehicle?.modelo}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Color</p>
                <p style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>{resultado.vehicle?.color}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LISTA DE VEHÍCULOS REGISTRADOS */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiTruck size={20} />
            Vehículos Registrados
          </h5>
          <span style={{
            padding: "0.35rem 0.75rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#64748b"
          }}>
            {todosVehiculos.length} vehículos
          </span>
        </div>

        {todosVehiculos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No hay vehículos registrados</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Los vehículos aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Placa</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Modelo</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Color</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Residente</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>DNI</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {todosVehiculos.map((vehiculo, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1e293b" }}>{vehiculo.placa}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{vehiculo.modelo}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{vehiculo.color}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{vehiculo.residente}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{vehiculo.dni}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: "#dcfce7",
                        color: "#166534"
                      }}>
                        Activo
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