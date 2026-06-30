import { useState, useEffect } from "react";
import { FiActivity, FiPackage, FiLogOut, FiUsers, FiPlus, FiClock, FiUser, FiHash } from "react-icons/fi";
import { toast } from "react-toastify";
import { getSecurityActiveLoans, createAssetLoan, returnAssetLoan } from "../../services/api";

const estiloLabel = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
};

const estiloInput = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.9rem",
  outline: "none",
  background: "#f8fafc",
  color: "#1e293b",
  boxSizing: "border-box",
};

const estiloTh = {
  padding: "0.85rem 1rem",
  textAlign: "left",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const estiloTd = { padding: "0.85rem 1rem", color: "#64748b", fontSize: "0.9rem" };

export default function PrestamosSeguridad() {
  const [prestamos, setPrestamos] = useState([]);
  const [loadingPrestamos, setLoadingPrestamos] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(null);
  const [formData, setFormData] = useState({
    codigoCarrito: "",
    numeroApartamento: "",
    nombreSolicitante: "",
    dniSolicitante: "",
  });

  const fetchPrestamos = async () => {
    setLoadingPrestamos(true);
    try {
      const data = await getSecurityActiveLoans();
      setPrestamos(data || []);
    } catch (err) {
      toast.error(err.message || "Error al cargar préstamos activos");
    } finally {
      setLoadingPrestamos(false);
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.codigoCarrito || !formData.numeroApartamento || !formData.nombreSolicitante || !formData.dniSolicitante) {
      toast.warning("Completa todos los campos");
      return;
    }
    setLoadingSubmit(true);
    try {
      await createAssetLoan({
        codigoCarrito: formData.codigoCarrito.trim().toUpperCase(),
        numeroApartamento: Number(formData.numeroApartamento),
        nombreSolicitante: formData.nombreSolicitante.trim(),
        dniSolicitante: formData.dniSolicitante.trim(),
      });
      toast.success("Préstamo registrado correctamente");
      setFormData({ codigoCarrito: "", numeroApartamento: "", nombreSolicitante: "", dniSolicitante: "" });
      await fetchPrestamos();
    } catch (err) {
      toast.error(err.message || "Error al registrar préstamo");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleReturn = async (id) => {
    setLoadingReturn(id);
    try {
      await returnAssetLoan(id);
      toast.success("Devolución registrada correctamente");
      setPrestamos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err.message || "Error al registrar devolución");
    } finally {
      setLoadingReturn(null);
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "—";
    try {
      return new Date(fechaStr).toLocaleString();
    } catch {
      return fechaStr;
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Préstamos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Gestión de préstamos de carritos y bienes comunes
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiPlus size={20} color="#64748b" />
          Nuevo Préstamo
        </h5>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={estiloLabel}>Código Carrito</label>
              <input
                type="text"
                name="codigoCarrito"
                value={formData.codigoCarrito}
                onChange={handleChange}
                placeholder="Ej: CART-01"
                style={estiloInput}
              />
            </div>
            <div>
              <label style={estiloLabel}>N° Apartamento</label>
              <input
                type="number"
                name="numeroApartamento"
                value={formData.numeroApartamento}
                onChange={handleChange}
                placeholder="Ej: 101"
                style={estiloInput}
              />
            </div>
            <div>
              <label style={estiloLabel}>Nombre Solicitante</label>
              <input
                type="text"
                name="nombreSolicitante"
                value={formData.nombreSolicitante}
                onChange={handleChange}
                placeholder="Nombre completo"
                style={estiloInput}
              />
            </div>
            <div>
              <label style={estiloLabel}>DNI Solicitante</label>
              <input
                type="text"
                name="dniSolicitante"
                value={formData.dniSolicitante}
                onChange={handleChange}
                placeholder="Ej: 73652148"
                style={estiloInput}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingSubmit}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: loadingSubmit ? "#cbd5e1" : "rgb(34,197,94)",
              color: "#fff", border: "none", borderRadius: "10px",
              fontWeight: 700, fontSize: "0.9rem",
              cursor: loadingSubmit ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "all 0.2s ease",
            }}
          >
            <FiPackage size={16} />
            {loadingSubmit ? "Registrando..." : "Registrar Préstamo"}
          </button>
        </form>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUsers size={20} color="#64748b" />
            Préstamos Activos
          </h5>
          <span style={{ padding: "0.35rem 0.75rem", backgroundColor: "#f1f5f9", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
            {prestamos.length} activos
          </span>
        </div>

        {loadingPrestamos ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={36} style={{ display: "block", margin: "0 auto 1rem", opacity: 0.35 }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Cargando préstamos...</p>
          </div>
        ) : prestamos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={40} style={{ display: "block", margin: "0 auto 1rem", opacity: 0.35 }} />
            <p style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>Sin préstamos activos</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Los préstamos aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["Carrito", "Solicitante", "DNI", "Fecha Préstamo", "Penalización", "Acción"].map((h) => (
                    <th key={h} style={estiloTh}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prestamos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...estiloTd, fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FiHash size={13} color="#94a3b8" />
                      {p.codigoCarrito}
                    </td>
                    <td style={estiloTd}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FiUser size={13} color="#94a3b8" />
                        {p.nombreSolicitante}
                      </span>
                    </td>
                    <td style={{ ...estiloTd, fontFamily: "monospace" }}>{p.dniSolicitante}</td>
                    <td style={estiloTd}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FiClock size={13} color="#94a3b8" />
                        {formatFecha(p.fechaPrestamo)}
                      </span>
                    </td>
                    <td style={estiloTd}>
                      {p.penalizacion > 0 ? (
                        <span style={{ color: "#ef4444", fontWeight: 700 }}>S/ {p.penalizacion.toFixed(2)}</span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td style={estiloTd}>
                      <button
                        onClick={() => handleReturn(p.id)}
                        disabled={loadingReturn === p.id}
                        style={{
                          padding: "0.45rem 1rem",
                          backgroundColor: loadingReturn === p.id ? "#cbd5e1" : "#ef4444",
                          color: "#fff", border: "none", borderRadius: "8px",
                          fontWeight: 600, fontSize: "0.82rem",
                          cursor: loadingReturn === p.id ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", gap: "0.4rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <FiLogOut size={13} />
                        {loadingReturn === p.id ? "..." : "Devolver"}
                      </button>
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