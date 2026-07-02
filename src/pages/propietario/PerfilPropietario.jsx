// src/pages/propietario/PerfilPropietario.jsx

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getProfile, updateProfile } from "../../services/api";
import { colors, radius } from "../../theme/colors";
import SectionHeader from "../../components/common/SectionHeader";
import InfoCard from "../../components/common/InfoCard";
import ActionButton from "../../components/common/ActionButton";
import FormField from "../../components/common/FormField";
import Loading from "../../components/common/Loading";
import { Toast, useToast } from "../../components/common/Toast";

// ─── Constantes ──────────────────────────────────────────────────────────────

const PAGE = {
  padding: "32px",
  maxWidth: "680px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const INITIAL_ERRORS = {
  nombres: "",
  apellidos: "",
  telefono: "",
};

const NOMBRE_PATTERN   = /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]{2,}$/;
const NOMBRE_MAX_LENGTH = 50;

const TELEFONO_PATTERN     = /^\+?[\d\s\-]{7,15}$/;
const TELEFONO_MIN_DIGITOS = 7;
const TELEFONO_MAX_DIGITOS = 15;

// ─── Validación ──────────────────────────────────────────────────────────────

function validateForm({ nombres, apellidos, telefono }) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  const nombresTrim = nombres?.trim() ?? "";
  if (!nombresTrim) {
    errors.nombres = "Este campo es obligatorio.";
    valid = false;
  } else if (nombresTrim.length > NOMBRE_MAX_LENGTH) {
    errors.nombres = `Máximo ${NOMBRE_MAX_LENGTH} caracteres.`;
    valid = false;
  } else if (!NOMBRE_PATTERN.test(nombresTrim)) {
    errors.nombres = "Solo letras, mínimo 2 caracteres.";
    valid = false;
  }

  const apellidosTrim = apellidos?.trim() ?? "";
  if (!apellidosTrim) {
    errors.apellidos = "Este campo es obligatorio.";
    valid = false;
  } else if (apellidosTrim.length > NOMBRE_MAX_LENGTH) {
    errors.apellidos = `Máximo ${NOMBRE_MAX_LENGTH} caracteres.`;
    valid = false;
  } else if (!NOMBRE_PATTERN.test(apellidosTrim)) {
    errors.apellidos = "Solo letras, mínimo 2 caracteres.";
    valid = false;
  }

  const telefonoTrim = telefono?.trim() ?? "";
  if (telefonoTrim) {
    const soloDigitos = telefonoTrim.replace(/\D/g, "");
    if (!TELEFONO_PATTERN.test(telefonoTrim)) {
      errors.telefono = "Formato inválido. Ej: +51999000000";
      valid = false;
    } else if (soloDigitos.length < TELEFONO_MIN_DIGITOS || soloDigitos.length > TELEFONO_MAX_DIGITOS) {
      errors.telefono = `Debe tener entre ${TELEFONO_MIN_DIGITOS} y ${TELEFONO_MAX_DIGITOS} dígitos.`;
      valid = false;
    }
  }

  return { errors, valid };
}

// ─── Sub-componente: error de campo ──────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p style={{ margin: "4px 0 0", fontSize: "12px", color: colors.red }}>
      {message}
    </p>
  );
}

// ─── Sub-componente: fila de dato de solo lectura ─────────────────────────────

function ReadOnlyRow({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <span style={{ fontSize: "13px", color: colors.slateLight }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: 500, color: colors.slate }}>{value}</span>
    </div>
  );
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function PerfilPropietario() {
  // Datos completos que devuelve el GET (solo lectura)
  const [perfil,  setPerfil]  = useState(null);

  // Solo los 3 campos que acepta el PUT
  const [form,    setForm]    = useState({ nombres: "", apellidos: "", telefono: "" });
  const [errors,  setErrors]  = useState(INITIAL_ERRORS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const { toast, showToast, clearToast } = useToast();

  // ── Fetch inicial ────────────────────────────────────────────────────────

  useEffect(() => {
    getProfile()
      .then((data) => {
        setPerfil(data);
        // Pre-cargar solo los campos editables
        setForm({
          nombres:   data.nombres   ?? "",
          apellidos: data.apellidos ?? "",
          telefono:  data.telefono  ?? "",
        });
      })
      .catch(() => showToast("Error al cargar perfil", "error"))
      .finally(() => setLoading(false));
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    const { errors: newErrors, valid } = validateForm(form);
    setErrors(newErrors);
    if (!valid) return;

    try {
      setSaving(true);
      // Enviar únicamente los campos que el PUT acepta
      await updateProfile({
        nombres:   form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono:  form.telefono.trim(),
      });
      showToast("Perfil actualizado correctamente", "success");
      // Actualizar el perfil local con los nuevos valores
      setPerfil((prev) => ({ ...prev, ...form }));
    } catch {
      showToast("Error al actualizar perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Derivados ─────────────────────────────────────────────────────────────

  const initials = perfil?.nombres && perfil?.apellidos
    ? `${perfil.nombres[0]}${perfil.apellidos[0]}`.toUpperCase()
    : "?";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={PAGE}>
      <SectionHeader title="Mi Perfil" subtitle="Administra tu información personal" />

      {loading ? (
        <Loading />
      ) : (
        <InfoCard>

          {/* Avatar + nombre actual */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: colors.orangeLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "22px",
                color: colors.orange,
                flexShrink: 0,
                border: `2px solid ${colors.orangeBorder}`,
              }}
            >
              {initials}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: colors.slate }}>
                {perfil?.nombres} {perfil?.apellidos}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
                {perfil?.correo}
              </p>
            </div>
          </div>

          {/* Datos de solo lectura */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 600, color: colors.slateLighter, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Información de cuenta
            </p>
            <ReadOnlyRow label="Correo"    value={perfil?.correo} />
            <ReadOnlyRow label="Rol"       value={perfil?.rol} />
            <ReadOnlyRow label="Miembro desde" value={perfil?.fechaCreacion
              ? new Date(perfil.fechaCreacion).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
              : null}
            />
          </div>

          {/* Separador */}
          <div style={{ height: "1px", background: colors.border, margin: "4px 0 20px" }} />

          {/* Campos editables */}
          <p style={{ margin: "0 0 16px", fontSize: "12px", fontWeight: 600, color: colors.slateLighter, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Editar información
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

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

            <div>
              <FormField
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+51999000000"
              />
              <FieldError message={errors.telefono} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
              <ActionButton icon={Save} onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </ActionButton>
            </div>

          </div>
        </InfoCard>
      )}

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}