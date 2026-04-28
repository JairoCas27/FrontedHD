import { FiUser } from "react-icons/fi"
import { useState } from "react";
import { User, Mail, Home, Save, Send, X } from "lucide-react";

export default function PerfilPropietario() {
  const getUsuario = () => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : {
      nombre: "Juan Pérez",
      email: "juan@email.com",
      condominio: "Condominio Los Pinos",
      torre: "Torre A",
      piso: "Piso 3",
      departamento: "Dpto 302",
      rol: "Propietario"
    };
  };

  const [usuario, setUsuario] = useState(getUsuario());
  const [form, setForm] = useState(usuario);
  const [modal, setModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const colores = {
    naranja: "#f97316",
    naranjaOscuro: "#ea580c",
    texto: "#1e293b",
    subtitulo: "#64748b"
  };

  const abrirEditar = () => {
    setForm(usuario);
    setModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = () => {
    localStorage.setItem("usuario", JSON.stringify(form));
    setUsuario(form);
    setMensaje("Perfil actualizado correctamente");
    setModal(false);
    setTimeout(() => setMensaje(""), 3000);
  };

  const solicitar = () => {
    setMensaje("Solicitud enviada correctamente");
    setModal(false);
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div style={{ padding: "1rem" }}>

      {/* MENSAJE */}
      {mensaje && (
        <div style={{
          marginBottom: "1rem",
          padding: "0.8rem",
          background: colores.naranja,
          color: "white",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          {mensaje}
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: colores.texto }}>Mi Perfil</h1>
        <p style={{ color: colores.subtitulo }}>Información personal del propietario</p>
      </div>

      {/* CARD PERFIL */}
      <div style={{
        maxWidth: "500px",
        background: `linear-gradient(135deg, ${colores.naranja}, ${colores.naranjaOscuro})`,
        borderRadius: "24px",
        padding: "2rem",
        color: "white"
      }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <User size={40} />
          <h2>{usuario.nombre}</h2>
          <p>{usuario.rol}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p><Mail size={14}/> {usuario.email}</p>
          <p><Home size={14}/> {usuario.condominio}</p>
          <p>{usuario.torre} - {usuario.piso}</p>
          <p>{usuario.departamento}</p>
        </div>

        <button
          onClick={abrirEditar}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            background: "white",
            color: colores.naranjaOscuro,
            padding: "0.7rem",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Editar Perfil
        </button>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "20px",
            width: "350px"
          }}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Editar Perfil</h3>
              <button onClick={() => setModal(false)}><X size={18}/></button>
            </div>

            {["nombre","email","condominio","torre","piso","departamento"].map(f => (
              <input
                key={f}
                name={f}
                value={form[f]}
                onChange={handleChange}
                placeholder={f}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "8px",
                  borderBottom: "1px solid #ccc"
                }}
              />
            ))}

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={solicitar} style={{ flex: 1 }}>
                <Send size={14}/> Solicitar
              </button>
              <button onClick={guardar} style={{ flex: 1 }}>
                <Save size={14}/> Guardar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
