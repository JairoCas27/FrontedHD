// src/pages/propietario/MisInquilinos.jsx

import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Pencil } from "lucide-react";
import {
  getHomeownerTenants,
  createHomeownerTenant,
  updateHomeownerTenant,
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
  nombres:         "",
  apellidos:       "",
  tipoDocumento:   "",
  numeroDocumento: "",
};

const INITIAL_ERRORS = {
  nombres:         "",
  apellidos:       "",
  tipoDocumento:   "",
  numeroDocumento: "",
};

const DOC_OPTIONS = [
  { value: "DNI",       label: "DNI"                 },
  { value: "CE",        label: "Carné de Extranjería" },
  { value: "PASAPORTE", label: "Pasaporte"             },
  { value: "RUC",       label: "RUC"                  },
];

// ─── Validación ───────────────────────────────────────────────────────────────

const DOC_RULES = {
  DNI:       { pattern: /^\d{8}$/,            hint: "8 dígitos numéricos"              },
  CE:        { pattern: /^[A-Za-z0-9]{9}$/,   hint: "9 caracteres alfanuméricos"       },
  PASAPORTE: { pattern: /^[A-Za-z0-9]{6,12}$/, hint: "6 a 12 caracteres alfanuméricos" },
  RUC:       { pattern: /^\d{11}$/,            hint: "11 dígitos numéricos"             },
};

const NOMBRE_PATTERN = /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]{2,}$/;

function validateForm(form) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!NOMBRE_PATTERN.test(form.nombres.trim())) {
    errors.nombres = "Solo letras, mínimo 2 caracteres.";
    valid = false;
  }
  if (!NOMBRE_PATTERN.test(form.apellidos.trim())) {
    errors.apellidos = "Solo letras, mínimo 2 caracteres.";
    valid = false;
  }
  if (!form.tipoDocumento) {
    errors.tipoDocumento = "Selecciona un tipo de documento.";
    valid = false;
  }
  if (!form.numeroDocumento.trim()) {
    errors.numeroDocumento = "Ingresa el número de documento.";
    valid = false;
  } else if (form.tipoDocumento && DOC_RULES[form.tipoDocumento]) {
    const rule = DOC_RULES[form.tipoDocumento];
    if (!rule.pattern.test(form.numeroDocumento.trim())) {
      errors.numeroDocumento = `Formato inválido: ${rule.hint}.`;
      valid = false;
    }
  }

  return { errors, valid };
}

// ─── Sub-componentes utilitarios ──────────────────────────────────────────────

function DocHint({ tipoDocumento }) {
  if (!tipoDocumento || !DOC_RULES[tipoDocumento]) return null;
  return (
    <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.slateLight }}>
      {DOC_RULES[tipoDocumento].hint}
    </p>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.red }}>
      {message}
    </p>
  );
}

// ─── Sub-componente: TenantForm (reutilizado en agregar y editar) ─────────────

function TenantForm({ form, errors, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <FormField
            label="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={onChange}
            placeholder="Juan"
            required
          />
          <FieldError message={errors.nombres} />
        </div>
        <div>
          <FormField
            label="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={onChange}
            placeholder="Pérez"
            required
          />
          <FieldError message={errors.apellidos} />
        </div>
      </div>

      <div>
        <FormField
          label="Tipo de documento"
          name="tipoDocumento"
          value={form.tipoDocumento}
          onChange={onChange}
          options={DOC_OPTIONS}
          required
        />
        <FieldError message={errors.tipoDocumento} />
      </div>

      <div>
        <FormField
          label="Número de documento"
          name="numeroDocumento"
          value={form.numeroDocumento}
          onChange={onChange}
          placeholder={
            form.tipoDocumento === "DNI"       ? "Ej: 71234567"    :
            form.tipoDocumento === "CE"        ? "Ej: A12345678"   :
            form.tipoDocumento === "PASAPORTE" ? "Ej: AB123456"    :
            form.tipoDocumento === "RUC"       ? "Ej: 20123456789" :
            "Número de documento"
          }
          required
        />
        <DocHint tipoDocumento={form.tipoDocumento} />
        <FieldError message={errors.numeroDocumento} />
      </div>

    </div>
  );
}

// ─── Sub-componente: TenantCard ───────────────────────────────────────────────

