import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../assets/logo.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarStyle = {
    transition: "all 0.3s ease",
    backgroundColor: scrolled ? "#ffffff" : "transparent",
    boxShadow: scrolled ? "0 4px 15px rgba(0,0,0,0.08)" : "none",
    borderBottom: scrolled ? "1px solid #eaeaea" : "none",
  };

  const baseLink = {
    color: "#333",
    fontWeight: "500",
    padding: "6px 10px",
    borderRadius: "8px",
    transition: "0.3s",
  };

  const linkStyle = (name) =>
    hovered === name
      ? { ...baseLink, backgroundColor: "#eef2ff", color: "#1f2a44" }
      : baseLink;

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={navbarStyle}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className="py-2"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={() => setExpanded(false)}
          className="d-flex align-items-center fw-bold"
          style={{ color: "#1f2a44", fontSize: "22px" }}
        >
          <img src={Logo} alt="Urban Park" width="45" height="45" className="me-2" />
          Urban Park
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="ms-auto align-items-lg-center gap-2">

            <Nav.Link
              as={Link}
              to="/"
              style={linkStyle("inicio")}
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHovered("inicio")}
              onMouseLeave={() => setHovered(null)}
            >
              Inicio
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/servicios"
              style={linkStyle("servicios")}
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHovered("servicios")}
              onMouseLeave={() => setHovered(null)}
            >
              Servicios
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/como-funciona"
              style={linkStyle("como")}
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHovered("como")}
              onMouseLeave={() => setHovered(null)}
            >
              Cómo funciona
            </Nav.Link>

            <NavDropdown title="Condominios" id="condo-dd">
              <NavDropdown.Item as={Link} to="/gestion">
                Gestión de parqueos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reservas">
                Reservas
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reportes">
                Reportes
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/contacto"
              style={linkStyle("contacto")}
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHovered("contacto")}
              onMouseLeave={() => setHovered(null)}
            >
              Contacto
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar;