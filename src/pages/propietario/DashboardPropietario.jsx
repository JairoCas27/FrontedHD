// src/pages/propietario/DashboardPropietario.jsx

import { useEffect, useState } from "react";
import { Building2, Car, Users, Activity, ArrowRight, LogIn, LogOut } from "lucide-react";
import { getHomeownerDashboard, getHomeownerLogs } from "../../services/api";
import { colors, radius, shadow, transition } from "../../theme/colors";
import StatCard from "../../components/common/StatCard";
import InfoCard from "../../components/common/InfoCard";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const PAGE = {
  padding: "32px",
  maxWidth: "1200px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const GRID_4 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const GRID_2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "20px",
};

function LogItem({ log }) {
  const [hovered, setHovered] = useState(false);
  const isIngreso = log.tipo === "INGRESO";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 0",
        borderBottom: `1px solid ${colors.border}`,
        transition,
        background: hovered ? colors.background : "transparent",
        borderRadius: "8px",
        paddingLeft: hovered ? "8px" : "0",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: isIngreso ? colors.greenLight : colors.redLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isIngreso
          ? <LogIn size={16} color={colors.green} />
          : <LogOut size={16} color={colors.red} />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: colors.slate }}>
          {log.placa}
          {log.ocupante && (
            <span style={{ fontWeight: 400, color: colors.slateLight }}>
              {" · "}{log.ocupante}
            </span>
          )}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.slateLighter }}>
          {log.fechaEntrada || log.fechaPrestamo || "—"}
        </p>
      </div>
      <StatusBadge status={log.tipo} />
    </div>
  );
}

function ApartmentDetail({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <span style={{ fontSize: "13px", color: colors.slateLight }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 500, color: colors.slate }}>{value}</span>
    </div>
  );
}

export default function DashboardPropietario() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    getHomeownerDashboard()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoadingSummary(false));

    getHomeownerLogs()
      .then((res) => setLogs(res?.items ?? []))
      .catch(console.error)
      .finally(() => setLoadingLogs(false));
  }, []);

  const recentLogs = logs.slice(0, 6);

  return (
    <div style={PAGE}>
      <SectionHeader
        title="Dashboard"
        subtitle={
          summary
            ? `Apartamento ${summary.numeroApartamento} · ${summary.torreNombre}`
            : "Resumen de tu condominio"
        }
      />

      {loadingSummary ? (
        <Loading />
      ) : (
        <div style={GRID_4}>
          <StatCard
            icon={Building2}
            label="Apartamento"
            value={summary?.numeroApartamento ?? "—"}
            accent={colors.orange}
            bg={colors.orangeLight}
          />
          <StatCard
            icon={Car}
            label="Vehículos"
            value={summary?.totalVehiculos ?? 0}
            accent={colors.blue}
            bg={colors.blueLight}
          />
          <StatCard
            icon={Users}
            label="Inquilinos"
            value={summary?.totalInquilinos ?? 0}
            accent={colors.green}
            bg={colors.greenLight}
          />
          <StatCard
            icon={Activity}
            label="Movimientos recientes"
            value={summary?.totalLogsRecientes ?? 0}
            accent={colors.red}
            bg={colors.redLight}
          />
        </div>
      )}

      <div style={GRID_2}>
        <InfoCard title="Información del apartamento">
          {loadingSummary ? (
            <Loading text="" />
          ) : summary ? (
            <>
              <ApartmentDetail label="Torre" value={summary.torreNombre} />
              <ApartmentDetail label="Piso" value={summary.pisoNumero} />
              <ApartmentDetail label="Número" value={summary.numeroApartamento} />
              <ApartmentDetail label="Inquilinos registrados" value={summary.totalInquilinos} />
              <ApartmentDetail label="Vehículos registrados" value={summary.totalVehiculos} />
            </>
          ) : (
            <EmptyState icon={Building2} title="Sin información" />
          )}
        </InfoCard>

        <InfoCard title="Actividad reciente">
          {loadingLogs ? (
            <Loading text="" />
          ) : recentLogs.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Sin movimientos recientes"
              description="Aquí verás los ingresos y salidas de tu apartamento."
            />
          ) : (
            recentLogs.map((log) => <LogItem key={log.id} log={log} />)
          )}
        </InfoCard>
      </div>
    </div>
  );
}