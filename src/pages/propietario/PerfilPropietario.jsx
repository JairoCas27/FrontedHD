import { FiUser } from "react-icons/fi"
import { useState } from "react";
import { User } from "lucide-react";

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

  const [modal, setModal] = useState(false);
  
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1e293b" }}>Mi Perfil</h1>
        <p style={{ color: "#64748b" }}>Información personal del propietario</p>
      </div>
    
      <div style={{
        maxWidth: "500px",
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        borderRadius: "24px",
        padding: "2rem",
        color: "white"
      }}>
        <div style={{ padding: "1rem" }}>
      <h1>Mi Perfil</h1>

      <div>
        <User size={40} />
        <h2>{usuario.nombre}</h2>
        <p>{usuario.rol}</p>
      </div>
      <div>
        <p>{usuario.email}</p>
        <p>{usuario.condominio}</p>
        <p>{usuario.torre} - {usuario.piso}</p>
        <p>{usuario.departamento}</p>
      </div>
      <button onClick={() => setModal(true)}>
        Editar Perfil
      </button>
    </div>
      </div>
    </div>
  );
}