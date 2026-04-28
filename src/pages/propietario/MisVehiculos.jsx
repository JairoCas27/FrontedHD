import { useState } from "react";
import { FiTruck } from "react-icons/fi";
import { Car, Send, Save } from "lucide-react";

export default function MisVehiculos() {

  const [vehiculo, setVehiculo] = useState({
    estacionamiento: "A-1234",
    marca: "Toyota",
    modelo: "Camry 2022",
    color: "Plata",
    placa: "ABC-1234",
  });

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(vehiculo);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = () => {
    setVehiculo(form);
    setModal(false);
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Mis Vehículos
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Registro y gestión de tus vehículos
        </p>
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1.5rem",
        marginTop: "2rem"
      }}>

        {/* CARD */}
        <div style={{
          background: "#be6a29",
          borderRadius: "16px",
          padding: "1.5rem",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>

          {/* HEADER CENTRADO */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: "rgba(216, 192, 155, 0.36)",
              padding: "10px",
              borderRadius: "12px",
              display: "inline-block"
            }}>
              <Car size={60} color="white" />
            </div>

            <h3 style={{ margin: "10px 0 0 0" }}>{vehiculo.estacionamiento}</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>
              Lugar de Estacionamiento
            </p>
          </div>

          {/* INFO */}
          <div style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
            <p><span style={{ color: "#c48f6c" }}>Marca:</span> {vehiculo.marca}</p>
            <p><span style={{ color: "#c48f6c" }}>Modelo:</span> {vehiculo.modelo}</p>
            <p><span style={{ color: "#c48f6c" }}>Color:</span> {vehiculo.color}</p>
            <p><span style={{ color: "#c48f6c" }}>Placa:</span> {vehiculo.placa}</p>
          </div>

          <hr style={{ borderColor: "#f3f1fa", margin: "1rem 0" }} />

          {/* BOTON */}
          <button
            onClick={() => setModal(true)}
            style={{
              width: "100%",
              background: "rgba(255, 245, 238, 0.47)",
              border: "1px solid rgba(255, 247, 242, 0.4)",
              padding: "0.7rem",
              borderRadius: "10px",
              color: "white",
              cursor: "pointer"
            }}
          >
            Solicitar cambios
          </button>

        </div>
      </div>

      {/* MODAL */}
      {modal && (<div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>

          <div style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "14px",
            width: "350px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>

            <h3 style={{ marginBottom: "1rem", color: "#be6a29" }}>
              Editar Vehículo
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>

              <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" />
              <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" />
              <input name="color" value={form.color} onChange={handleChange} placeholder="Color" />
              <input name="placa" value={form.placa} onChange={handleChange} placeholder="Placa" />

              {/* BLOQUEADO */}
              <input value={form.estacionamiento} disabled />

            </div>

            {/* BOTONES */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>

              <button style={{
                flex: 1,
                background: "#be6a29",
                color: "white",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px"
              }}>
                <Send size={14}/> Solicitar
              </button>

              <button onClick={guardar} style={{
                flex: 1,
                background: "#16a34a",
                color: "white",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px"
              }}>
                <Save size={14}/> Guardar
              </button>

            </div>

          </div>
        </div>
      )}

      {/* BLOQUE ORIGINAL */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", color: "#94a3b8" }}>
        <FiTruck size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
        <p style={{ fontSize: "1rem", fontWeight: 500 }}>Módulo en construcción</p>
        <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>El contenido estará disponible próximamente.</p>
      </div>
    </div>
  );
}