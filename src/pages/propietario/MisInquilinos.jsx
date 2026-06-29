// src/pages/propietario/MisInquilinos.jsx

import { useEffect, useState } from "react";
import { Users, Plus, Trash2 } from "lucide-react";
import {
  getHomeownerTenants,
  createHomeownerTenant,
  deleteHomeownerTenant,
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
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
};

const DOC_OPTIONS = [
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carné de Extranjería" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "RUC", label: "RUC" },
];

function TenantCard({ tenant, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const initials = `${tenant.nombres?.[0] ?? ""}${tenant.apellidos?.[0] ?? ""}`.toUpperCase();

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
            borderRadius: "50%",
            background: colors.orangeLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "16px",
            color: colors.orange,
          }}
        >
          {initials}
        </div>
        <button
          onClick={() => onDelete(tenant)}
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
          {tenant.nombres} {tenant.apellidos}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
          Inquilino
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
          { label: "Tipo doc.", value: tenant.tipoDocumento },
          { label: "Nro. documento", value: tenant.numeroDocumento },
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

export default function MisInquilinos() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  const fetchTenants = () => {
    setLoading(true);
    getHomeownerTenants()
      .then((data) => setTenants(Array.isArray(data) ? data : []))
      .catch(() => showToast("Error al cargar inquilinos", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.nombres || !form.apellidos || !form.tipoDocumento || !form.numeroDocumento) {
      showToast("Completa todos los campos requeridos", "error");
      return;
    }
    try {
      setSaving(true);
      await createHomeownerTenant(form);
      showToast("Inquilino agregado correctamente", "success");
      setShowAdd(false);
      setForm(INITIAL_FORM);
      fetchTenants();
    } catch {
      showToast("Error al agregar inquilino", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteHomeownerTenant(deleteTarget.id);
      showToast("Inquilino eliminado", "success");
      setDeleteTarget(null);
      fetchTenants();
    } catch {
      showToast("Error al eliminar inquilino", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={PAGE}>
      <SectionHeader
        title="Mis Inquilinos"
        subtitle={`${tenants.length} inquilino${tenants.length !== 1 ? "s" : ""} registrado${tenants.length !== 1 ? "s" : ""}`}
        action={
          <ActionButton icon={Plus} onClick={() => setShowAdd(true)}>
            Agregar inquilino
          </ActionButton>
        }
      />

      {loading ? (
        <Loading />
      ) : tenants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin inquilinos registrados"
          description="Agrega los inquilinos de tu apartamento para gestionarlos aquí."
          action={
            <ActionButton icon={Plus} onClick={() => setShowAdd(true)}>
              Agregar inquilino
            </ActionButton>
          }
        />
      ) : (
        <div style={GRID}>
          {tenants.map((t) => (
            <TenantCard key={t.id} tenant={t} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal open={showAdd} title="Agregar inquilino" onClose={() => { setShowAdd(false); setForm(INITIAL_FORM); }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} placeholder="Juan" required />
            <FormField label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Pérez" required />
          </div>
          <FormField
            label="Tipo de documento"
            name="tipoDocumento"
            value={form.tipoDocumento}
            onChange={handleChange}
            options={DOC_OPTIONS}
            required
          />
          <FormField
            label="Número de documento"
            name="numeroDocumento"
            value={form.numeroDocumento}
            onChange={handleChange}
            placeholder="71234567"
            required
          />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px" }}>
            <ActionButton variant="ghost" onClick={() => { setShowAdd(false); setForm(INITIAL_FORM); }}>
              Cancelar
            </ActionButton>
            <ActionButton onClick={handleAdd} disabled={saving}>
              {saving ? "Guardando..." : "Guardar inquilino"}
            </ActionButton>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar inquilino"
        description={
          deleteTarget
            ? `¿Eliminar a ${deleteTarget.nombres} ${deleteTarget.apellidos} del apartamento?`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Toast toast={toast} onClose={clearToast} />
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}