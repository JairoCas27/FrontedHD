import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Fingerprint, Phone, ChevronRight, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [hasVehicle, setHasVehicle] = useState(false);

  return (
    <div 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(30, 27, 75, 0.8), rgba(30, 27, 75, 0.8)), url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh' 
      }} 
      className="d-flex align-items-center py-5"
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}> {/* Aumentamos un poco el ancho para los nuevos campos */}
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#1e1b4b' }}>Registro de Residente</h2>
                  <p className="text-muted">Cree su cuenta para el sistema Urban Park</p>
                </div>

                <Form>
                  {/* SECCIÓN: INFORMACIÓN PERSONAL */}
                  <h6 className="text-uppercase small fw-bold mb-3" style={{ color: '#10b981', letterSpacing: '1px' }}>Información Personal</h6>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">NOMBRES</Form.Label>
                      <Form.Control type="text" placeholder="Ej: Juan Pablo" className="bg-light border-0 py-2" />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">APELLIDOS</Form.Label>
                      <Form.Control type="text" placeholder="Ej: Pérez García" className="bg-light border-0 py-2" />
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">DNI</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Fingerprint size={18}/></InputGroup.Text>
                        <Form.Control type="text" placeholder="8 dígitos" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">NÚMERO CELULAR</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Phone size={18}/></InputGroup.Text>
                        <Form.Control type="text" placeholder="999 999 999" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* SECCIÓN: CREDENCIALES DE ACCESO */}
                  <h6 className="text-uppercase small fw-bold mb-3 mt-4" style={{ color: '#10b981', letterSpacing: '1px' }}>Credenciales de Acceso</h6>
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Label className="small fw-bold">CORREO ELECTRÓNICO</Form.Label>
                      <InputGroup size="sm" className="mb-3">
                        <InputGroup.Text className="bg-light border-0"><Mail size={18}/></InputGroup.Text>
                        <Form.Control type="email" placeholder="usuario@correo.com" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                  </Row>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">CONTRASEÑA</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Lock size={18}/></InputGroup.Text>
                        <Form.Control type="password" placeholder="********" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">CONFIRMAR CONTRASEÑA</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Lock size={18}/></InputGroup.Text>
                        <Form.Control type="password" placeholder="********" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                  </Row>

                  <hr className="my-4 opacity-25" />

                  {/* SECCIÓN: VEHÍCULO */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="text-uppercase small fw-bold m-0" style={{ color: '#10b981', letterSpacing: '1px' }}>¿Cuenta con vehículo?</h6>
                    <Form.Check 
                      type="switch"
                      id="vehicle-switch"
                      checked={hasVehicle}
                      onChange={(e) => setHasVehicle(e.target.checked)}
                      label={hasVehicle ? "SÍ" : "NO"}
                      className="fw-bold"
                    />
                  </div>

                  {hasVehicle && (
                    <div className="p-3 rounded-3 mb-4 animate__animated animate__fadeIn" style={{ backgroundColor: '#f1f5f9' }}>
                      <Row>
                        <Col md={4} className="mb-2">
                          <Form.Label className="extra-small fw-bold">PLACA</Form.Label>
                          <Form.Control type="text" placeholder="ABC-123" className="border-0 py-2" />
                        </Col>
                        <Col md={4} className="mb-2">
                          <Form.Label className="extra-small fw-bold">MODELO</Form.Label>
                          <Form.Control type="text" placeholder="Ej: Corolla" className="border-0 py-2" />
                        </Col>
                        <Col md={4} className="mb-2">
                          <Form.Label className="extra-small fw-bold">COLOR</Form.Label>
                          <Form.Control type="text" placeholder="Ej: Gris" className="border-0 py-2" />
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Button 
                    className="w-100 py-3 mt-3 border-0 fw-bold d-flex align-items-center justify-content-center transition-all" 
                    style={{ backgroundColor: '#1e1b4b', borderRadius: '10px' }}
                  >
                    Finalizar Registro <ChevronRight size={20} className="ms-2" />
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;