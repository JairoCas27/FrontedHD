// src/pages/propietario/PerfilPropietario.jsx

import { useEffect, useState } from "react";
import { User, Save } from "lucide-react";
import { getProfile, updateProfile } from "../../services/api";
import { colors, radius, shadow } from "../../theme/colors";
import SectionHeader from "../../components/common/SectionHeader";
import InfoCard from "../../components/common/InfoCard";
import ActionButton from "../../components/common/ActionButton";
import FormField from "../../components/common/FormField";
import Loading from "../../components/common/Loading";
import { Toast, useToast } from "../../components/common/Toast";

const PAGE = {
  padding: "32px",
  maxWidth: "680px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

export default function PerfilPropietario() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    getProfile()
      .then((data) => setForm(data ?? {}))
      .catch(() => showToast("Error al cargar perfil", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const required = ["nombres", "apellidos", "email"];
    for (const key of required) {
      if (!form[key]?.trim()) {
        showToast(`El campo "${key}" es requerido`, "error");
        return;
      }
    }
    try {
      setSaving(true);
      await updateProfile(form);
      showToast("Perfil actualizado correctamente", "success");
    } catch {
      showToast("Error al actualizar perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  const initials = form.nombres && form.apellidos
    ? `${form.nombres[0]}${form.apellidos[0]}`.toUpperCase()
    : "?";

  return (
    <div style={PAGE}>
      <SectionHeader title="Mi Perfil" subtitle="Administra tu información personal" />

      {loading ? (
        <Loading />
      ) : (
        <InfoCard>
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
                {form.nombres} {form.apellidos}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.slateLight }}>
                {form.email}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <FormField
                label="Nombres"
                name="nombres"
                value={form.nombres ?? ""}
                onChange={handleChange}
                placeholder="Juan"
                required
              />
              <FormField
                label="Apellidos"
                name="apellidos"
                value={form.apellidos ?? ""}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>

            <FormField
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email ?? ""}
              onChange={handleChange}
              placeholder="juan@email.com"
              required
            />

            {form.telefono !== undefined && (
              <FormField
                label="Teléfono"
                name="telefono"
                value={form.telefono ?? ""}
                onChange={handleChange}
                placeholder="+51 999 000 000"
              />
            )}

            {form.tipoDocumento !== undefined && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <FormField
                  label="Tipo de documento"
                  name="tipoDocumento"
                  value={form.tipoDocumento ?? ""}
                  onChange={handleChange}
                  placeholder="DNI"
                />
                <FormField
                  label="Número de documento"
                  name="numeroDocumento"
                  value={form.numeroDocumento ?? ""}
                  onChange={handleChange}
                  placeholder="71234567"
                />
              </div>
            )}

            <div
              style={{
                height: "1px",
                background: colors.border,
                margin: "8px 0",
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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