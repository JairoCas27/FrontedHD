import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <Col md={6} lg={4}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#1e1b4b' }}>¿Olvidó su contraseña?</h2>
                  <p className="text-muted small">
                    {submitted 
                      ? "Hemos enviado las instrucciones a su correo." 
                      : "Ingrese su correo electrónico para restablecer su acceso."}
                  </p>
                </div>

                {!submitted ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold">CORREO REGISTRADO</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Mail size={18}/></InputGroup.Text>
                        <Form.Control 
                          required
                          type="email" 
                          placeholder="usuario@correo.com" 
                          className="bg-light border-0 py-2" 
                        />
                      </InputGroup>
                    </Form.Group>

                    <Button 
                      type="submit"
                      className="w-100 py-3 mb-3 border-0 fw-bold d-flex align-items-center justify-content-center shadow" 
                      style={{ backgroundColor: '#1e1b4b', borderRadius: '12px' }}
                    >
                      Enviar Instrucciones <Send size={18} className="ms-2" />
                    </Button>
                  </Form>
                ) : (
                  <div className="text-center animate__animated animate__fadeIn">
                    <div className="p-3 mb-4 rounded-circle d-inline-block" style={{ backgroundColor: '#ecfdf5' }}>
                      <Mail size={40} color="#10b981" />
                    </div>
                    <p className="small text-muted mb-4">
                      Si el correo coincide con un residente activo, recibirá un enlace en unos minutos.
                    </p>
                    <Button 
                      as={Link}
                      to="/login"
                      variant="outline-secondary"
                      className="w-100 py-2 fw-bold"
                      style={{ borderRadius: '10px' }}
                    >
                      Volver al Login
                    </Button>
                  </div>
                )}

                {!submitted && (
                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none small fw-bold d-flex align-items-center justify-content-center" style={{ color: '#64748b' }}>
                      <ArrowLeft size={16} className="me-2" /> Volver al inicio de sesión
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;