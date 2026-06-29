// src/components/common/ConfirmModal.jsx

import { AlertTriangle } from "lucide-react";
import { colors, radius, shadow } from "../../theme/colors";
import ActionButton from "./ActionButton";

export default function ConfirmModal({ open, title, description, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.15s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white,
          borderRadius: radius.lg,
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: shadow.hover,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          animation: "slideUp 0.2s ease both",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: radius.md,
            background: colors.redLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={22} color={colors.red} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: colors.slate }}>
            {title}
          </h3>
          {description && (
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: colors.slateLight }}>
              {description}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <ActionButton variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </ActionButton>
          <ActionButton variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </ActionButton>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}