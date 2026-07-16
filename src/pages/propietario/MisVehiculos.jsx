// src/pages/propietario/MisVehiculos.jsx

import { useEffect, useState, useCallback } from "react";
import { Car, Plus, Trash2, ParkingSquare, X, Pencil, AlertTriangle } from "lucide-react";
import {
  getHomeownerVehicles,
  createHomeownerVehicle,
  updateHomeownerVehicle,
  deleteHomeownerVehicle,
  getHomeownerTenants,
  getHomeownerParkingSpots,
  assignHomeownerVehicleParking,
} from "../../services/api";
import { colors, radius, shadow, transition } from "../../theme/colors";
import SectionHeader from "../../components/common/SectionHeader";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import ActionButton from "../../components/common/ActionButton";
import ConfirmModal from "../../components/common/ConfirmModal";
import Modal from "../../components/common/Modal";
import FormField from "../../components/common/FormField";
import { Toast, useToast } from "../../components/common/Toast";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PAGE = {
  padding: "32px",
  maxWidth: "1100px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "16px",
};

const INITIAL_FORM = {
  marca:       "",
  modelo:      "",
  color:       "",
  placa:       "",
  tipo:        "",
  inquilinoId: "",
};

const INITIAL_EDIT_FORM = {
  marca:  "",
  modelo: "",
  color:  "",
  placa:  "",
};

const INITIAL_ERRORS = {
  marca:  "",
  modelo: "",
  color:  "",
  placa:  "",
  tipo:   "",
};

const INITIAL_EDIT_ERRORS = {
  marca:  "",
  modelo: "",
  color:  "",
  placa:  "",
};

const TIPO_OPTIONS = [
  { value: "AUTO",      label: "Auto"      },
  { value: "CAMIONETA", label: "Camioneta" },
  { value: "MOTO",      label: "Moto"      },
  { value: "OTRO",      label: "Otro"      },
];

// ─── Validación y normalización ───────────────────────────────────────────────

const PLACA_PATTERN  = /^[A-Z]{3}-\d{3}$|^[A-Z]\d[A-Z]-\d{3}$/;
const NOMBRE_PATTERN = /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü0-9\s\-\.]{2,}$/;
const COLOR_PATTERN  = /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]{3,}$/;

function capitalize(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (l) => l.toUpperCase());
}

function normalizePlaca(raw) {
  const clean = raw.toUpperCase().replace(/\s/g, "");
  if (clean.includes("-")) return clean;
  if (clean.length >= 4) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  return clean;
}

function validateAddForm(form) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!NOMBRE_PATTERN.test(form.marca.trim())) {
    errors.marca = "Solo letras, números y espacios. Mínimo 2 caracteres.";
    valid = false;
  }
  if (!NOMBRE_PATTERN.test(form.modelo.trim())) {
    errors.modelo = "Solo letras, números y espacios. Mínimo 2 caracteres.";
    valid = false;
  }
  if (!COLOR_PATTERN.test(form.color.trim())) {
    errors.color = "Solo letras y espacios. Mínimo 3 caracteres.";
    valid = false;
  }
  if (!PLACA_PATTERN.test(normalizePlaca(form.placa))) {
    errors.placa = "Formato inválido. Ej: ABC-123 o A1B-234";
    valid = false;
  }
  if (!form.tipo) {
    errors.tipo = "Selecciona un tipo de vehículo.";
    valid = false;
  }

  return { errors, valid };
}

function validateEditForm(form) {
  const errors = { ...INITIAL_EDIT_ERRORS };
  let valid = true;

  if (!NOMBRE_PATTERN.test(form.marca.trim())) {
    errors.marca = "Solo letras, números y espacios. Mínimo 2 caracteres.";
    valid = false;
  }
  if (!NOMBRE_PATTERN.test(form.modelo.trim())) {
    errors.modelo = "Solo letras, números y espacios. Mínimo 2 caracteres.";
    valid = false;
  }
  if (!COLOR_PATTERN.test(form.color.trim())) {
    errors.color = "Solo letras y espacios. Mínimo 3 caracteres.";
    valid = false;
  }
  if (!PLACA_PATTERN.test(normalizePlaca(form.placa))) {
    errors.placa = "Formato inválido. Ej: ABC-123 o A1B-234";
    valid = false;
  }

  return { errors, valid };
}

