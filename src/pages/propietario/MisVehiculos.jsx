// src/pages/propietario/MisVehiculos.jsx

import { useEffect, useState } from "react";
import { Car, Plus, Trash2 } from "lucide-react";
import {
  getHomeownerVehicles,
  createHomeownerVehicle,
  deleteHomeownerVehicle,
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
  marca: "",
  modelo: "",
  color: "",
  placa: "",
  tipo: "",
};

const TIPO_OPTIONS = [
  { value: "Auto", label: "Auto" },
  { value: "Camioneta", label: "Camioneta" },
  { value: "Moto", label: "Moto" },
  { value: "Otro", label: "Otro" },
];

function VehicleCard({ vehicle, onDelete }) {
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
        <button
          onClick={() => onDelete(vehicle)}
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

      <div>
        <p style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: colors.slate }}>
          {vehicle.marca} {vehicle.modelo}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
          {vehicle.tipo}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {[
          { label: "Placa", value: vehicle.placa },
          { label: "Color", value: vehicle.color },
          ...(vehicle.idEstacionamiento
            ? [{ label: "Estacionamiento", value: `#${vehicle.idEstacionamiento}` }]
            : []),
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: colors.background,
              borderRadius: radius.sm,
              padding: "10px 12px",
            }}
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
    </div>
  );
}

export default function MisVehiculos() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  const fetchVehicles = () => {
    setLoading(true);
    getHomeownerVehicles()
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch(() => showToast("Error al cargar vehículos", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.marca || !form.modelo || !form.placa || !form.tipo || !form.color) {
      showToast("Completa todos los campos requeridos", "error");
      return;
    }
    try {
      setSaving(true);
      await createHomeownerVehicle(form);
      showToast("Vehículo agregado correctamente", "success");
      setShowAdd(false);
      setForm(INITIAL_FORM);
      fetchVehicles();
    } catch {
      showToast("Error al agregar vehículo", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteHomeownerVehicle(deleteTarget.id);
      showToast("Vehículo eliminado", "success");
      setDeleteTarget(null);
      fetchVehicles();
    } catch {
      showToast("Error al eliminar vehículo", "error");
    } finally {
      setDeleting(false);
    }
  };

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
            <VehicleCard key={v.id} vehicle={v} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal open={showAdd} title="Agregar vehículo" onClose={() => { setShowAdd(false); setForm(INITIAL_FORM); }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="Marca" name="marca" value={form.marca} onChange={handleChange} placeholder="Toyota" required />
            <FormField label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Corolla" required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="Placa" name="placa" value={form.placa} onChange={handleChange} placeholder="ABC123" required />
            <FormField label="Color" name="color" value={form.color} onChange={handleChange} placeholder="Blanco" required />
          </div>
          <FormField
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={TIPO_OPTIONS}
            required
          />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px" }}>
            <ActionButton variant="ghost" onClick={() => { setShowAdd(false); setForm(INITIAL_FORM); }}>
              Cancelar
            </ActionButton>
            <ActionButton onClick={handleAdd} disabled={saving}>
              {saving ? "Guardando..." : "Guardar vehículo"}
            </ActionButton>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar vehículo"
        description={deleteTarget ? `¿Eliminar ${deleteTarget.marca} ${deleteTarget.modelo} (${deleteTarget.placa})?` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Toast toast={toast} onClose={clearToast} />
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}