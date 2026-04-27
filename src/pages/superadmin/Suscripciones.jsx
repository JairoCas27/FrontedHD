import { useState } from "react";
import { FiCreditCard, FiCalendar, FiTrendingUp, FiAlertCircle, FiCheck, FiMoreVertical, FiDownload, FiTrash2, FiBell, FiInfo } from "react-icons/fi";
import { Card, Button, Table, Row, Col, Badge, Dropdown, Modal } from "react-bootstrap";

export default function Suscripciones() {
  // --- ESTADOS ---
  const [facturas, setFacturas] = useState([
    { id: "INV-001", cliente: "Jerarquía Residencial I", plan: "Premium", monto: "S/ 450.00", fecha: "2026-04-20", estado: "Pagado" },
    { id: "INV-002", cliente: "Urban Park Sur", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-25", estado: "Pendiente" },
    { id: "INV-003", cliente: "Residencial Las Palmas", plan: "Pro", monto: "S/ 300.00", fecha: "2026-04-15", estado: "Vencido" },
    { id: "INV-004", cliente: "Condominio El Olivar", plan: "Premium", monto: "S/ 450.00", fecha: "2026-04-10", estado: "Pagado" },
    { id: "INV-005", cliente: "Altos de Comas", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-28", estado: "Pendiente" },
    { id: "INV-006", cliente: "Villa Marina", plan: "Premium", monto: "S/ 450.00", fecha: "2026-04-05", estado: "Pagado" },
    { id: "INV-007", cliente: "Parque San Miguel", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-12", estado: "Vencido" },
    { id: "INV-008", cliente: "Residencial San Felipe", plan: "Premium", monto: "S/ 450.00", fecha: "2026-04-18", estado: "Pagado" },
    { id: "INV-009", cliente: "Praderas del Norte", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-22", estado: "Pendiente" },
    { id: "INV-010", cliente: "Mirador de la Costa", plan: "Premium", monto: "S/ 450.00", fecha: "2026-04-01", estado: "Pagado" },
    { id: "INV-011", cliente: "Jerarquía Residencial I", plan: "Premium", monto: "S/ 450.00", fecha: "2026-03-20", estado: "Pagado" },
    { id: "INV-012", cliente: "Residencial Arboleda", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-24", estado: "Pendiente" },
    { id: "INV-013", cliente: "Torres del Sol", plan: "Pro", monto: "S/ 300.00", fecha: "2026-04-05", estado: "Vencido" },
    { id: "INV-014", cliente: "Urban Park Sur", plan: "Básico", monto: "S/ 150.00", fecha: "2026-03-25", estado: "Pagado" },
    { id: "INV-015", cliente: "Altos de Miraflores", plan: "Premium", monto: "S/ 450.00", fecha: "2026-04-26", estado: "Pendiente" },
    { id: "INV-016", cliente: "Condominio La Ensenada", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-02", estado: "Pagado" },
    { id: "INV-017", cliente: "Villa Sol", plan: "Pro", monto: "S/ 300.00", fecha: "2026-04-14", estado: "Vencido" },
    { id: "INV-018", cliente: "El Remanso", plan: "Básico", monto: "S/ 150.00", fecha: "2026-04-27", estado: "Pendiente" },
    { id: "INV-019", cliente: "Las Palmeras", plan: "Pro", monto: "S/ 300.00", fecha: "2026-04-20", estado: "Pagado" },
    { id: "INV-020", cliente: "Residencial Arboleda", plan: "Básico", monto: "S/ 150.00", fecha: "2026-03-24", estado: "Pagado" },
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", type: "info" });

  // --- FUNCIONES ---
  const handleShowStatus = (title, message, type = "info") => {
    setModalConfig({ title, message, type });
    setShowStatusModal(true);
  };

  const handleDownloadReport = () => {
    handleShowStatus("Reporte Generado", "El reporte financiero consolidado se ha descargado exitosamente.", "success");
  };

  const marcarComoPagado = (id) => {
    setFacturas(facturas.map(f => f.id === id ? { ...f, estado: "Pagado" } : f));
    handleShowStatus("Pago Exitoso", `La factura ${id} ha sido marcada como PAGADA.`, "success");
  };

  const notificarCliente = (cliente) => {
    handleShowStatus("Aviso Enviado", `Notificación de cobro enviada a la administración de ${cliente}.`, "primary");
  };

  const confirmEliminar = (factura) => {
    setSelectedFactura(factura);
    setShowConfirmModal(true);
  };

  const executeEliminar = () => {
    setFacturas(facturas.filter(f => f.id !== selectedFactura.id));
    setShowConfirmModal(false);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6", margin: 0 }}>Suscripciones SaaS</h1>
        <p style={{ color: "#0ea5e9", fontWeight: 600, fontSize: "0.9rem" }}>Control financiero de {facturas.length} recibos generados</p>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "16px", borderLeft: "5px solid #10b981" }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#dcfce7", color: "#10b981", padding: "12px", borderRadius: "12px" }}><FiTrendingUp size={24} /></div>
              <div>
                <div className="text-muted small fw-bold">TOTAL RECAUDADO</div>
                <h4 className="fw-bold m-0 text-dark">S/ 18,450.00</h4>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "16px", borderLeft: "5px solid #ef4444" }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#fee2e2", color: "#ef4444", padding: "12px", borderRadius: "12px" }}><FiAlertCircle size={24} /></div>
              <div>
                <div className="text-muted small fw-bold">PENDIENTES / VENCIDOS</div>
                <h4 className="fw-bold m-0 text-dark">{facturas.filter(f => f.estado !== "Pagado").length} Recibos</h4>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "16px", borderLeft: "5px solid #3b82f6" }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#eff6ff", color: "#3b82f6", padding: "12px", borderRadius: "12px" }}><FiCreditCard size={24} /></div>
              <div>
                <div className="text-muted small fw-bold">MÉTODO PREDOMINANTE</div>
                <h4 className="fw-bold m-0 text-dark">Transferencia</h4>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm" style={{ borderRadius: "20px" }}>
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center p-4">
            <h5 className="fw-bold m-0 text-dark">Historial de Suscripciones</h5>
            <Button onClick={handleDownloadReport} variant="outline-primary" size="sm" className="fw-bold px-3" style={{ borderRadius: "8px" }}>
              <FiDownload className="me-2" /> Reporte Global
            </Button>
          </div>

          <Table responsive hover className="align-middle m-0">
            <thead style={{ background: "#f8fafc" }}>
              <tr className="text-muted small text-uppercase fw-bold">
                <th className="py-3 px-4">ID Recibo</th>
                <th>Cliente / Plan</th>
                <th>Monto</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th className="text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td className="py-4 px-4 fw-bold text-primary">{f.id}</td>
                  <td>
                    <div className="fw-bold text-dark">{f.cliente}</div>
                    <div className="text-muted small">Plan: {f.plan}</div>
                  </td>
                  <td className="fw-bold text-dark">{f.monto}</td>
                  <td className="small text-muted"><FiCalendar className="me-1"/> {f.fecha}</td>
                  <td>
                    <Badge 
                      bg={f.estado === "Pagado" ? "success" : f.estado === "Pendiente" ? "warning" : "danger"}
                      className="bg-opacity-10 px-3 py-2"
                      style={{ color: f.estado === "Pagado" ? "#10b981" : f.estado === "Pendiente" ? "#f59e0b" : "#ef4444" }}
                    >
                      {f.estado.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="text-end px-4">
                    <Dropdown align="end">
                      <Dropdown.Toggle as="button" className="btn border-0 p-0 bg-transparent text-muted shadow-none"><FiMoreVertical size={20} /></Dropdown.Toggle>
                      <Dropdown.Menu className="shadow border-0 rounded-3 p-2">
                        <Dropdown.Item onClick={() => marcarComoPagado(f.id)} className="d-flex align-items-center gap-2 py-2"><FiCheck className="text-success" /> Marcar Pago</Dropdown.Item>
                        <Dropdown.Item onClick={() => notificarCliente(f.cliente)} className="d-flex align-items-center gap-2 py-2"><FiBell className="text-primary" /> Notificar</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => confirmEliminar(f)} className="d-flex align-items-center gap-2 py-2 text-danger"><FiTrash2 /> Eliminar</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODALES */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className={`mb-3 text-${modalConfig.type}`}>{modalConfig.type === "success" ? <FiCheck size={50} /> : <FiInfo size={50} />}</div>
          <h5 className="fw-bold">{modalConfig.title}</h5>
          <p className="text-muted small mb-0">{modalConfig.message}</p>
          <Button variant="dark" className="w-100 mt-3 rounded-3 fw-bold" onClick={() => setShowStatusModal(false)}>Aceptar</Button>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <FiTrash2 size={50} className="text-danger mb-3" />
          <h5 className="fw-bold">¿Eliminar registro?</h5>
          <p className="text-muted small">Esta acción es irreversible.</p>
          <div className="d-flex gap-2 mt-4">
            <Button variant="light" className="w-100 fw-bold border" onClick={() => setShowConfirmModal(false)}>No</Button>
            <Button variant="danger" className="w-100 fw-bold" onClick={executeEliminar}>Sí, Borrar</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}