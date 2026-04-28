import { useState } from "react";
import { Car, Plus, X, Send, QrCode, Trash2 } from "lucide-react";

export default function PermisosEstacionamiento() {

  const getData = () => {
    const data = localStorage.getItem("permisos");
    return data ? JSON.parse(data) : {
      estacionamiento: "A-1234",
      permisos: []
    };
  };

  const [data, setData] = useState(getData());
  const [modal, setModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    placa: "",
    inicio: "",
    fin: ""
  });

  const colores = {
    naranja: "#f97316",
    naranjaOscuro: "#ea580c",
    slate: "#1e293b",
    light: "#64748b"
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 VALIDAR CRUCE DE HORARIOS
  const hayCruce = (nuevoInicio, nuevoFin) => {
    return data.permisos.some(p => {
      if (p.estado !== "Activo") return false;

      const inicioExistente = new Date(p.inicio);
      const finExistente = new Date(p.fin);

      const inicioNuevo = new Date(nuevoInicio);
      const finNuevo = new Date(nuevoFin);

      return inicioNuevo < finExistente && finNuevo > inicioExistente;
    });
  };

  const generarPermiso = () => {

    if (!form.nombre || !form.placa || !form.inicio || !form.fin) {
      setMensaje("Completa todos los campos");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    if (new Date(form.fin) <= new Date(form.inicio)) {
      setMensaje("La fecha fin debe ser mayor a inicio");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    if (hayCruce(form.inicio, form.fin)) {
      setMensaje("Ya existe un permiso en ese horario ");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    const nuevo = {
      ...form,
      estado: "Activo",
      id: Date.now()
    };

    const actualizado = {
      ...data,
      permisos: [nuevo, ...data.permisos]
    };

    localStorage.setItem("permisos", JSON.stringify(actualizado));
    setData(actualizado);

    setMensaje("Permiso generado correctamente ");
    setModal(false);

    setForm({ nombre: "", placa: "", inicio: "", fin: "" });

    setTimeout(() => setMensaje(""), 3000);
  };

  // ✅ ELIMINAR SOLO PERMISO
  const eliminarPermiso = (id) => {
    const nuevos = data.permisos.filter(p => p.id !== id);

    const actualizado = {
      ...data,
      permisos: nuevos
    };

    localStorage.setItem("permisos", JSON.stringify(actualizado));
    setData(actualizado);

    setMensaje("Permiso eliminado");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div style={{ padding: "1rem" }}>

      {/* MENSAJE */}
      {mensaje && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: colores.naranja,
          color: "white",
          padding: "0.9rem 1.4rem",
          borderRadius: "14px",
          textAlign: "center",
          zIndex: 2000, // 🔥 más alto que el modal
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          fontWeight: "600",
          animation: "fadeIn 0.3s ease"
        }}>
          {mensaje}
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: colores.slate }}>
          Permisos de Estacionamiento
        </h1>
        <p style={{ color: colores.light }}>
          Gestiona préstamos y accesos temporales
        </p>
      </div>

      {/* CARD ESTADO */}
      <div style={{
        background: `linear-gradient(135deg, ${colores.naranja}, ${colores.naranjaOscuro})`,
        borderRadius: "24px",
        padding: "2rem",
        color: "white",
        marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Car size={40}/>
          <div>
            <h2 style={{ margin: 0 }}>{data.estacionamiento}</h2>
            <p style={{ margin: 0 }}>
              {data.permisos.some(p => p.estado === "Activo")
                ? "Actualmente en uso"
                : "Disponible"}
            </p>
          </div>
        </div>
      </div>

      {/* BOTÓN */}
      <button
        onClick={() => setModal(true)}
        style={{
          background: colores.naranja,
          color: "white",
          border: "none",
          padding: "0.8rem 1.2rem",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          marginBottom: "1.5rem"
        }}
      >
        <Plus size={18}/> Generar permiso
      </button>

      {/* PERMISOS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
        gap: "1rem"
      }}>
        {data.permisos.map((p) => (
          <div key={p.id} style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            position: "relative"
          }}>
            
            {/* BOTÓN ELIMINAR */}
            <button
              onClick={() => eliminarPermiso(p.id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#fee2e2",
                border: "none",
                borderRadius: "8px",
                padding: "6px",
                cursor: "pointer",
                color: "#dc2626"
              }}
            >
              <Trash2 size={14}/>
            </button>

            <h3>{p.nombre}</h3>
            <p>🚗 {p.placa}</p>
            <p>🕒 {p.inicio} - {p.fin}</p>
            <p style={{
              color: p.estado === "Activo" ? "green" : "gray"
            }}>
              {p.estado}
            </p>

            <div style={{
              marginTop: "10px",
              padding: "10px",
              background: "#f1f5f9",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <QrCode size={40}/>
              <p style={{ fontSize: "0.7rem" }}>
                Código de acceso
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORIAL */}
      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ color: colores.slate }}>Historial</h2>

        <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
          {[
            { nombre: "Carlos López", placa: "AAA-1111", fecha: "10/04/2026" },
            { nombre: "María Torres", placa: "BBB-2222", fecha: "12/04/2026" },
            { nombre: "Luis Gómez", placa: "CCC-3333", fecha: "15/04/2026" }
          ].map((h, i) => (
            <div key={i} style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <p><strong>{h.nombre}</strong></p>
              <p>🚗 {h.placa}</p>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                {h.fecha}
              </p>
            </div>
          ))}
        </div>
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
            width: "320px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Nuevo Permiso</h3>
              <button onClick={() => setModal(false)}>
                <X size={18}/>
              </button>
            </div>

            <input name="nombre" placeholder="Nombre"
              onChange={handleChange} style={{ width:"100%", marginTop:"10px" }}/>

            <input name="placa" placeholder="Placa"
              onChange={handleChange} style={{ width:"100%", marginTop:"10px" }}/>

            <input name="inicio" type="datetime-local"
              onChange={handleChange} style={{ width:"100%", marginTop:"10px" }}/>

            <input name="fin" type="datetime-local"
              onChange={handleChange} style={{ width:"100%", marginTop:"10px" }}/>

            <button
              onClick={generarPermiso}
              style={{
                marginTop: "1rem",
                width: "100%",
                background: colores.naranja,
                color: "white",
                border: "none",
                padding: "0.7rem",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Send size={16}/> Enviar permiso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
