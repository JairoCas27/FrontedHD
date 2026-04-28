import { useState } from "react";
import { FiSettings, FiGlobe, FiBell, FiLock, FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap";

const STORAGE_KEY = 'config_global_superadmin'

const configInicial = {
  nombreApp: "Urban Park Sistema",
  correoSoporte: "soporte@urbanpark.pe",
  mantenimiento: false,
  notificacionesEmail: true,
  registroAbierto: true
}

export default function ConfiguracionSaaS() {
  // --- ESTADOS ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : configInicial
    } catch {
      return configInicial
    }
  });


  // --- FUNCIONES ---
  const handleSave = (e) => {
    e.preventDefault();
    // Aquí simulamos el guardado en LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setShowSuccessModal(true); // Abrimos el modal en lugar de la alerta
    console.log("Configuración guardada:", config);
  };


  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER */}
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6", margin: 0 }}>
          Ajustes del Sistema
        </h1>
        <p style={{ color: "#0ea5e9", fontSize: "0.9rem", fontWeight: 500 }}>
          Configuración general de la plataforma SaaS
        </p>
      </div>


      <Form onSubmit={handleSave}>
        <Row>
          {/* Bloque 1: Identidad */}
          <Col md={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "#4f46e5" }}>
                  <FiGlobe /> Información General
                </h6>
                
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">NOMBRE DE LA PLATAFORMA</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="bg-light border-0 py-2" 
                    value={config.nombreApp}
                    onChange={(e) => setConfig({...config, nombreApp: e.target.value})}
                  />
                </Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">CORREO DE CONTACTO</Form.Label>
                  <Form.Control 
                    type="email" 
                    className="bg-light border-0 py-2" 
                    value={config.correoSoporte}
                    onChange={(e) => setConfig({...config, correoSoporte: e.target.value})}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>


          {/* Bloque 2: Permisos */}
          <Col md={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "#4f46e5" }}>
                  <FiLock /> Accesos y Permisos
                </h6>


                <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded-3">
                  <span className="small fw-bold">Permitir Nuevos Registros</span>
                  <Form.Check 
                    type="switch" 
                    checked={config.registroAbierto}
                    onChange={(e) => setConfig({...config, registroAbierto: e.target.checked})}
                  />
                </div>


                <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded-3">
                  <span className="small fw-bold">Notificaciones por Correo</span>
                  <Form.Check 
                    type="switch" 
                    checked={config.notificacionesEmail}
                    onChange={(e) => setConfig({...config, notificacionesEmail: e.target.checked})}
                  />
                </div>


                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3">
                  <span className="small fw-bold text-danger">Modo Mantenimiento</span>
                  <Form.Check 
                    type="switch" 
                    checked={config.mantenimiento}
                    onChange={(e) => setConfig({...config, mantenimiento: e.target.checked})}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>


        {/* Botón de Guardar */}
        <div className="text-end">
          <Button 
            type="submit" 
            size="lg"
            className="px-5 py-2 shadow-sm"
            style={{ background: "#3b82f6", border: "none", borderRadius: "10px", fontWeight: 600 }}
          >
            <FiSave className="me-2" /> Guardar Configuración
          </Button>
        </div>
      </Form>


      {/* Nota informativa */}
      <div className="mt-4 p-3 rounded-3 border d-flex align-items-center gap-3 bg-white">
        <FiAlertCircle className="text-warning" size={24} />
        <span className="text-muted small">
          <b>Nota:</b> Estos parámetros son de nivel <b>Super Administrador</b> y afectan el comportamiento global del sistema.
        </span>
      </div>


      {/* MODAL DE ÉXITO (Reemplaza la alerta) */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="mb-3" style={{ color: "#10b981" }}>
            <FiCheckCircle size={50} />
          </div>
          <h5 className="fw-bold">¡Configuración Guardada!</h5>
          <p className="text-muted small">Los ajustes globales han sido actualizados correctamente en el almacenamiento local.</p>
          <Button 
            variant="dark" 
            className="w-100 mt-2 rounded-3 fw-bold" 
            onClick={() => setShowSuccessModal(false)}
          >
            Entendido
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}