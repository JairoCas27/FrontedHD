import { useState } from "react";
import Layout from "../../components/Layout";
import { getUsuario, setUsuario } from "../../utils/localStorage";
import { getVehiculos, setVehiculos } from "../../utils/localStorage";
import { Pencil, Trash2, Car, Save, X  } from "lucide-react";

export default function UsuarioVehiculos() {
  const [vehiculos, setList] = useState(getVehiculos());

  const eliminar = (i) => {
    const nuevos = vehiculos.filter((_, idx) => idx !== i);
    setList(nuevos);
    setVehiculos(nuevos);
  };
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
  placa: "",
  modelo: "",
  color: "",
  estado: "Activo",
  estacionamiento: "",
});
  const resetear = () => {
  const dataInicial = [
    {
      placa: "ABC-1234",
      modelo: "Toyota Camry 2022",
      color: "Plata",
      estado: "Activo",
      estacionamiento: "A-01",
    },
    {
      placa: "XYZ-5678",
      modelo: "Honda CR-V 2023",
      color: "Negro",
      estado: "Activo",
      estacionamiento: "A-02",
    },
    {
      placa: "DEF-9012",
      modelo: "Mazda CX-5 2021",
      color: "Rojo",
      estado: "Activo",
      estacionamiento: "A-03",
    },
  ];

  setList(dataInicial);
  setVehiculos(dataInicial);
};
  const editar = (vehiculo, index) => {
  setForm(vehiculo);
  setEditIndex(index);
};
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const guardarEdicion = () => {
  const existe = vehiculos.some((v, i) => 
    v.estacionamiento === form.estacionamiento && i !== editIndex
  );

  if (existe) {
    alert("Ese estacionamiento ya está ocupado ");
    return;
  }

  const nuevos = [...vehiculos];
  nuevos[editIndex] = form;

  setList(nuevos);
  setVehiculos(nuevos);

  setEditIndex(null);
  }
  return (
    <Layout>
      <div>
      {/*icono*/}
      <h1 className="text-6xl font-bold mb-6 flex items-center gap-2">
        <Car size={100} /> Gestión de Vehiculos
      </h1>
      <button onClick={resetear} className="bg-purple-600 px-4 py-2 rounded-lg mb-4">
              Restaurar vehículos
            </button>
      {editIndex !== null && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

    <div className="bg-[#1e293b] p-6 rounded-xl w-[400px] shadow-lg">

      <h2 className="text-xl font-bold mb-4">Editar Vehículo</h2>

      <div className="space-y-3">

        <input
          name="placa"
          value={form.placa}
          onChange={handleChange}
          className="w-full p-3 bg-[#0f172a] rounded-lg"
          placeholder="Placa"
        />

        <input
          name="modelo"
          value={form.modelo}
          onChange={handleChange}
          className="w-full p-3 bg-[#0f172a] rounded-lg"
          placeholder="Modelo"
        />

        <input
          name="color"
          value={form.color}
          onChange={handleChange}
          className="w-full p-3 bg-[#0f172a] rounded-lg"
          placeholder="Color"
        />
        <input
          name="estacionamiento"
          value={form.estacionamiento}
          onChange={handleChange}
          className="w-full p-3 bg-[#0f172a] rounded-lg"
          placeholder="Estacionamiento (Ej: A-01)"
        />

          </div>

          <div className="flex gap-2 mt-5">

            <button onClick={guardarEdicion} className="flex-1 bg-purple-600 py-2 rounded-lg flex items-center justify-center gap-2">
             <Save size={16} /> Guardar
            </button>

            <button onClick={() => setEditIndex(null)} className="flex-1 bg-gray-600 py-2 rounded-lg flex items-center justify-center gap-2">
             <X size={16} /> Cancelar
            </button>

          </div>

        </div>
      </div>
    )}
      <div className="grid grid-cols-2 gap-4">
        {vehiculos.map((v, i) => (
          <div key={i} className="bg-[#1e293b] p-5 rounded-xl">
            
            <div className="flex justify-between mb-3">
              {/*icono*/}
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Car size={60} /> </h1>
              <h2 className="font-bold">{v.placa}</h2>
              <span className="text-green-400 text-sm">{v.estado}</span>
            </div>

              <div className="flex justify-between items-start gap-4">

              <div>
                <p className="text-gray-400 text-sm">Modelo</p>
                <p>{v.modelo}</p>

                <p className="text-gray-400 text-sm mt-2">Color</p>
                <p>{v.color}</p>
              </div>

              <div className="flex flex-col items-center justify-center 
                bg-indigo-500/10 
                border border-indigo-500/30 
                px-4 py-4 rounded-xl
                min-w-[100px] h-[90px]
                shadow-[0_0_12px_rgba(99,102,241,0.4)]">

                <p className="text-xs text-indigo-300">Lugar de Estacionamiento</p>

                <p className="text-2xl font-bold text-indigo-400">
                  {v.estacionamiento}
                </p>

              </div>

            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => editar(v, i)}className="flex-1 bg-[#0f172a] p-2 rounded-lg text-purple-400 flex items-center justify-center gap-2 hover:bg-[#1e293b] transition">
              <Pencil size={16} /> Editar </button>
            
              <button onClick={() => eliminar(i)} className="flex-1 bg-[#0f172a] p-2 rounded-lg text-red-400 flex items-center justify-center gap-2 hover:bg-[#1e293b] transition">
              <Trash2 size={16} /> Eliminar </button>
            </div>
    
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
}