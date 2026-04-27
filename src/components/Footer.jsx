import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  return (
    <footer>
      <div style={{ backgroundColor: "#263885", color: "#fff", padding: "40px 0" }}>
        <Container>
          <Row>
            <Col md={3}>
              <h3 className="fw-bold">URBAN PARK</h3>
              <p>
                Sistema de estacionamiento para condominios y edificios.
                <br />
                Lima - Perú
              </p>
              <p>
                <strong>Gestión inteligente de parqueos</strong>
              </p>
            </Col>

            <Col md={3}>
              <h5 className="fw-bold">INFORMACIÓN</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/servicios" className="text-white text-decoration-none">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link to="/terminos" className="text-white text-decoration-none">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacidad" className="text-white text-decoration-none">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </Col>

            <Col md={3}>
              <h5 className="fw-bold">CONTACTO</h5>
              <p>Central: +51 900 123 456</p>
              <p>Soporte: soporte@urbanpark.com</p>
              <p>Admin: admin@urbanpark.com</p>
              <p>Atención: 24/7</p>
            </Col>

            <Col md={3}>
              <h5 className="fw-bold">PLATAFORMA</h5>
              <p>Sistema de control de estacionamientos en tiempo real.</p>
              <p>Optimizado para condominios y edificios residenciales.</p>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col className="text-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook text-white fs-4 mx-2"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter text-white fs-4 mx-2"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram text-white fs-4 mx-2"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-linkedin text-white fs-4 mx-2"></i>
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      <div style={{ backgroundColor: "#182E8F", color: "#fff", padding: "10px 0" }}>
        <Container className="text-center">
          <small>
            © Copyright Urban Park. Todos los derechos reservados 2026
          </small>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;