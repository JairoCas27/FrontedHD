import { useState } from "react";
import { FiActivity, FiShield, FiUser, FiHome, FiDollarSign, FiSearch, FiFilter, FiTrash2, FiClock, FiX } from "react-icons/fi";
import { Card, Table, Button, Badge, Form, InputGroup, Row, Col } from "react-bootstrap";

export default function AuditoriaGlobal() {
  const [logs, setLogs] = useState([
    { id: 1, usuario: "Bradd (SuperAdmin)", accion: "Creación de Condominio", detalle: "Jerarquía Residencial I - Puente Piedra", fecha: "2026-04-27", hora: "10:30 AM", tipo: "Sistema", icono: <FiHome /> },
    { id: 2, usuario: "Sistema", accion: "Pago Recibido", detalle: "Mensualidad Urban Park - S/ 450.00", fecha: "2026-04-27", hora: "09:15 AM", tipo: "Financiero", icono: <FiDollarSign /> },
    { id: 3, usuario: "Carlos Martínez", accion: "Inicio de Sesión", detalle: "Acceso desde IP 190.235.12.45", fecha: "2026-04-26", hora: "08:00 AM", tipo: "Seguridad", icono: <FiShield /> },
    { id: 4, usuario: "Bradd (SuperAdmin)", accion: "Eliminación de Usuario", detalle: "Admin de pruebas eliminado", fecha: "2026-04-25", hora: "04:20 PM", tipo: "Seguridad", icono: <FiUser /> },
  ]);

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const handleLimpiarLogs = () => {
    if (window.confirm("¿Desea vaciar el historial?")) setLogs([]);
  };

  const getStyleTipo = (tipo) => {
    switch (tipo) {
      case "Seguridad": return { color: "#f43f5e", bg: "#fff1f2" }; // Rosa-Rojo
      case "Sistema": return { color: "#3b82f6", bg: "#eff6ff" };    // Azul Royal
      case "Financiero": return { color: "#10b981", bg: "#f0fdf4" }; // Esmeralda
      default: return { color: "#64748b", bg: "#f8fafc" };
    }
  };

  const logsFiltrados = logs.filter(log => {
    const coincideTexto = log.usuario.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                          log.accion.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideFecha = filtroFecha === "" || log.fecha === filtroFecha;
    return coincideTexto && coincideFecha;
  });

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#4f46e5", margin: 0 }}>
            Auditoría Global
          </h1>
          <p style={{ color: "#0ea5e9", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>
            Historial de operaciones del sistema
          </p>
        </div>
        <Button 
          variant="outline-danger" 
          onClick={handleLimpiarLogs}
          className="d-flex align-items-center gap-2 px-3 shadow-sm"
          style={{ fontSize: "0.85rem", borderRadius: "10px", fontWeight: 600, border: "2px solid #fee2e2" }}
        >
          <FiTrash2 size={16}/> Limpiar Historial
        </Button>
      </div>

      {/* BARRA DE FILTROS (AZUL CLARO) */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "14px", borderLeft: "5px solid #3b82f6" }}>
        <Card.Body className="py-3">
          <Row className="g-3 align-items-center">
            <Col md={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-0"><FiSearch size={18} style={{ color: "#3b82f6" }}/></InputGroup.Text>
                <Form.Control 
                  placeholder="Buscar por nombre o acción..." 
                  className="border-0 shadow-none fw-medium text-dark"
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  style={{ fontSize: "0.95rem" }}
                />
              </InputGroup>
            </Col>
            <Col md={5}>
              <div className="d-flex align-items-center bg-white border rounded-3 px-3 py-1" style={{ borderColor: "#e2e8f0" }}>
                <FiFilter className="text-info me-2" size={16} />
                <Form.Control 
                  type="date" 
                  className="border-0 bg-transparent shadow-none fw-bold text-info"
                  style={{ fontSize: "0.85rem" }}
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
                {filtroFecha && <FiX className="text-danger ms-2" style={{ cursor: "pointer" }} onClick={() => setFiltroFecha("")} />}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABLA CON ENCABEZADO AZUL CLARO */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "18px", overflow: "hidden" }}>
        <Table responsive hover className="align-middle m-0">
          <thead style={{ background: "#3b82f6" }}>
            <tr className="text-white small text-uppercase fw-bold" style={{ letterSpacing: "0.5px" }}>
              <th className="py-3 px-4 border-0">Acción Realizada</th>
              <th className="py-3 border-0">Responsable</th>
              <th className="py-3 border-0">Detalles</th>
              <th className="py-3 border-0">Timestamp</th>
              <th className="py-3 text-center border-0">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.map((log) => {
              const estilos = getStyleTipo(log.tipo);
              return (
                <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td className="py-4 px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ 
                        background: estilos.bg, 
                        color: estilos.color, 
                        padding: "10px", 
                        borderRadius: "12px",
                        boxShadow: `0 3px 8px ${estilos.color}15`
                      }}>
                        {log.icono}
                      </div>
                      <div className="fw-bold" style={{ color: "#1e293b" }}>{log.accion}</div>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold" style={{ color: "#0ea5e9" }}>{log.usuario}</span>
                  </td>
                  <td className="text-muted small" style={{ maxWidth: "250px" }}>
                    {log.detalle}
                  </td>
                  <td>
                    <div className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>{log.fecha}</div>
                    <div className="text-muted d-flex align-items-center gap-1 extra-small">
                      <FiClock size={12} className="text-info" /> {log.hora}
                    </div>
                  </td>
                  <td className="text-center">
                    <Badge 
                      style={{ 
                        backgroundColor: estilos.bg, 
                        color: estilos.color, 
                        padding: "8px 12px", 
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        border: `1px solid ${estilos.color}20`
                      }}
                    >
                      {log.tipo}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}