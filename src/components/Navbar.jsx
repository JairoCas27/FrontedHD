import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavbarBS from "react-bootstrap/Navbar";
import logo1 from "../images/Logo1.png";
import logo2 from "../images/logo.png";

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
    backgroundColor: scrolled || expanded ? "#ffffff" : "transparent",
    boxShadow: scrolled || expanded ? "0 4px 15px rgba(0,0,0,0.08)" : "none",
    borderBottom: scrolled || expanded ? "1px solid #eaeaea" : "none",
  };

  const linkBase = {
    fontWeight: "500",
    padding: "6px 10px",
    borderRadius: "8px",
    transition: "0.3s",
    color: scrolled || expanded ? "#111827" : "#ffffff",
  };

  const linkStyle = (name) =>
    hovered === name
      ? {
          ...linkBase,
          backgroundColor: scrolled || expanded
            ? "#eef2ff"
            : "rgba(255,255,255,0.15)",
          color: scrolled || expanded ? "#1f2a44" : "#ffffff",
        }
      : linkBase;

  return (
    <NavbarBS
      expand="lg"
      fixed="top"
      style={navbarStyle}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className="py-2"
    >
      <Container>
        <NavbarBS.Brand
          as={Link}
          to="/"
          onClick={() => setExpanded(false)}
          className="d-flex align-items-center"
          style={{
            color: scrolled || expanded ? "#111827" : "#ffffff",
            transition: "0.3s",
            fontWeight: "600",
          }}
        >
          <img
            src={scrolled || expanded ? logo2 : logo1}
            alt="Urban Park"
            style={{
              height: "45px",
              objectFit: "contain",
              transition: "all 0.3s ease",
            }}
          />
        </NavbarBS.Brand>

        <NavbarBS.Toggle />

        <NavbarBS.Collapse>
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
              to="/nosotros"
              style={linkStyle("nosotros")}
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHovered("nosotros")}
              onMouseLeave={() => setHovered(null)}
            >
              Nosotros
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/precios"
              style={linkStyle("precios")}
              onClick={() => setExpanded(false)}
              onMouseEnter={() => setHovered("precios")}
              onMouseLeave={() => setHovered(null)}
            >
              Planes
            </Nav.Link>

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
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  );
}

export default Navbar;