// ─── Helpers de estacionamiento ───────────────────────────────────────────────

// Cuántos vehículos (sin contar el actual) están asignados a un spot
function countAssigned(vehicles, spotId, currentVehicleId) {
  return vehicles.filter(
    (v) => v.idEstacionamiento === spotId && v.id !== currentVehicleId
  ).length;
}

// Vehículos asignados a un spot (sin contar el actual)
function getOcupantes(vehicles, spotId, currentVehicleId) {
  return vehicles.filter(
    (v) => v.idEstacionamiento === spotId && v.id !== currentVehicleId
  );
}

// ─── Sub-componente: FieldError ───────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.red }}>
      {message}
    </p>
  );
}

// ─── Sub-componente: ParkingModal ─────────────────────────────────────────────

function ParkingModal({ open, vehicle, spots, vehicles, onClose, onSave, saving }) {
  const [selected, setSelected] = useState(vehicle?.idEstacionamiento ?? null);

  useEffect(() => {
    setSelected(vehicle?.idEstacionamiento ?? null);
  }, [vehicle]);

  if (!open || !vehicle) return null;

  const hasParking    = !!vehicle.idEstacionamiento;
  const selectedSpot  = spots.find((s) => s.id === selected) ?? null;
  const ocupantes     = selectedSpot ? getOcupantes(vehicles, selectedSpot.id, vehicle.id) : [];
  const willReplace   = selectedSpot && ocupantes.length >= selectedSpot.capacidadMaxima;

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
            {spots.map((spot) => {
              const isSelected    = selected === spot.id;
              const isActual      = vehicle.idEstacionamiento === spot.id;
              const assigned      = countAssigned(vehicles, spot.id, vehicle.id);
              const lleno         = assigned >= spot.capacidadMaxima;
              const tipoDistinto  = spot.tipoVehiculo !== vehicle.tipo;
              const disabled      = lleno && !isActual;

              return (
                <button
                  key={spot.id}
                  onClick={() => !disabled && setSelected(isActual ? spot.id : isSelected ? null : spot.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: radius.sm,
                    border: `1px solid ${isActual ? colors.blue : isSelected ? colors.orange : colors.border}`,
                    background: isActual ? colors.blueLight : isSelected ? colors.orangeLight : disabled ? colors.background : colors.white,
                    cursor: disabled ? "not-allowed" : "pointer",
                    fontFamily: "system-ui, sans-serif",
                    transition,
                    textAlign: "left",
                    opacity: disabled ? 0.55 : 1,
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <ParkingSquare
                      size={16}
                      color={isActual ? colors.blue : isSelected ? colors.orange : disabled ? colors.slateLighter : colors.slateLight}
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: isActual ? colors.blue : isSelected ? colors.orange : colors.slate }}>
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
                      background: isActual ? colors.blueLight : disabled ? colors.redLight : isSelected ? colors.orangeLight : colors.greenLight,
                      color: isActual ? colors.blue : disabled ? colors.red : isSelected ? colors.orange : colors.green,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      marginLeft: "8px",
                      marginTop: "2px",
                    }}
                  >
                    {isActual ? "ACTUAL" : disabled ? "LLENO" : isSelected ? "SELECCIONADO" : "Disponible"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Advertencia de reemplazo */}
        {willReplace && (
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
              {ocupantes.map((v) => (
                <p key={v.id} style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: 500, color: colors.slate }}>
                  · {v.marca} {v.modelo} ({v.placa})
                </p>
              ))}
            </div>
          </div>
        )}

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

// ─── Sub-componente: VehicleCard ──────────────────────────────────────────────

function VehicleCard({ vehicle, onDelete, onParking, onEdit }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.white,
        borderRadius: radius.lg,
        padding: "24px",
        border: `1px solid ${hovered ? colors.orangeBorder : colors.border}`,
        boxShadow: hovered ? shadow.hover : shadow.sm,
        transform: hovered ? "translateY(-3px)" : "none",
        transition,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        animation: "fadeIn 0.3s ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: radius.md,
            background: colors.blueLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Car size={22} color={colors.blue} />
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => onEdit(vehicle)}
            title="Editar vehículo"
            style={{
              background: hovered ? colors.blueLight : "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              padding: "6px",
              color: colors.blue,
              display: "flex",
              transition,
            }}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onParking(vehicle)}
            title="Gestionar estacionamiento"
            style={{
              background: hovered ? colors.orangeLight : "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              padding: "6px",
              color: colors.orange,
              display: "flex",
              transition,
            }}
          >
            <ParkingSquare size={15} />
          </button>
          <button
            onClick={() => onDelete(vehicle)}
            title="Eliminar vehículo"
            style={{
              background: hovered ? colors.redLight : "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              padding: "6px",
              color: colors.red,
              display: "flex",
              transition,
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div>
        <p style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: colors.slate }}>
          {vehicle.marca} {vehicle.modelo}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
          {vehicle.tipo}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "Placa", value: vehicle.placa },
          { label: "Color", value: vehicle.color },
        ].map((item) => (
          <div
            key={item.label}
            style={{ background: colors.background, borderRadius: radius.sm, padding: "10px 12px" }}
          >
            <p style={{ margin: 0, fontSize: "11px", color: colors.slateLighter, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {item.label}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 600, color: colors.slate }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        {vehicle.idEstacionamiento ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              background: colors.orangeLight,
              color: colors.orange,
              borderRadius: radius.xl,
              padding: "4px 10px",
              fontWeight: 600,
            }}
          >
            <ParkingSquare size={12} />
            Est. #{vehicle.idEstacionamiento}
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              background: colors.background,
              color: colors.slateLighter,
              borderRadius: radius.xl,
              padding: "4px 10px",
            }}
          >
            <ParkingSquare size={12} />
            Sin estacionamiento
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Sub-componente: campos comunes de formulario ─────────────────────────────

