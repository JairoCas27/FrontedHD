import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Fingerprint, Phone, ChevronRight } from 'lucide-react';

const Register = () => {
  const [hasVehicle, setHasVehicle] = useState(false);

 
  const bgImage = "https://www.ciudadverde.pe/storage/banner-items/December2023/MlOIsz9f6vF95H8efDxn-banner.jpg";

  return (
    <div style={{ 
      backgroundImage: `linear-gradient(rgba(30, 27, 75, 0.8), rgba(30, 27, 75, 0.8)), url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    }} className="py-5">
      
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#1e1b4b' }}>Registro de Residente</h2>
                  <p className="text-muted small">Cree su cuenta para acceder a Urban Park</p>
                </div>

                <Form>
                  {/* Sección: Datos Personales */}
                  <h6 className="text-uppercase small fw-bold mb-3" style={{ color: '#10b981', letterSpacing: '1px' }}>Información Personal</h6>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label className="small fw-bold">NOMBRES</Form.Label>
                      <Form.Control type="text" placeholder="Ej: Juan Pablo" className="bg-light border-0 py-2 shadow-sm" />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="small fw-bold">APELLIDOS</Form.Label>
                      <Form.Control type="text" placeholder="Ej: Pérez García" className="bg-light border-0 py-2 shadow-sm" />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label className="small fw-bold">DNI</Form.Label>
                      <InputGroup size="sm" className="shadow-sm">
                        <InputGroup.Text className="bg-light border-0"><Fingerprint size={18}/></InputGroup.Text>
                        <Form.Control type="text" placeholder="8 dígitos" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="small fw-bold">NÚMERO CELULAR</Form.Label>
                      <InputGroup size="sm" className="shadow-sm">
                        <InputGroup.Text className="bg-light border-0"><Phone size={18}/></InputGroup.Text>
                        <Form.Control type="text" placeholder="999 999 999" className="bg-light border-0 py-2" />
                      </InputGroup>
                    </Col>
                  </Row>

                  <hr className="my-4 opacity-25" />

                  {/* Sección: Vehículo */}
                  <div className="d-flex align-items-center justify-content-between mb-3 bg-light p-2 rounded-3 border">
                    <h6 className="text-uppercase small fw-bold m-0" style={{ color: '#1e1b4b' }}>¿Cuenta con vehículo propio?</h6>
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
                    <div className="animate__animated animate__fadeIn p-3 rounded-3 mb-4 border border-success-subtle" style={{ backgroundColor: '#f1fdf9' }}>
                      <Row>
                        <Col md={4} className="mb-2">
                          <Form.Label className="extra-small fw-bold">PLACA</Form.Label>
                          <Form.Control type="text" placeholder="ABC-123" className="border-0 py-2 shadow-sm" />
                        </Col>
                        <Col md={4} className="mb-2">
                          <Form.Label className="extra-small fw-bold">MODELO</Form.Label>
                          <Form.Control type="text" placeholder="Toyota" className="border-0 py-2 shadow-sm" />
                        </Col>
                        <Col md={4} className="mb-2">
                          <Form.Label className="extra-small fw-bold">COLOR</Form.Label>
                          <Form.Control type="text" placeholder="Negro" className="border-0 py-2 shadow-sm" />
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Button 
                    className="w-100 py-3 mt-3 border-0 fw-bold d-flex align-items-center justify-content-center shadow" 
                    style={{ backgroundColor: '#1e1b4b', borderRadius: '12px' }}
                  >
                    Registrarme ahora <ChevronRight size={20} className="ms-2" />
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