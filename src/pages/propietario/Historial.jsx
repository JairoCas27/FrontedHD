import { useEffect, useState, useCallback, useMemo } from "react";
import { Activity, Car, ShoppingCart, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getHomeownerLogs } from "../../services/api";
import { colors, radius, shadow, transition } from "../../theme/colors";
import SectionHeader from "../../components/common/SectionHeader";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { Toast, useToast } from "../../components/common/Toast";

const PAGE_STYLE = {
  padding: "32px",
  maxWidth: "860px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  fechaInicio: "",
  fechaFin: "",
};

function formatFecha(str) {
  if (!str) return null;
  try {
    return new Date(str).toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return str;
  }
}

function obtenerFechaLog(log) {
  return log.fechaEntrada || log.fechaPrestamo || log.fechaSalida || log.fechaDevolucion || null;
}

function filtrarPorFecha(logs, filtros) {
  if (!filtros.fechaInicio && !filtros.fechaFin) return logs;
  return logs.filter((log) => {
    const fechaStr = obtenerFechaLog(log);
    if (!fechaStr) return false;
    const fecha = new Date(fechaStr);
    if (filtros.fechaInicio) {
      const desde = new Date(filtros.fechaInicio + "T00:00:00");
      if (fecha < desde) return false;
    }
    if (filtros.fechaFin) {
      const hasta = new Date(filtros.fechaFin + "T23:59:59");
      if (fecha > hasta) return false;
    }
    return true;
  });
}

function FilterBar({ filters, onChange, onReset, hasActiveFilters }) {
  const inputStyle = {
    padding: "8px 12px",
    borderRadius: radius.sm,
    border: `1px solid ${colors.border}`,
    fontSize: "13px",
    color: colors.slate,
    background: colors.white,
    fontFamily: "system-ui, sans-serif",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        background: colors.white,
        borderRadius: radius.md,
        padding: "16px 20px",
        border: `1px solid ${colors.border}`,
        boxShadow: shadow.sm,
        marginBottom: "20px",
        display: "flex",
        alignItems: "flex-end",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", fontWeight: 500, color: colors.slateLight }}>
          Desde
        </label>
        <input
          type="date"
          value={filters.fechaInicio}
          onChange={(e) => onChange("fechaInicio", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", fontWeight: 500, color: colors.slateLight }}>
          Hasta
        </label>
        <input
          type="date"
          value={filters.fechaFin}
          onChange={(e) => onChange("fechaFin", e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          style={inputStyle}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "8px 12px",
            borderRadius: radius.sm,
            border: `1px solid ${colors.border}`,
            background: "transparent",
            color: colors.slateLight,
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
            transition,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = colors.redLight; e.currentTarget.style.color = colors.red; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = colors.slateLight; }}
        >
          <X size={13} /> Limpiar fechas
        </button>
      )}

    </div>
  );
}

function Pagination({ pagina, totalPaginas, onPrev, onNext }) {
  if (totalPaginas <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        marginTop: "24px",
      }}
    >
      <button
        onClick={onPrev}
        disabled={pagina === 1}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 14px",
          borderRadius: radius.sm,
          border: `1px solid ${colors.border}`,
          background: colors.white,
          color: pagina === 1 ? colors.slateLighter : colors.slate,
          fontSize: "13px",
          cursor: pagina === 1 ? "not-allowed" : "pointer",
          fontFamily: "system-ui, sans-serif",
          transition,
        }}
      >
        <ChevronLeft size={14} /> Anterior
      </button>

      <span style={{ fontSize: "13px", color: colors.slateLight }}>
        Página <strong style={{ color: colors.slate }}>{pagina}</strong> de <strong style={{ color: colors.slate }}>{totalPaginas}</strong>
      </span>

      <button
        onClick={onNext}
        disabled={pagina === totalPaginas}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 14px",
          borderRadius: radius.sm,
          border: `1px solid ${colors.border}`,
          background: colors.white,
          color: pagina === totalPaginas ? colors.slateLighter : colors.slate,
          fontSize: "13px",
          cursor: pagina === totalPaginas ? "not-allowed" : "pointer",
          fontFamily: "system-ui, sans-serif",
          transition,
        }}
      >
        Siguiente <ChevronRight size={14} />
      </button>
    </div>
  );
}

