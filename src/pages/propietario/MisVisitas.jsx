import { useState } from "react";
import { Car, Plus, X, Send } from "lucide-react";

export default function PermisosEstacionamiento() {

  const getData = () => {
    const data = localStorage.getItem("permisos");
    return data ? JSON.parse(data) : {
      estacionamiento: "A-1234",
      permisos: []
    };
  };

  const [data] = useState(getData());
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    placa: "",
    inicio: "",
    fin: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generarPermiso = () => {
    console.log(form);
    setModal(false);
  };
  const [data, setData] = useState(getData());

const generarPermiso = () => {
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

  setModal(false);
};
const [mensaje, setMensaje] = useState("");

const hayCruce = (nuevoInicio, nuevoFin) => {
  return data.permisos.some(p => {
    const i1 = new Date(p.inicio);
    const f1 = new Date(p.fin);
    const i2 = new Date(nuevoInicio);
    const f2 = new Date(nuevoFin);

    return i2 < f1 && f2 > i1;
  });
};

const generarPermiso = () => {

  if (!form.nombre || !form.placa) {
    setMensaje("Completa los campos");
    return;
  }

  if (hayCruce(form.inicio, form.fin)) {
    setMensaje("Ya existe un permiso en ese horario");
    return;
  }};

  return (
    <div style={{ padding: "1rem" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem" }}>
          Permisos de Estacionamiento
        </h1>
        <p>Gestiona préstamos y accesos temporales</p>
      </div>

      <div style={{
        background: "#f97316",
        borderRadius: "24px",
        padding: "2rem",
        color: "white"
      }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Car size={40}/>
          <div>
            <h2>{data.estacionamiento}</h2>
            <p>Disponible</p>
          </div>
        </div>
      </div>
        <button onClick={() => setModal(true)}>
          <Plus/> Generar permiso
        </button>

        {modal && (
          <div>
            <input name="nombre" onChange={handleChange}/>
            <input name="placa" onChange={handleChange}/>
            <input name="inicio" type="datetime-local" onChange={handleChange}/>
            <input name="fin" type="datetime-local" onChange={handleChange}/>
            {data.permisos.map(p => (
              <div key={p.id}>
                <h3>{p.nombre}</h3>
                <p>{p.placa}</p>
              </div>
            ))}
            <button onClick={generarPermiso}>
              <Send/> Enviar
            </button>
          </div>
        )}
    </div>
  );
}