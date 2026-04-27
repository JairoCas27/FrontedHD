import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiShield, FiSave, FiCheckCircle, FiCamera, FiBriefcase } from "react-icons/fi";
import { Card, Button, Form, Row, Col, Modal, Image, Badge } from "react-bootstrap";

export default function PerfilSuperAdmin() {
  // --- ESTADOS ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [perfil, setPerfil] = useState({
    nombre: "Nick Admin",
    email: "nick.admin@urbanpark.pe",
    telefono: "+51 987 654 321",
    cargo: "Director de Operaciones SaaS",
    empresa: "Urban Park Solutions",
    biografia: "Responsable de la gestión global de condominios y despliegue de infraestructura física en la zona norte."
  });

  // --- FUNCIONES ---
  const handleUpdate = (e) => {
    e.preventDefault();
    // Guardamos en LocalStorage para persistencia
    localStorage.setItem("perfil_superadmin", JSON.stringify(perfil));
    setShowSuccessModal(true);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER CON COLORES QUE TE GUSTARON */}
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#4f46e5", margin: 0 }}>
          Mi Perfil
        </h1>
        <p style={{ color: "#0ea5e9", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
          Administración de cuenta de Super Usuario
        </p>
      </div>

      <Row>
        {/* COLUMNA IZQUIERDA: RESUMEN VISUAL */}
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm text-center p-4 h-100" style={{ borderRadius: "20px" }}>
            <Card.Body>
              <div className="position-relative d-inline-block mb-3">
                <Image 
                  src={`https://ui-avatars.com/api/?name=${perfil.nombre}&background=3b82f6&color=fff&size=150`} 
                  roundedCircle 
                  style={{ border: "5px solid #eff6ff", width: "150px", height: "150px" }}
                />
                <Button 
                  size="sm" 
                  style={{ 
                    background: "#3b82f6", 
                    border: "none", 
                    width: "38px", 
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  className="position-absolute bottom-0 end-0 rounded-circle shadow-sm"
                >
                  <FiCamera />
                </Button>
              </div>
              
              <h4 className="fw-bold mb-1" style={{ color: "#1e293b" }}>{perfil.nombre}</h4>
              <Badge 
                style={{ 
                  backgroundColor: "#eff6ff", 
                  color: "#3b82f6", 
                  padding: "8px 15px", 
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  border: "1px solid #dbeafe"
                }} 
                className="mb-3"
              >
                <FiShield className="me-1" /> SUPER ADMINISTRADOR
              </Badge>
              
              <div className="text-start mt-4 bg-light p-3 rounded-4">
                <p className="small mb-2 text-dark"><strong>Cargo:</strong> {perfil.cargo}</p>
                <p className="small mb-0 text-dark"><strong>Empresa:</strong> {perfil.empresa}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <Col md={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: "20px" }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "#4f46e5" }}>
                <FiUser /> Información de Contacto
              </h6>
              
              <Form onSubmit={handleUpdate}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">NOMBRE COMPLETO</Form.Label>
                      <Form.Control 
                        className="bg-light border-0 py-2 fw-medium"
                        value={perfil.nombre}
                        onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">CARGO ACTUAL</Form.Label>
                      <Form.Control 
                        className="bg-light border-0 py-2 fw-medium"
                        value={perfil.cargo}
                        onChange={(e) => setPerfil({...perfil, cargo: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">CORREO ELECTRÓNICO</Form.Label>
                  <Form.Control 
                    type="email"
                    className="bg-light border-0 py-2 fw-medium"
                    value={perfil.email}
                    onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">TELÉFONO / WHATSAPP</Form.Label>
                  <Form.Control 
                    className="bg-light border-0 py-2 fw-medium"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({...perfil, telefono: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">BIO / RESUMEN</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={3}
                    className="bg-light border-0 py-2 fw-medium"
                    value={perfil.biografia}
                    onChange={(e) => setPerfil({...perfil, biografia: e.target.value})}
                  />
                </Form.Group>

                <div className="text-end pt-2">
                  <Button 
                    type="submit"
                    className="px-5 py-2 shadow-sm fw-bold"
                    style={{ background: "#3b82f6", border: "none", borderRadius: "10px" }}
                  >
                    <FiSave className="me-2" /> Guardar Perfil
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL DE ÉXITO PERSONALIZADO */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="mb-3" style={{ color: "#10b981" }}>
            <FiCheckCircle size={60} />
          </div>
          <h5 className="fw-bold" style={{ color: "#1e293b" }}>¡Perfil Actualizado!</h5>
          <p className="text-muted small">Tus datos personales se han sincronizado correctamente en el almacenamiento local.</p>
          <Button 
            className="w-100 mt-2 py-2 fw-bold" 
            style={{ background: "#3b82f6", border: "none", borderRadius: "8px" }}
            onClick={() => setShowSuccessModal(false)}
          >
            Aceptar
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}