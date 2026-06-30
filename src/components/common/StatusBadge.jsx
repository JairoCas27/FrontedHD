// src/components/common/StatusBadge.jsx

import { colors, radius } from "../../theme/colors";

const presets = {
  INGRESO: { bg: colors.greenLight, color: colors.green, label: "Ingreso" },
  SALIDA: { bg: colors.redLight, color: colors.red, label: "Salida" },
  PRESTAMO: { bg: colors.blueLight, color: colors.blue, label: "Préstamo" },
  DEVOLUCION: { bg: colors.orangeLight, color: colors.orange, label: "Devolución" },
  default: { bg: colors.background, color: colors.slateLight, label: "" },
};

export default function StatusBadge({ status }) {
  const preset = presets[status] ?? { ...presets.default, label: status };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: radius.xl,
        fontSize: "12px",
        fontWeight: 600,
        background: preset.bg,
        color: preset.color,
        whiteSpace: "nowrap",
      }}
    >
      {preset.label}
    </span>
  );
}