function VehicularItem({ log, isLast }) {
  const [hovered, setHovered] = useState(false);

  const detalles = [
    log.ocupante && { label: "Ocupante", value: log.ocupante },
    log.datosInquilino && { label: "Inquilino", value: log.datosInquilino },
    log.metodo && { label: "Método", value: log.metodo },
    log.fechaEntrada && { label: "Entrada", value: formatFecha(log.fechaEntrada) },
    log.fechaSalida && { label: "Salida", value: formatFecha(log.fechaSalida) },
  ].filter(Boolean);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "20px", flexShrink: 0 }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: colors.blueLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${hovered ? colors.blue : colors.border}`,
            transition,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Car size={16} color={colors.blue} />
        </div>
        {!isLast && (
          <div style={{ width: "2px", flex: 1, minHeight: "24px", background: colors.border, marginTop: "4px" }} />
        )}
      </div>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1,
          background: colors.white,
          borderRadius: radius.md,
          padding: "16px 20px",
          marginBottom: isLast ? "0" : "12px",
          border: `1px solid ${hovered ? colors.orangeBorder : colors.border}`,
          boxShadow: hovered ? shadow.md : shadow.sm,
          transform: hovered ? "translateX(2px)" : "none",
          transition,
          animation: "fadeIn 0.3s ease both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: colors.slate }}>
              {log.placa || "—"}
            </span>
            <StatusBadge status={log.fechaSalida ? "SALIDA" : "INGRESO"} />
          </div>
          {log.fechaEntrada && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={12} color={colors.slateLighter} />
              <span style={{ fontSize: "12px", color: colors.slateLighter }}>{formatFecha(log.fechaEntrada)}</span>
            </div>
          )}
        </div>

        {detalles.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "8px",
            }}
          >
            {detalles.map((item) => (
              <div key={item.label}>
                <p style={{ margin: 0, fontSize: "11px", color: colors.slateLighter, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {item.label}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CarritoItem({ log, isLast }) {
  const [hovered, setHovered] = useState(false);

  const detalles = [
    log.nombreSolicitante && { label: "Solicitante", value: log.nombreSolicitante },
    log.dniSolicitante && { label: "DNI solic.", value: log.dniSolicitante },
    log.fechaPrestamo && { label: "Préstamo", value: formatFecha(log.fechaPrestamo) },
    log.fechaDevolucion && { label: "Devolución", value: formatFecha(log.fechaDevolucion) },
    log.penalizacion > 0 && { label: "Penalización", value: `S/ ${log.penalizacion}` },
  ].filter(Boolean);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "20px", flexShrink: 0 }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: colors.orangeLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${hovered ? colors.orange : colors.border}`,
            transition,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <ShoppingCart size={16} color={colors.orange} />
        </div>
        {!isLast && (
          <div style={{ width: "2px", flex: 1, minHeight: "24px", background: colors.border, marginTop: "4px" }} />
        )}
      </div>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1,
          background: colors.white,
          borderRadius: radius.md,
          padding: "16px 20px",
          marginBottom: isLast ? "0" : "12px",
          border: `1px solid ${hovered ? colors.orangeBorder : colors.border}`,
          boxShadow: hovered ? shadow.md : shadow.sm,
          transform: hovered ? "translateX(2px)" : "none",
          transition,
          animation: "fadeIn 0.3s ease both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: colors.slate }}>
              Carrito #{log.id}
            </span>
            <StatusBadge status={log.fechaDevolucion ? "DEVOLUCION" : "PRESTAMO"} />
          </div>
          {log.fechaPrestamo && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={12} color={colors.slateLighter} />
              <span style={{ fontSize: "12px", color: colors.slateLighter }}>{formatFecha(log.fechaPrestamo)}</span>
            </div>
          )}
        </div>

        {detalles.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "8px",
            }}
          >
            {detalles.map((item) => (
              <div key={item.label}>
                <p style={{ margin: 0, fontSize: "11px", color: colors.slateLighter, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {item.label}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Historial() {
  const [tabActiva, setTabActiva] = useState("VEHICULAR");

  const [logsVehicular, setLogsVehicular] = useState([]);
  const [loadingVehicular, setLoadingVehicular] = useState(true);
  const [paginaVehicular, setPaginaVehicular] = useState(1);
  const [totalPaginasVehicular, setTotalPaginasVehicular] = useState(1);
  const [totalVehicular, setTotalVehicular] = useState(0);
  const [filtrosVehicular, setFiltrosVehicular] = useState(INITIAL_FILTERS);

  const [logsCarrito, setLogsCarrito] = useState([]);
  const [loadingCarrito, setLoadingCarrito] = useState(true);
  const [paginaCarrito, setPaginaCarrito] = useState(1);
  const [totalPaginasCarrito, setTotalPaginasCarrito] = useState(1);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [filtrosCarrito, setFiltrosCarrito] = useState(INITIAL_FILTERS);

  const { toast, showToast, clearToast } = useToast();

  const fetchVehicular = useCallback((page) => {
    setLoadingVehicular(true);
    getHomeownerLogs({ type: "VEHICULAR", page: page - 1, size: PAGE_SIZE })
      .then((res) => {
        setLogsVehicular(res?.items ?? []);
        setTotalVehicular(res?.total ?? 0);
        setTotalPaginasVehicular(res?.totalPaginas ?? 1);
      })
      .catch(() => showToast("Error al cargar el historial vehicular", "error"))
      .finally(() => setLoadingVehicular(false));
  }, []);

  const fetchCarrito = useCallback((page) => {
    setLoadingCarrito(true);
    getHomeownerLogs({ type: "CARRITO", page: page - 1, size: PAGE_SIZE })
      .then((res) => {
        setLogsCarrito(res?.items ?? []);
        setTotalCarrito(res?.total ?? 0);
        setTotalPaginasCarrito(res?.totalPaginas ?? 1);
      })
      .catch(() => showToast("Error al cargar el historial de carritos", "error"))
      .finally(() => setLoadingCarrito(false));
  }, []);

  useEffect(() => {
    fetchVehicular(paginaVehicular);
  }, [paginaVehicular, fetchVehicular]);

  useEffect(() => {
    fetchCarrito(paginaCarrito);
  }, [paginaCarrito, fetchCarrito]);

  const logsVehicularFiltrados = useMemo(
    () => filtrarPorFecha(logsVehicular, filtrosVehicular),
    [logsVehicular, filtrosVehicular]
  );

  const logsCarritoFiltrados = useMemo(
    () => filtrarPorFecha(logsCarrito, filtrosCarrito),
    [logsCarrito, filtrosCarrito]
  );

  const handleFilterVehicularChange = (key, value) => {
    setFiltrosVehicular((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterCarritoChange = (key, value) => {
    setFiltrosCarrito((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetVehicular = () => {
    setFiltrosVehicular(INITIAL_FILTERS);
  };

  const handleResetCarrito = () => {
    setFiltrosCarrito(INITIAL_FILTERS);
  };

  const hasActiveVehicular = !!(filtrosVehicular.fechaInicio || filtrosVehicular.fechaFin);
  const hasActiveCarrito = !!(filtrosCarrito.fechaInicio || filtrosCarrito.fechaFin);

  return (
    <div style={PAGE_STYLE}>
      <SectionHeader
        title="Historial"
        subtitle={
          tabActiva === "VEHICULAR"
            ? `${totalVehicular} registro${totalVehicular !== 1 ? "s" : ""} de acceso vehicular`
            : `${totalCarrito} registro${totalCarrito !== 1 ? "s" : ""} de préstamo de carrito`
        }
      />

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: colors.white, padding: "6px", borderRadius: radius.md, border: `1px solid ${colors.border}`, width: "fit-content" }}>
        <button
          onClick={() => setTabActiva("VEHICULAR")}
          style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: radius.sm,
            border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px",
            background: tabActiva === "VEHICULAR" ? colors.blue : "transparent",
            color: tabActiva === "VEHICULAR" ? colors.white : colors.slateLight,
            fontFamily: "system-ui, sans-serif",
            transition,
          }}
        >
          <Car size={15} /> Vehicular
        </button>
        <button
          onClick={() => setTabActiva("CARRITO")}
          style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: radius.sm,
            border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px",
            background: tabActiva === "CARRITO" ? colors.blue : "transparent",
            color: tabActiva === "CARRITO" ? colors.white : colors.slateLight,
            fontFamily: "system-ui, sans-serif",
            transition,
          }}
        >
          <ShoppingCart size={15} /> Carritos
        </button>
      </div>

      {tabActiva === "VEHICULAR" ? (
        <>
          <FilterBar
            filters={filtrosVehicular}
            onChange={handleFilterVehicularChange}
            onReset={handleResetVehicular}
            hasActiveFilters={hasActiveVehicular}
          />

          {loadingVehicular ? (
            <Loading />
          ) : logsVehicularFiltrados.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Sin registros de acceso vehicular"
              description="No hay registros que coincidan con el filtro de fechas en esta página."
            />
          ) : (
            <>
              <div>
                {logsVehicularFiltrados.map((log, i) => (
                  <VehicularItem key={log.id} log={log} isLast={i === logsVehicularFiltrados.length - 1} />
                ))}
              </div>

              <Pagination
                pagina={paginaVehicular}
                totalPaginas={totalPaginasVehicular}
                onPrev={() => setPaginaVehicular((p) => Math.max(1, p - 1))}
                onNext={() => setPaginaVehicular((p) => Math.min(totalPaginasVehicular, p + 1))}
              />
            </>
          )}
        </>
      ) : (
        <>
          <FilterBar
            filters={filtrosCarrito}
            onChange={handleFilterCarritoChange}
            onReset={handleResetCarrito}
            hasActiveFilters={hasActiveCarrito}
          />

          {loadingCarrito ? (
            <Loading />
          ) : logsCarritoFiltrados.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Sin registros de préstamo de carritos"
              description="No hay registros que coincidan con el filtro de fechas en esta página."
            />
          ) : (
            <>
              <div>
                {logsCarritoFiltrados.map((log, i) => (
                  <CarritoItem key={log.id} log={log} isLast={i === logsCarritoFiltrados.length - 1} />
                ))}
              </div>

              <Pagination
                pagina={paginaCarrito}
                totalPaginas={totalPaginasCarrito}
                onPrev={() => setPaginaCarrito((p) => Math.max(1, p - 1))}
                onNext={() => setPaginaCarrito((p) => Math.min(totalPaginasCarrito, p + 1))}
              />
            </>
          )}
        </>
      )}

      <Toast toast={toast} onClose={clearToast} />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}