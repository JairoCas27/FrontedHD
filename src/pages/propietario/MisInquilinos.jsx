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

// ─── Constantes ─────────────────────────────────────────────────────────────

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

const INITIAL_ERRORS = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "",
  numeroDocumento: "",
};

const DOC_OPTIONS = [
  { value: "DNI",       label: "DNI"                  },
  { value: "CE",        label: "Carné de Extranjería"  },
  { value: "PASAPORTE", label: "Pasaporte"              },
  { value: "RUC",       label: "RUC"                   },
];

// ─── Reglas de validación por tipo de documento ──────────────────────────────

const DOC_RULES = {
  DNI:       { pattern: /^\d{8}$/,           hint: "8 dígitos numéricos"         },
  CE:        { pattern: /^[A-Za-z0-9]{9}$/,  hint: "9 caracteres alfanuméricos"  },
  PASAPORTE: { pattern: /^[A-Za-z0-9]{6,12}$/,hint: "6 a 12 caracteres alfanuméricos" },
  RUC:       { pattern: /^\d{11}$/,           hint: "11 dígitos numéricos"        },
};

const NOMBRE_PATTERN = /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]{2,}$/;

// ─── Función de validación completa del formulario ───────────────────────────

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

// ─── Sub-componente: hint dinámico según tipo de documento ───────────────────

function DocHint({ tipoDocumento }) {
  if (!tipoDocumento || !DOC_RULES[tipoDocumento]) return null;
  return (
    <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.slateLight }}>
      {DOC_RULES[tipoDocumento].hint}
    </p>
  );
}

// ─── Sub-componente: mensaje de error de campo ───────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.red }}>
      {message}
    </p>
  );
}

// ─── Sub-componente: TenantCard ──────────────────────────────────────────────

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

// ─── Vista principal ─────────────────────────────────────────────────────────

export default function MisInquilinos() {
  const [tenants,      setTenants]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showAdd,      setShowAdd]      = useState(false);
  const [form,         setForm]         = useState(INITIAL_FORM);
  const [errors,       setErrors]       = useState(INITIAL_ERRORS);
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const { toast, showToast, clearToast } = useToast();

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchTenants = () => {
    setLoading(true);
    getHomeownerTenants()
      .then((data) => setTenants(Array.isArray(data) ? data : []))
      .catch(() => showToast("Error al cargar inquilinos", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTenants(); }, []);

  // ── Handlers del formulario ──────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Al cambiar tipo de documento, limpiar el número para evitar
    // que quede un valor inválido para el nuevo tipo seleccionado
    if (name === "tipoDocumento") {
      setForm((prev) => ({ ...prev, tipoDocumento: value, numeroDocumento: "" }));
      setErrors((prev) => ({ ...prev, tipoDocumento: "", numeroDocumento: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo en cuanto el usuario empieza a corregir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCloseModal = () => {
    setShowAdd(false);
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
  };

  const handleAdd = async () => {
    const { errors: newErrors, valid } = validateForm(form);
    setErrors(newErrors);
    if (!valid) return;

    try {
      setSaving(true);
      await createHomeownerTenant({
        nombres:         form.nombres.trim(),
        apellidos:       form.apellidos.trim(),
        tipoDocumento:   form.tipoDocumento,
        numeroDocumento: form.numeroDocumento.trim(),
      });
      showToast("Inquilino agregado correctamente", "success");
      handleCloseModal();
      fetchTenants();
    } catch {
      showToast("Error al agregar inquilino. Verifica los datos e intenta nuevamente.", "error");
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

  // ── Render ───────────────────────────────────────────────────────────────

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

      {/* ── Modal: Agregar inquilino ── */}
      <Modal open={showAdd} title="Agregar inquilino" onClose={handleCloseModal}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Nombres */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <FormField
                label="Nombres"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
              <FieldError message={errors.apellidos} />
            </div>
          </div>

          {/* Tipo de documento */}
          <div>
            <FormField
              label="Tipo de documento"
              name="tipoDocumento"
              value={form.tipoDocumento}
              onChange={handleChange}
              options={DOC_OPTIONS}
              required
            />
            <FieldError message={errors.tipoDocumento} />
          </div>

          {/* Número de documento */}
          <div>
            <FormField
              label="Número de documento"
              name="numeroDocumento"
              value={form.numeroDocumento}
              onChange={handleChange}
              placeholder={
                form.tipoDocumento === "DNI"       ? "Ej: 71234567"   :
                form.tipoDocumento === "CE"        ? "Ej: A12345678"  :
                form.tipoDocumento === "PASAPORTE" ? "Ej: AB123456"   :
                form.tipoDocumento === "RUC"       ? "Ej: 20123456789":
                "Número de documento"
              }
              required
            />
            <DocHint tipoDocumento={form.tipoDocumento} />
            <FieldError message={errors.numeroDocumento} />
          </div>

          {/* Acciones */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px" }}>
            <ActionButton variant="ghost" onClick={handleCloseModal} disabled={saving}>
              Cancelar
            </ActionButton>
            <ActionButton onClick={handleAdd} disabled={saving}>
              {saving ? "Guardando..." : "Guardar inquilino"}
            </ActionButton>
          </div>

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