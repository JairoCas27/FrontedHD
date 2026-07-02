// src/pages/propietario/Historial.jsx

import { useEffect, useState, useCallback } from "react";
import { Activity, LogIn, LogOut, Key, RotateCcw, Clock, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { getHomeownerLogs } from "../../services/api";
import { colors, radius, shadow, transition } from "../../theme/colors";
import SectionHeader from "../../components/common/SectionHeader";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import ActionButton from "../../components/common/ActionButton";
import { Toast, useToast } from "../../components/common/Toast";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PAGE_STYLE = {
  padding: "32px",
  maxWidth: "860px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const PAGE_SIZE = 10;

// Tipos disponibles según el backend (campo "type" requerido)
const TIPO_OPTIONS = [
  { value: "INGRESO",    label: "Ingreso"    },
  { value: "SALIDA",     label: "Salida"     },
  { value: "PRESTAMO",   label: "Préstamo"   },
  { value: "DEVOLUCION", label: "Devolución" },
];

const TYPE_META = {
  INGRESO:    { icon: LogIn,     color: colors.green,  bg: colors.greenLight  },
  SALIDA:     { icon: LogOut,    color: colors.red,    bg: colors.redLight    },
  PRESTAMO:   { icon: Key,       color: colors.blue,   bg: colors.blueLight   },
  DEVOLUCION: { icon: RotateCcw, color: colors.orange, bg: colors.orangeLight },
};

const INITIAL_FILTERS = {
  type:        "INGRESO",
  fechaInicio: "",
  fechaFin:    "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatFecha(str) {
  if (!str) return null;
  try {
    return new Date(str).toLocaleString("es-PE", {
      day:    "2-digit",
      month:  "2-digit",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return str;
  }
}

// ─── Sub-componente: Filtros ──────────────────────────────────────────────────

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
      {/* Tipo — requerido por el backend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", fontWeight: 500, color: colors.slateLight }}>
          Tipo <span style={{ color: colors.red }}>*</span>
        </label>
        <select
          value={filters.type}
          onChange={(e) => onChange("type", e.target.value)}
          style={inputStyle}
        >
          {TIPO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Fecha inicio */}
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

      {/* Fecha fin */}
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

      {/* Limpiar filtros opcionales */}
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

// ─── Sub-componente: Paginación ───────────────────────────────────────────────

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

// ─── Sub-componente: TimelineItem ─────────────────────────────────────────────

function TimelineItem({ log, isLast }) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[log.tipo] ?? { icon: Activity, color: colors.slateLight, bg: colors.background };
  const Icon = meta.icon;

  const fechaPrincipal = formatFecha(
    log.fechaEntrada || log.fechaPrestamo || log.fechaSalida || log.fechaDevolucion
  );

  const detalles = [
    log.ocupante          && { label: "Ocupante",    value: log.ocupante          },
    log.datosInquilino    && { label: "Inquilino",   value: log.datosInquilino    },
    log.metodo            && { label: "Método",      value: log.metodo            },
    log.fechaEntrada      && { label: "Entrada",     value: formatFecha(log.fechaEntrada)  },
    log.fechaSalida       && { label: "Salida",      value: formatFecha(log.fechaSalida)   },
    log.fechaPrestamo     && { label: "Préstamo",    value: formatFecha(log.fechaPrestamo) },
    log.fechaDevolucion   && { label: "Devolución",  value: formatFecha(log.fechaDevolucion) },
    log.nombreSolicitante && { label: "Solicitante", value: log.nombreSolicitante  },
    log.dniSolicitante    && { label: "DNI solic.",  value: log.dniSolicitante     },
    log.penalizacion > 0  && { label: "Penalización",value: `S/ ${log.penalizacion}` },
  ].filter(Boolean);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      {/* Línea de tiempo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "20px", flexShrink: 0 }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: meta.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${hovered ? meta.color : colors.border}`,
            transition,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Icon size={16} color={meta.color} />
        </div>
        {!isLast && (
          <div style={{ width: "2px", flex: 1, minHeight: "24px", background: colors.border, marginTop: "4px" }} />
        )}
      </div>

      {/* Card del evento */}
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
        {/* Cabecera */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, fontSize: "15px", color: colors.slate }}>
              {log.placa || "—"}
            </span>
            <StatusBadge status={log.tipo} />
          </div>
          {fechaPrincipal && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={12} color={colors.slateLighter} />
              <span style={{ fontSize: "12px", color: colors.slateLighter }}>{fechaPrincipal}</span>
            </div>
          )}
        </div>

        {/* Detalles */}
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

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function Historial() {
  const [logs,         setLogs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [pagina,       setPagina]       = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total,        setTotal]        = useState(0);
  const [filters,      setFilters]      = useState(INITIAL_FILTERS);
  const { toast, showToast, clearToast } = useToast();

  const fetchLogs = useCallback((page, activeFilters) => {
    setLoading(true);

    // Construir params — "type" es requerido, resto opcionales
    const params = {
      type: activeFilters.type,
      page: page - 1,      // backend usa índice 0
      size: PAGE_SIZE,
      ...(activeFilters.fechaInicio && { fechaInicio: activeFilters.fechaInicio }),
      ...(activeFilters.fechaFin    && { fechaFin:    activeFilters.fechaFin    }),
    };

    getHomeownerLogs(params)
      .then((res) => {
        setLogs(res?.items ?? []);
        setTotal(res?.total ?? 0);
        setTotalPaginas(res?.totalPaginas ?? 1);
      })
      .catch(() => showToast("Error al cargar el historial", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Refetch cuando cambian filtros o página
  useEffect(() => {
    fetchLogs(pagina, filters);
  }, [pagina, filters, fetchLogs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagina(1); // resetear a página 1 al filtrar
  };

  const handleResetFechas = () => {
    setFilters((prev) => ({ ...prev, fechaInicio: "", fechaFin: "" }));
    setPagina(1);
  };

  const hasActiveFechas = !!(filters.fechaInicio || filters.fechaFin);

  return (
    <div style={PAGE_STYLE}>
      <SectionHeader
        title="Historial"
        subtitle={`${total} registro${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
      />

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFechas}
        hasActiveFilters={hasActiveFechas}
      />

      {loading ? (
        <Loading />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="Sin registros de actividad"
          description={`No hay registros de tipo "${filters.type}" en el período seleccionado.`}
        />
      ) : (
        <>
          <div>
            {logs.map((log, i) => (
              <TimelineItem
                key={log.id}
                log={log}
                isLast={i === logs.length - 1}
              />
            ))}
          </div>

          <Pagination
            pagina={pagina}
            totalPaginas={totalPaginas}
            onPrev={() => setPagina((p) => Math.max(1, p - 1))}
            onNext={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          />
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