function VehicleFields({ form, errors, onChange }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <FormField label="Marca" name="marca" value={form.marca} onChange={onChange} placeholder="Toyota" required />
          <FieldError message={errors.marca} />
        </div>
        <div>
          <FormField label="Modelo" name="modelo" value={form.modelo} onChange={onChange} placeholder="Corolla" required />
          <FieldError message={errors.modelo} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <FormField label="Placa" name="placa" value={form.placa} onChange={onChange} placeholder="ABC-123" required />
          <p style={{ margin: "3px 0 0", fontSize: "11px", color: colors.slateLighter }}>
            Formato: ABC-123 o A1B-234
          </p>
          <FieldError message={errors.placa} />
        </div>
        <div>
          <FormField label="Color" name="color" value={form.color} onChange={onChange} placeholder="Blanco" required />
          <FieldError message={errors.color} />
        </div>
      </div>
    </>
  );
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function MisVehiculos() {
  const [vehicles,      setVehicles]      = useState([]);
  const [tenants,       setTenants]       = useState([]);
  const [spots,         setSpots]         = useState([]);
  const [loading,       setLoading]       = useState(true);

  const [showAdd,       setShowAdd]       = useState(false);
  const [addForm,       setAddForm]       = useState(INITIAL_FORM);
  const [addErrors,     setAddErrors]     = useState(INITIAL_ERRORS);
  const [saving,        setSaving]        = useState(false);

  const [editTarget,    setEditTarget]    = useState(null);
  const [editForm,      setEditForm]      = useState(INITIAL_EDIT_FORM);
  const [editErrors,    setEditErrors]    = useState(INITIAL_EDIT_ERRORS);
  const [updating,      setUpdating]      = useState(false);

  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [parkingTarget, setParkingTarget] = useState(null);
  const [savingParking, setSavingParking] = useState(false);

  const { toast, showToast, clearToast } = useToast();

  // ── Fetch paralelo ────────────────────────────────────────────────────────

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      getHomeownerVehicles().catch(() => []),
      getHomeownerTenants().catch(() => []),
      getHomeownerParkingSpots().catch(() => []),
    ])
      .then(([v, t, s]) => {
        setVehicles(Array.isArray(v) ? v : []);
        setTenants(Array.isArray(t) ? t : []);
        setSpots(Array.isArray(s) ? s : []);
      })
      .catch(() => showToast("Error al cargar datos", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Handlers agregar ──────────────────────────────────────────────────────

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
    if (addErrors[name]) setAddErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
    setAddForm(INITIAL_FORM);
    setAddErrors(INITIAL_ERRORS);
  };

  const handleAdd = async () => {
    const normalized = {
      ...addForm,
      marca:  capitalize(addForm.marca),
      modelo: capitalize(addForm.modelo),
      color:  capitalize(addForm.color),
      placa:  normalizePlaca(addForm.placa),
    };
    setAddForm(normalized);

    const { errors: newErrors, valid } = validateAddForm(normalized);
    setAddErrors(newErrors);
    if (!valid) return;

    try {
      setSaving(true);
      await createHomeownerVehicle({
        marca:   normalized.marca,
        modelo:  normalized.modelo,
        color:   normalized.color,
        placa:   normalized.placa,
        tipo:    normalized.tipo,
        ...(normalized.inquilinoId ? { inquilinoId: Number(normalized.inquilinoId) } : {}),
      });
      showToast("Vehículo agregado correctamente", "success");
      handleCloseAdd();
      fetchAll();
    } catch (err) {
      showToast(err.message || "Error al agregar vehículo", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Handlers editar ───────────────────────────────────────────────────────

  const handleOpenEdit = (vehicle) => {
    setEditTarget(vehicle);
    setEditForm({
      marca:  vehicle.marca  ?? "",
      modelo: vehicle.modelo ?? "",
      color:  vehicle.color  ?? "",
      placa:  vehicle.placa  ?? "",
    });
    setEditErrors(INITIAL_EDIT_ERRORS);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCloseEdit = () => {
    setEditTarget(null);
    setEditForm(INITIAL_EDIT_FORM);
    setEditErrors(INITIAL_EDIT_ERRORS);
  };

  const handleEdit = async () => {
    const normalized = {
      marca:  capitalize(editForm.marca),
      modelo: capitalize(editForm.modelo),
      color:  capitalize(editForm.color),
      placa:  normalizePlaca(editForm.placa),
    };
    setEditForm(normalized);

    const { errors: newErrors, valid } = validateEditForm(normalized);
    setEditErrors(newErrors);
    if (!valid) return;

    try {
      setUpdating(true);
      await updateHomeownerVehicle(editTarget.id, normalized);
      showToast("Vehículo actualizado correctamente", "success");
      handleCloseEdit();
      fetchAll();
    } catch (err) {
      showToast(err.message || "Error al actualizar vehículo", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ── Handler eliminar ──────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteHomeownerVehicle(deleteTarget.id);
      showToast("Vehículo eliminado", "success");
      setDeleteTarget(null);
      fetchAll();
    } catch (err) {
      showToast(err.message || "Error al eliminar vehículo", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Handler estacionamiento con lógica de reemplazo ───────────────────────

  const handleSaveParking = async (vehicleId, idEstacionamiento, allVehicles, allSpots) => {
    try {
      setSavingParking(true);

      if (idEstacionamiento !== null) {
        const spot = allSpots.find((s) => s.id === idEstacionamiento);
        if (spot) {
          const ocupantes = allVehicles.filter(
            (v) => v.idEstacionamiento === idEstacionamiento && v.id !== vehicleId
          );
          if (ocupantes.length >= spot.capacidadMaxima) {
            for (const v of ocupantes) {
              await assignHomeownerVehicleParking(v.id, null);
            }
          }
        }
      }

      await assignHomeownerVehicleParking(vehicleId, idEstacionamiento ?? null);
      showToast(
        idEstacionamiento ? "Estacionamiento asignado" : "Estacionamiento desasignado",
        "success"
      );
      setParkingTarget(null);
      fetchAll();
    } catch (err) {
      showToast(err.message || "Error al actualizar estacionamiento", "error");
    } finally {
      setSavingParking(false);
    }
  };

  // ── Opciones inquilinos ───────────────────────────────────────────────────

  const tenantOptions = tenants.map((t) => ({
    value: String(t.id),
    label: `${t.nombres} ${t.apellidos}`,
  }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={PAGE}>
      <SectionHeader
        title="Mis Vehículos"
        subtitle={`${vehicles.length} vehículo${vehicles.length !== 1 ? "s" : ""} registrado${vehicles.length !== 1 ? "s" : ""}`}
        action={
          <ActionButton icon={Plus} onClick={() => setShowAdd(true)}>
            Agregar vehículo
          </ActionButton>
        }
      />

      {loading ? (
        <Loading />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Sin vehículos registrados"
          description="Agrega tu primer vehículo para gestionarlo desde aquí."
          action={
            <ActionButton icon={Plus} onClick={() => setShowAdd(true)}>
              Agregar vehículo
            </ActionButton>
          }
        />
      ) : (
        <div style={GRID}>
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={handleOpenEdit}
              onDelete={setDeleteTarget}
              onParking={setParkingTarget}
            />
          ))}
        </div>
      )}

      {/* ── Modal: Agregar vehículo ── */}
      <Modal open={showAdd} title="Agregar vehículo" onClose={handleCloseAdd}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <VehicleFields form={addForm} errors={addErrors} onChange={handleAddChange} />

          <div>
            <FormField
              label="Tipo"
              name="tipo"
              value={addForm.tipo}
              onChange={handleAddChange}
              options={TIPO_OPTIONS}
              required
            />
            <FieldError message={addErrors.tipo} />
          </div>

          {tenantOptions.length > 0 && (
            <div>
              <FormField
                label="Asignar a inquilino (opcional)"
                name="inquilinoId"
                value={addForm.inquilinoId}
                onChange={handleAddChange}
                options={tenantOptions}
              />
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.slateLight }}>
                Si no seleccionas un inquilino, el vehículo quedará a tu nombre.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
            <ActionButton variant="ghost" onClick={handleCloseAdd} disabled={saving}>
              Cancelar
            </ActionButton>
            <ActionButton onClick={handleAdd} disabled={saving}>
              {saving ? "Guardando..." : "Guardar vehículo"}
            </ActionButton>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Editar vehículo ── */}
      <Modal
        open={!!editTarget}
        title={editTarget ? `Editar · ${editTarget.marca} ${editTarget.modelo}` : "Editar vehículo"}
        onClose={handleCloseEdit}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <VehicleFields form={editForm} errors={editErrors} onChange={handleEditChange} />

          {editTarget && (
            <div
              style={{
                background: colors.background,
                borderRadius: radius.sm,
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", color: colors.slateLight }}>Tipo</span>
              <span style={{ fontSize: "13px", fontWeight: 500, color: colors.slate }}>
                {editTarget.tipo}
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
            <ActionButton variant="ghost" onClick={handleCloseEdit} disabled={updating}>
              Cancelar
            </ActionButton>
            <ActionButton onClick={handleEdit} disabled={updating}>
              {updating ? "Guardando..." : "Guardar cambios"}
            </ActionButton>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Estacionamiento ── */}
      <ParkingModal
        open={!!parkingTarget}
        vehicle={parkingTarget}
        spots={spots}
        vehicles={vehicles}
        onClose={() => setParkingTarget(null)}
        onSave={handleSaveParking}
        saving={savingParking}
      />

      {/* ── Modal: Confirmar eliminación ── */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar vehículo"
        description={
          deleteTarget
            ? `¿Eliminar ${deleteTarget.marca} ${deleteTarget.modelo} (${deleteTarget.placa})?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Toast toast={toast} onClose={clearToast} />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}