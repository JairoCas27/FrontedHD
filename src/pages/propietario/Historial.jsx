// src/pages/propietario/Historial.jsx

import { useEffect, useState } from "react";
import { Activity, LogIn, LogOut, Key, RotateCcw, Clock } from "lucide-react";
import { getHomeownerLogs } from "../../services/api";
import { colors, radius, shadow, transition } from "../../theme/colors";
import SectionHeader from "../../components/common/SectionHeader";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

const PAGE = {
  padding: "32px",
  maxWidth: "860px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const TYPE_META = {
  INGRESO: { icon: LogIn, color: colors.green, bg: colors.greenLight },
  SALIDA: { icon: LogOut, color: colors.red, bg: colors.redLight },
  PRESTAMO: { icon: Key, color: colors.blue, bg: colors.blueLight },
  DEVOLUCION: { icon: RotateCcw, color: colors.orange, bg: colors.orangeLight },
};

function TimelineItem({ log, isLast }) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[log.tipo] ?? { icon: Activity, color: colors.slateLight, bg: colors.background };
  const Icon = meta.icon;

  const fecha = log.fechaEntrada || log.fechaPrestamo || log.fechaSalida || log.fechaDevolucion || null;

  return (
    <div style={{ display: "flex", gap: "0", position: "relative" }}>
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
          <div
            style={{
              width: "2px",
              flex: 1,
              minHeight: "24px",
              background: colors.border,
              marginTop: "4px",
            }}
          />
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
            <StatusBadge status={log.tipo} />
          </div>
          {fecha && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={12} color={colors.slateLighter} />
              <span style={{ fontSize: "12px", color: colors.slateLighter }}>{fecha}</span>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "8px",
          }}
        >
          {[
            log.ocupante && { label: "Ocupante", value: log.ocupante },
            log.metodo && { label: "Método", value: log.metodo },
            log.fechaEntrada && { label: "Entrada", value: log.fechaEntrada },
            log.fechaSalida && { label: "Salida", value: log.fechaSalida },
            log.nombreSolicitante && { label: "Solicitante", value: log.nombreSolicitante },
            log.penalizacion > 0 && { label: "Penalización", value: `S/ ${log.penalizacion}` },
          ]
            .filter(Boolean)
            .map((item) => (
              <div key={item.label}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: colors.slateLighter,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.label}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
                  {item.value}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function Historial() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeownerLogs()
      .then((res) => setLogs(res?.items ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={PAGE}>
      <SectionHeader
        title="Historial"
        subtitle={`${logs.length} registro${logs.length !== 1 ? "s" : ""} encontrado${logs.length !== 1 ? "s" : ""}`}
      />

      {loading ? (
        <Loading />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="Sin registros de actividad"
          description="Aquí aparecerán los movimientos de entrada, salida y préstamo de tu apartamento."
        />
      ) : (
        <div>
          {logs.map((log, i) => (
            <TimelineItem key={log.id} log={log} isLast={i === logs.length - 1} />
          ))}
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}