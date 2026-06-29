import { useState, useEffect } from "react";
import { FiActivity, FiFilter, FiLogIn, FiLogOut, FiCalendar, FiSearch } from "react-icons/fi";

export default function Movimientos() {
  const [accesos, setAccesos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
    setAccesos(data);
  }, []);

  const hoy = new Date().toDateString();

  const stats = {
    total: accesos.filter(a => new Date(a.fecha).toDateString() === hoy).length,
    entradas: accesos.filter(a => new Date(a.fecha).toDateString() === hoy && a.tipo === "ENTRADA").length,
    salidas: accesos.filter(a => new Date(a.fecha).toDateString() === hoy && a.tipo === "SALIDA").length,
  };

  const filtrados = accesos.filter(a => {
    const tipoOk = filtroTipo === "TODOS" || a.tipo === filtroTipo;
    const placaOk = !filtroPlaca || a.placa.includes(filtroPlaca.toUpperCase());
    const fechaOk = !filtroFecha || a.fecha.split("T")[0] === filtroFecha;
    return tipoOk && placaOk && fechaOk;
  });

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-md text-center">
      <p className="text-xs font-bold text-slate-400 uppercase mb-2">{label}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );

  const FilterSelect = ({ label, icon: Icon, value, onChange, children }) => (
    <div className="flex-1 min-w-[150px]">
      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-slate-400" />}
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {children}
        </select>
      </div>
    </div>
  );

  const FilterInput = ({ label, icon: Icon, type = "text", value, onChange, placeholder }) => (
    <div className="flex-1 min-w-[150px]">
      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-slate-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
    </div>
  );

  const Badge = ({ tipo, children }) => {
    const styles = {
      ENTRADA: "bg-emerald-100 text-emerald-800",
      SALIDA: "bg-red-100 text-red-800",
      RESIDENTE: "bg-blue-100 text-blue-800",
      VISITANTE: "bg-amber-100 text-amber-800",
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${styles[tipo] || styles.VISITANTE}`}>
        {children}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Movimientos</h1>
        <p className="text-slate-500 mt-1 text-sm">Historial completo de accesos al condominio</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Hoy" value={stats.total} color="text-slate-800" />
        <StatCard label="Entradas" value={stats.entradas} color="text-emerald-500" />
        <StatCard label="Salidas" value={stats.salidas} color="text-red-500" />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiFilter size={18} />
          Filtros
        </h5>
        
        <div className="flex gap-4 flex-wrap items-end">
          <FilterSelect
            label="Tipo"
            icon={FiFilter}
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SALIDA">Salidas</option>
          </FilterSelect>

          <FilterInput
            label="Placa"
            icon={FiSearch}
            value={filtroPlaca}
            onChange={(e) => setFiltroPlaca(e.target.value.toUpperCase())}
            placeholder="ABC-123"
          />

          <FilterInput
            label="Fecha"
            icon={FiCalendar}
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <FiActivity size={20} />
            Registro de Movimientos
          </h5>
          <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-500">
            {filtrados.length} registros
          </span>
        </div>

        {filtrados.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FiActivity size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-base font-medium">No hay movimientos registrados</p>
            <p className="text-sm mt-1">Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Fecha</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Hora</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Placa</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Tipo</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Residente/Visitante</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100">
                    <td className="p-4 text-slate-500">{new Date(a.fecha).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-slate-800">{a.hora}</td>
                    <td className="p-4 text-slate-500">{a.placa}</td>
                    <td className="p-4">
                      <Badge tipo={a.tipo}>
                        {a.tipo === "ENTRADA" ? <FiLogIn size={12} className="inline mr-1" /> : <FiLogOut size={12} className="inline mr-1" />}
                        {a.tipo}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500">{a.nombreResidente}</td>
                    <td className="p-4">
                      <Badge tipo={a.esResidente ? "RESIDENTE" : "VISITANTE"}>
                        {a.esResidente ? "Residente" : "Visitante"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}