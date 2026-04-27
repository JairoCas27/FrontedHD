import { useState } from "react";
import { FiCreditCard, FiCalendar, FiTrendingUp, FiAlertCircle, FiCheck, FiMoreVertical, FiDownload, FiTrash2, FiBell } from "react-icons/fi";
import { Card, Button, Table, Row, Col, Badge, Dropdown } from "react-bootstrap";

export default function Suscripciones() {
  // --- ESTADO DE FACTURACIÓN ---
  const [facturas, setFacturas] = useState([
    { id: "INV-001", cliente: "Urban Park - Puente Piedra", plan: "Premium", monto: "S/ 450.00", fecha: "20/04/2026", estado: "Pagado" },
    { id: "INV-002", cliente: "Residencial Arboleda - Los Olivos", plan: "Básico", monto: "S/ 150.00", fecha: "25/04/2026", estado: "Pendiente" },
    { id: "INV-003", cliente: "Villa Sol - Puente Piedra", plan: "Pro", monto: "S/ 300.00", fecha: "15/04/2026", estado: "Vencido" },
  ]);

  // --- FUNCIONES DE ACCIÓN ---

  // Simular descarga de reporte
  const handleDownloadReport = () => {
    const confirmDownload = window.confirm("¿Desea generar y descargar el reporte financiero del mes de Abril 2026?");
    if (confirmDownload) {
      alert("Generando archivo PDF/Excel... La descarga comenzará en breve.");
    }
  };

  // Marcar como pagado
  const marcarComoPagado = (id) => {
    setFacturas(facturas.map(f => 
      f.id === id ? { ...f, estado: "Pagado" } : f
    ));
    alert(`El recibo ${id} ha sido actualizado a 'Pagado'`);
  };

  // Notificar al cliente
  const notificarCliente = (cliente) => {
    alert(`Se ha enviado una notificación de cobro por correo y WhatsApp a: ${cliente}`);
  };

  // Eliminar recibo
  const eliminarRecibo = (id) => {
    if (window.confirm(`¿Está seguro de eliminar el registro ${id}?`)) {
      setFacturas(facturas.filter(f => f.id !== id));
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER */}
      <div className="mb-4">
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e1b4b" }}>Suscripciones SaaS</h1>
        <p className="text-muted small">Monitoreo de ingresos y estados de cuenta por condominio</p>
      </div>

      {/* KPI CARDS */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "16px" }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#dcfce7", color: "#15803d", padding: "12px", borderRadius: "12px" }}>
                <FiTrendingUp size={24} />
              </div>
              <div>
                <div className="text-muted small fw-bold">INGRESOS TOTALES</div>
                <h4 className="fw-bold m-0 text-dark">S/ 12,850.00</h4>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "16px" }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "12px" }}>
                <FiAlertCircle size={24} />
              </div>
              <div>
                <div className="text-muted small fw-bold">VENCIDOS</div>
                <h4 className="fw-bold m-0 text-dark">
                  {facturas.filter(f => f.estado === "Vencido").length} Condominios
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "16px" }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "12px", borderRadius: "12px" }}>
                <FiCreditCard size={24} />
              </div>
              <div>
                <div className="text-muted small fw-bold">MÉTODO PREDOMINANTE</div>
                <h4 className="fw-bold m-0 text-dark">Transferencia</h4>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* DETALLE DE FACTURACIÓN */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "20px" }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0 text-dark">Historial de Recibos</h5>
            <Button 
              onClick={handleDownloadReport}
              variant="outline-primary" 
              size="sm" 
              style={{ borderRadius: "8px" }}
              className="d-flex align-items-center gap-2"
            >
              <FiDownload /> Descargar Reporte
            </Button>
          </div>

          <Table responsive hover borderless className="align-middle">
            <thead className="bg-light">
              <tr className="text-muted small text-uppercase">
                <th className="py-3 px-4">Recibo ID</th>
                <th>Cliente Condominio</th>
                <th>Monto</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th className="text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id} className="border-bottom">
                  <td className="py-4 px-4 fw-bold text-primary">{f.id}</td>
                  <td>
                    <div className="fw-bold text-dark">{f.cliente}</div>
                    <div className="text-muted extra-small">Plan: {f.plan}</div>
                  </td>
                  <td className="fw-bold">{f.monto}</td>
                  <td>
                    <div className="small d-flex align-items-center gap-1">
                      <FiCalendar size={14} className="text-muted" /> {f.fecha}
                    </div>
                  </td>
                  <td>
                    <Badge 
                      bg={f.estado === "Pagado" ? "success" : f.estado === "Pendiente" ? "warning" : "danger"}
                      className={`bg-opacity-10 text-${f.estado === "Pagado" ? "success" : f.estado === "Pendiente" ? "warning" : "danger"} px-3 py-2`}
                    >
                      {f.estado === "Pagado" ? <FiCheck className="me-1"/> : ""}
                      {f.estado}
                    </Badge>
                  </td>
                  <td className="text-end px-4">
                    <Dropdown align="end">
                      <Dropdown.Toggle as="button" className="btn border-0 p-0 bg-transparent text-muted shadow-none">
                        <FiMoreVertical size={20} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="shadow border-0 rounded-3 p-2">
                        <Dropdown.Item onClick={() => marcarComoPagado(f.id)} className="d-flex align-items-center gap-2 py-2">
                          <FiCheck className="text-success" /> Marcar como Pagado
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => notificarCliente(f.cliente)} className="d-flex align-items-center gap-2 py-2">
                          <FiBell className="text-primary" /> Notificar Cliente
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => eliminarRecibo(f.id)} className="d-flex align-items-center gap-2 py-2 text-danger">
                          <FiTrash2 /> Eliminar Registro
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
              {facturas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">No hay registros de facturación.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}