// src/pages/propietario/MiApartamento.jsx

import { useEffect, useState } from "react";
import { Building2, Car, Users, CheckCircle, XCircle, Maximize2 } from "lucide-react";
import { getHomeownerApartment } from "../../services/api";
import { colors, radius, shadow, transition } from "../../theme/colors";
import InfoCard from "../../components/common/InfoCard";
import SectionHeader from "../../components/common/SectionHeader";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const PAGE = {
  padding: "32px",
  maxWidth: "1100px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

function DetailRow({ label, value, icon: Icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: `1px solid ${colors.border}`,
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {Icon && <Icon size={15} color={colors.slateLight} />}
        <span style={{ fontSize: "13px", color: colors.slateLight }}>{label}</span>
      </div>
      <span style={{ fontSize: "14px", fontWeight: 500, color: colors.slate }}>{value}</span>
    </div>
  );
}

function VehicleCard({ v }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.white,
        borderRadius: radius.md,
        padding: "18px 20px",
        border: `1px solid ${hovered ? colors.orangeBorder : colors.border}`,
        boxShadow: hovered ? shadow.md : shadow.sm,
        transform: hovered ? "translateY(-2px)" : "none",
        transition,
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: radius.sm,
          background: colors.blueLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Car size={20} color={colors.blue} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, color: colors.slate, fontSize: "14px" }}>
          {v.marca} {v.modelo}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.slateLight }}>
          {v.placa} · {v.color} · {v.tipo}
        </p>
      </div>
      {v.idEstacionamiento && (
        <span
          style={{
            fontSize: "12px",
            background: colors.orangeLight,
            color: colors.orange,
            borderRadius: radius.xl,
            padding: "3px 10px",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          Est. #{v.idEstacionamiento}
        </span>
      )}
    </div>
  );
}

function TenantCard({ t }) {
  const [hovered, setHovered] = useState(false);
  const initials = `${t.nombres?.[0] ?? ""}${t.apellidos?.[0] ?? ""}`.toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.white,
        borderRadius: radius.md,
        padding: "18px 20px",
        border: `1px solid ${hovered ? colors.orangeBorder : colors.border}`,
        boxShadow: hovered ? shadow.md : shadow.sm,
        transform: hovered ? "translateY(-2px)" : "none",
        transition,
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: colors.orangeLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontWeight: 700,
          fontSize: "14px",
          color: colors.orange,
        }}
      >
        {initials}
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 600, color: colors.slate, fontSize: "14px" }}>
          {t.nombres} {t.apellidos}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.slateLight }}>
          {t.tipoDocumento} · {t.numeroDocumento}
        </p>
      </div>
    </div>
  );
}

export default function MiApartamento() {
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeownerApartment()
      .then(setApt)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={PAGE}>
        <SectionHeader title="Mi Apartamento" />
        <Loading />
      </div>
    );
  }

  if (!apt) {
    return (
      <div style={PAGE}>
        <SectionHeader title="Mi Apartamento" />
        <EmptyState icon={Building2} title="No se encontró información del apartamento" />
      </div>
    );
  }

  return (
    <div style={PAGE}>
      <SectionHeader
        title="Mi Apartamento"
        subtitle={`${apt.torreNombre} · Piso ${apt.pisoNumero} · Apto ${apt.numero}`}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <InfoCard title="Datos del apartamento">
          <DetailRow label="Número" value={apt.numero} icon={Building2} />
          <DetailRow label="Torre" value={apt.torreNombre} icon={Building2} />
          <DetailRow label="Piso" value={apt.pisoNumero} icon={Building2} />
          <DetailRow label="Metraje" value={`${apt.metraje} m²`} icon={Maximize2} />
          <DetailRow label="Total vehículos" value={apt.totalVehiculos} icon={Car} />
          <DetailRow label="Total inquilinos" value={apt.totalInquilinos} icon={Users} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "13px 0",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "13px", color: colors.slateLight }}>
              Derecho de estacionamiento
            </span>
            {apt.derechoEstacionamiento ? (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <CheckCircle size={15} color={colors.green} />
                <span style={{ fontSize: "13px", fontWeight: 500, color: colors.green }}>Sí</span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <XCircle size={15} color={colors.red} />
                <span style={{ fontSize: "13px", fontWeight: 500, color: colors.red }}>No</span>
              </div>
            )}
          </div>
        </InfoCard>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <InfoCard title={`Vehículos (${apt.vehiculos?.length ?? 0})`}>
            {apt.vehiculos?.length === 0 ? (
              <EmptyState icon={Car} title="Sin vehículos registrados" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {apt.vehiculos.map((v) => (
                  <VehicleCard key={v.id} v={v} />
                ))}
              </div>
            )}
          </InfoCard>

          <InfoCard title={`Inquilinos (${apt.inquilinos?.length ?? 0})`}>
            {apt.inquilinos?.length === 0 ? (
              <EmptyState icon={Users} title="Sin inquilinos registrados" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {apt.inquilinos.map((t) => (
                  <TenantCard key={t.id} t={t} />
                ))}
              </div>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
}