function TenantCard({ tenant, onDelete, onEdit }) {
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
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => onEdit(tenant)}
            title="Editar inquilino"
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
            onClick={() => onDelete(tenant)}
            title="Eliminar inquilino"
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
          {tenant.nombres} {tenant.apellidos}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
          Inquilino
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "Tipo doc.",      value: tenant.tipoDocumento  },
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
            <p style={{
              margin: 0,
              fontSize: "11px",
              color: colors.slateLighter,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
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

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function MisInquilinos() {
  const [tenants,      setTenants]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  // Estado modal agregar
  const [showAdd,      setShowAdd]      = useState(false);
  const [addForm,      setAddForm]      = useState(INITIAL_FORM);
  const [addErrors,    setAddErrors]    = useState(INITIAL_ERRORS);
  const [saving,       setSaving]       = useState(false);

  // Estado modal editar
  const [editTarget,   setEditTarget]   = useState(null);
  const [editForm,     setEditForm]     = useState(INITIAL_FORM);
  const [editErrors,   setEditErrors]   = useState(INITIAL_ERRORS);
  const [updating,     setUpdating]     = useState(false);

  // Estado eliminar
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const { toast, showToast, clearToast } = useToast();

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchTenants = () => {
    setLoading(true);
    getHomeownerTenants()
      .then((data) => setTenants(Array.isArray(data) ? data : []))
      .catch(() => showToast("Error al cargar inquilinos", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTenants(); }, []);

  // ── Handlers agregar ──────────────────────────────────────────────────────

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    if (name === "tipoDocumento") {
      setAddForm((prev) => ({ ...prev, tipoDocumento: value, numeroDocumento: "" }));
      setAddErrors((prev) => ({ ...prev, tipoDocumento: "", numeroDocumento: "" }));
      return;
    }
    setAddForm((prev) => ({ ...prev, [name]: value }));
    if (addErrors[name]) setAddErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
    setAddForm(INITIAL_FORM);
    setAddErrors(INITIAL_ERRORS);
  };

  const handleAdd = async () => {
    const { errors: newErrors, valid } = validateForm(addForm);
    setAddErrors(newErrors);
    if (!valid) return;

    try {
      setSaving(true);
      await createHomeownerTenant({
        nombres:         addForm.nombres.trim(),
        apellidos:       addForm.apellidos.trim(),
        tipoDocumento:   addForm.tipoDocumento,
        numeroDocumento: addForm.numeroDocumento.trim(),
      });
      showToast("Inquilino agregado correctamente", "success");
      handleCloseAdd();
      fetchTenants();
    } catch {
      showToast("Error al agregar inquilino. Verifica los datos e intenta nuevamente.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Handlers editar ───────────────────────────────────────────────────────

  const handleOpenEdit = (tenant) => {
    setEditTarget(tenant);
    setEditForm({
      nombres:         tenant.nombres         ?? "",
      apellidos:       tenant.apellidos       ?? "",
      tipoDocumento:   tenant.tipoDocumento   ?? "",
      numeroDocumento: tenant.numeroDocumento ?? "",
    });
    setEditErrors(INITIAL_ERRORS);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "tipoDocumento") {
      setEditForm((prev) => ({ ...prev, tipoDocumento: value, numeroDocumento: "" }));
      setEditErrors((prev) => ({ ...prev, tipoDocumento: "", numeroDocumento: "" }));
      return;
    }
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCloseEdit = () => {
    setEditTarget(null);
    setEditForm(INITIAL_FORM);
    setEditErrors(INITIAL_ERRORS);
  };

  const handleEdit = async () => {
    const { errors: newErrors, valid } = validateForm(editForm);
    setEditErrors(newErrors);
    if (!valid) return;

    try {
      setUpdating(true);
      await updateHomeownerTenant(editTarget.id, {
        nombres:         editForm.nombres.trim(),
        apellidos:       editForm.apellidos.trim(),
        tipoDocumento:   editForm.tipoDocumento,
        numeroDocumento: editForm.numeroDocumento.trim(),
      });
      showToast("Inquilino actualizado correctamente", "success");
      handleCloseEdit();
      fetchTenants();
    } catch {
      showToast("Error al actualizar inquilino. Verifica los datos e intenta nuevamente.", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ── Handler eliminar ──────────────────────────────────────────────────────

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

  // ── Render ────────────────────────────────────────────────────────────────

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
            <TenantCard
              key={t.id}
              tenant={t}
              onEdit={handleOpenEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* ── Modal: Agregar inquilino ── */}
      <Modal open={showAdd} title="Agregar inquilino" onClose={handleCloseAdd}>
        <TenantForm form={addForm} errors={addErrors} onChange={handleAddChange} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "16px" }}>
          <ActionButton variant="ghost" onClick={handleCloseAdd} disabled={saving}>
            Cancelar
          </ActionButton>
          <ActionButton onClick={handleAdd} disabled={saving}>
            {saving ? "Guardando..." : "Guardar inquilino"}
          </ActionButton>
        </div>
      </Modal>

      {/* ── Modal: Editar inquilino ── */}
      <Modal
        open={!!editTarget}
        title={editTarget ? `Editar · ${editTarget.nombres} ${editTarget.apellidos}` : "Editar inquilino"}
        onClose={handleCloseEdit}
      >
        <TenantForm form={editForm} errors={editErrors} onChange={handleEditChange} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "16px" }}>
          <ActionButton variant="ghost" onClick={handleCloseEdit} disabled={updating}>
            Cancelar
          </ActionButton>
          <ActionButton onClick={handleEdit} disabled={updating}>
            {updating ? "Guardando..." : "Guardar cambios"}
          </ActionButton>
        </div>
      </Modal>

      {/* ── Modal: Confirmar eliminación ── */}
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
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}