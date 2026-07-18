import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiLogOut, FiUser, FiMail, FiMenu, FiX } from "react-icons/fi";
import logo2 from "../images/logo.png";
import { useLogout } from "../hooks/useLogout";

export default function SidebarLayout({
  isOpen,
  setIsOpen,
  panelLabel,
  accentColor,
  accentLight,
  accentDark,
  menuItems,
  userInfo,
}) {
  const { handleLogout } = useLogout();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile && !isOpen) {
    return (
      <>
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.5rem 0.75rem",
          backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <img src={logo2} alt="Logo" style={{ width: "100px", height: "auto", borderRadius: "8px" }} />
            <div>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: accentColor, letterSpacing: "-0.02em", display: "block", lineHeight: 1.2 }}>{panelLabel}</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: accentColor, color: "#fff", border: "none",
              width: "36px", height: "36px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <FiMenu size={18} />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 998,
            backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
          }}
        />
      )}
      <style>{`
        @media (min-width: 768px) { .sb-mobile-close { display: none !important; } }
        @media (max-width: 767px) { .sb-sidebar { width: 280px !important; } }
      `}</style>
      <div className="sb-sidebar"
        style={{
          width: isMobile ? "280px" : isOpen ? "240px" : "72px",
          height: "100vh",
          backgroundColor: "#f8fafc",
          position: "fixed",
          left: 0,
          top: 0,
          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: isMobile ? "4px 0 30px rgba(0,0,0,0.2)" : "2px 0 20px rgba(0,0,0,0.07)",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: isOpen ? "1.25rem 1rem" : "1.25rem 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `2px solid ${accentLight}`,
            minHeight: "90px",
            backgroundColor: "#fff",
            transition: "padding 0.35s ease",
          }}
        >
          <img
            src={logo2}
            alt="Logo"
            style={{
              width: isOpen ? "130px" : "42px",
              height: "auto",
              objectFit: "contain",
              transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
              borderRadius: "8px",
            }}
          />
          <div
            style={{
              overflow: "hidden",
              maxHeight: isOpen ? "30px" : "0px",
              opacity: isOpen ? 1 : 0,
              transition: "max-height 0.3s ease, opacity 0.3s ease",
            }}
          >
            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.82rem",
                color: accentColor,
                fontWeight: 700,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {panelLabel}
            </p>
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "0.75rem 0",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
          }}
        >
          {menuItems.map((item, index) =>
            item.section ? (
              <div
                key={index}
                style={{
                  overflow: "hidden",
                  maxHeight: isOpen ? "28px" : "0px",
                  opacity: isOpen ? 1 : 0,
                  transition: "max-height 0.3s ease, opacity 0.25s ease",
                  padding: "0 1.1rem",
                  marginTop: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0.4rem 0 0.2rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.section}
                </p>
              </div>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                title={!isOpen ? item.title : ""}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  padding: isOpen ? "0.75rem 1.1rem" : "0.75rem 0",
                  justifyContent: isOpen ? "flex-start" : "center",
                  color: isActive ? accentColor : "#475569",
                  backgroundColor: isActive ? accentLight : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  borderLeft: isActive ? `4px solid ${accentColor}` : "4px solid transparent",
                  marginBottom: "0.1rem",
                  borderRadius: isOpen ? "0 10px 10px 0" : "0",
                  marginRight: isOpen ? "0.5rem" : "0",
                })}
                onMouseEnter={(e) => {
                  const active = e.currentTarget.getAttribute("aria-current");
                  if (!active) {
                    e.currentTarget.style.backgroundColor = accentLight;
                    e.currentTarget.style.color = accentColor;
                  }
                }}
                onMouseLeave={(e) => {
                  const active = e.currentTarget.getAttribute("aria-current");
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#475569";
                  }
                }}
              >
                <span style={{ display: "flex", alignItems: "center", minWidth: "20px", transition: "transform 0.2s ease" }}>
                  {item.icon}
                </span>
                <span
                  style={{
                    marginLeft: "0.85rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: isOpen ? "160px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    transition: "max-width 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
                  }}
                >
                  {item.title}
                </span>
              </NavLink>
            )
          )}
        </nav>

        <div
          style={{
            padding: isOpen ? "1rem 1rem" : "1rem 0",
            borderTop: `2px solid ${accentLight}`,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          {userInfo.map((info, index) =>
            isOpen ? (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  width: "100%",
                  opacity: 1,
                  transition: "opacity 0.25s ease",
                }}
              >
                <span style={{ color: accentColor, display: "flex", flexShrink: 0 }}>{info.icon}</span>
                <span
                  style={{
                    color: "#334155",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {info.value}
                </span>
              </div>
            ) : (
              <span key={index} style={{ color: accentColor, display: "flex" }} title={info.value}>
                {info.icon}
              </span>
            )
          )}

          <div
            style={{
              overflow: "hidden",
              maxHeight: isOpen ? "60px" : "0px",
              opacity: isOpen ? 1 : 0,
              width: "100%",
              transition: "max-height 0.3s ease, opacity 0.25s ease",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "0.65rem",
                marginTop: "0.25rem",
                backgroundColor: accentColor,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "background 0.2s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = accentDark;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = accentColor;
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              <FiLogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="sb-mobile-close"
              style={{
                flex: 1, padding: "0.85rem",
                backgroundColor: "#fee2e2", border: "none",
                borderTop: `2px solid #fecaca`,
                color: "#dc2626", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s ease", fontWeight: 600, gap: "0.35rem",
                fontSize: "0.78rem",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fecaca"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            >
              <FiX size={16} /> Cerrar
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              flex: isMobile ? 0 : 1, padding: "0.85rem",
              backgroundColor: accentLight,
              border: "none",
              borderTop: `2px solid ${accentLight}`,
              color: accentDark,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
              fontWeight: 600,
            }}
            onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = accentColor
              .replace(")", ", 0.15)")
              .replace("rgb", "rgba"))
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accentLight)}
          >
            {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}