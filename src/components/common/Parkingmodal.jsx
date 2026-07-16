// src/components/common/ParkingModal.jsx

import { useEffect, useState } from "react";
import { Car, ParkingSquare, X, AlertTriangle } from "lucide-react";
import { colors, radius, transition } from "../../theme/colors";
import Modal from "./Modal";
import ActionButton from "./ActionButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Cuenta cuántos vehículos (excluyendo el actual) están asignados a un spot
function countAssigned(vehicles, spotId, currentVehicleId) {
  return vehicles.filter(
    (v) => v.idEstacionamiento === spotId && v.id !== currentVehicleId
  ).length;
}

// Obtiene los vehículos asignados a un spot (excluyendo el actual)
function getAssignedVehicles(vehicles, spotId, currentVehicleId) {
  return vehicles.filter(
    (v) => v.idEstacionamiento === spotId && v.id !== currentVehicleId
  );
}

// ─── Sub-componente: SpotButton ───────────────────────────────────────────────

function SpotButton({ spot, vehicle, vehicles, isSelected, onSelect }) {
  const assigned    = countAssigned(vehicles, spot.id, vehicle.id);
  const lleno       = assigned >= spot.capacidadMaxima;
  const tipoDistinto = spot.tipoVehiculo !== vehicle.tipo;
  // Si está lleno pero el vehículo actual ya estaba aquí, se puede reemplazar
  const currentIsHere = vehicle.idEstacionamiento === spot.id;

  const getStatus = () => {
    if (currentIsHere) return { label: "ACTUAL",      color: colors.blue,   bg: colors.blueLight   };
    if (lleno)         return { label: "LLENO",        color: colors.red,    bg: colors.redLight    };
    if (isSelected)    return { label: "SELECCIONADO", color: colors.orange, bg: colors.orangeLight };
    return               { label: "Disponible",        color: colors.green,  bg: colors.greenLight  };
  };

  const status   = getStatus();
  const disabled = lleno && !currentIsHere;

  return (
    <button
      onClick={() => !disabled && onSelect(spot.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderRadius: radius.sm,
        border: `1px solid ${isSelected ? colors.orange : currentIsHere ? colors.blue : colors.border}`,
        background: isSelected ? colors.orangeLight : currentIsHere ? colors.blueLight : disabled ? colors.background : colors.white,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "system-ui, sans-serif",
        transition,
        textAlign: "left",
        width: "100%",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <ParkingSquare
          size={16}
          color={isSelected ? colors.orange : currentIsHere ? colors.blue : disabled ? colors.slateLighter : colors.slateLight}
          style={{ marginTop: "2px", flexShrink: 0 }}
        />
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: isSelected ? colors.orange : currentIsHere ? colors.blue : colors.slate }}>
            Estacionamiento #{spot.numero}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: colors.slateLighter }}>
            Para {spot.tipoVehiculo} · {assigned}/{spot.capacidadMaxima} asignado{assigned !== 1 ? "s" : ""}
          </p>

          {/* Advertencia de tipo distinto */}
          {tipoDistinto && !disabled && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <AlertTriangle size={11} color={colors.orange} />
              <span style={{ fontSize: "11px", color: colors.orange }}>
                Espacio para {spot.tipoVehiculo} — tu vehículo es {vehicle.tipo}
              </span>
            </div>
          )}
        </div>
      </div>

      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: radius.xl,
          background: status.bg,
          color: status.color,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginLeft: "8px",
          marginTop: "2px",
        }}
      >
        {status.label}
      </span>
    </button>
  );
}

// ─── Sub-componente: ReplaceWarning ──────────────────────────────────────────

function ReplaceWarning({ spot, vehicles, vehicle }) {
  if (!spot) return null;
  const assigned = getAssignedVehicles(vehicles, spot.id, vehicle.id);
  const lleno    = assigned.length >= spot.capacidadMaxima;
  if (!lleno) return null;

  return (
    <div
      style={{
        background: colors.orangeLight,
        border: `1px solid ${colors.orangeBorder}`,
        borderRadius: radius.sm,
        padding: "12px 14px",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      <AlertTriangle size={16} color={colors.orange} style={{ flexShrink: 0, marginTop: "1px" }} />
      <div>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: colors.orange }}>
          Espacio lleno — se reemplazará un vehículo
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.slateLight }}>
          Al confirmar, se desasignará:
        </p>
        {assigned.map((v) => (
          <p key={v.id} style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: 500, color: colors.slate }}>
            · {v.marca} {v.modelo} ({v.placa})
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function ParkingModal({ open, vehicle, spots, vehicles, onClose, onSave, saving }) {
  const [selected, setSelected] = useState(vehicle?.idEstacionamiento ?? null);

  useEffect(() => {
    setSelected(vehicle?.idEstacionamiento ?? null);
  }, [vehicle]);

  if (!open || !vehicle) return null;

  const hasParking    = !!vehicle.idEstacionamiento;
  const selectedSpot  = spots.find((s) => s.id === selected) ?? null;
  const assignedCount = selectedSpot ? countAssigned(vehicles, selectedSpot.id, vehicle.id) : 0;
  const willReplace   = selectedSpot && assignedCount >= selectedSpot.capacidadMaxima;

  const handleSelect = (spotId) => {
    setSelected((prev) => (prev === spotId ? null : spotId));
  };

  return (
    <Modal
      open={open}
      title={hasParking ? "Cambiar estacionamiento" : "Asignar estacionamiento"}
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Info del vehículo */}
        <div
          style={{
            background: colors.background,
            borderRadius: radius.sm,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Car size={16} color={colors.blue} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: colors.slate }}>
            {vehicle.marca} {vehicle.modelo}
          </span>
          <span style={{ fontSize: "13px", color: colors.slateLight }}>
            · {vehicle.placa} · {vehicle.tipo}
          </span>
        </div>

        {/* Lista de spots */}
        {spots.length === 0 ? (
          <p style={{ fontSize: "14px", color: colors.slateLight, textAlign: "center", padding: "16px 0" }}>
            No hay estacionamientos disponibles para tu apartamento.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
            {spots.map((spot) => (
              <SpotButton
                key={spot.id}
                spot={spot}
                vehicle={vehicle}
                vehicles={vehicles}
                isSelected={selected === spot.id && vehicle.idEstacionamiento !== spot.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {/* Advertencia de reemplazo */}
        <ReplaceWarning spot={selectedSpot} vehicles={vehicles} vehicle={vehicle} />

        {/* Desasignar */}
        {hasParking && (
          <button
            onClick={() => setSelected(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 14px",
              borderRadius: radius.sm,
              border: `1px solid ${selected === null ? colors.red : colors.border}`,
              background: selected === null ? colors.redLight : "transparent",
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
              color: selected === null ? colors.red : colors.slateLight,
              fontSize: "13px",
              transition,
              width: "100%",
            }}
          >
            <X size={14} />
            Desasignar estacionamiento actual (#{vehicle.idEstacionamiento})
          </button>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
          <ActionButton variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </ActionButton>
          <ActionButton
            variant={willReplace ? "danger" : "primary"}
            onClick={() => onSave(vehicle.id, selected, vehicles, spots)}
            disabled={saving || selected === vehicle.idEstacionamiento}
          >
            {saving
              ? "Guardando..."
              : willReplace
                ? "Confirmar reemplazo"
                : "Guardar"}
          </ActionButton>
        </div>

      </div>
    </Modal>
  );
}