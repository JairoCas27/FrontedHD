// src/components/common/Toast.jsx
// Uso: import { useToast } from "./Toast"
// const { toast, showToast } = useToast();
// <Toast toast={toast} />
// showToast("Mensaje", "success" | "error" | "info")

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { colors, radius, shadow } from "../../theme/colors";

const ICONS = {
  success: <CheckCircle size={16} color={colors.green} />,
  error: <XCircle size={16} color={colors.red} />,
  info: <Info size={16} color={colors.blue} />,
};

const BG = {
  success: colors.greenLight,
  error: colors.redLight,
  info: colors.blueLight,
};

const TEXT_COLOR = {
  success: colors.green,
  error: colors.red,
  info: colors.blue,
};

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  return { toast, showToast, clearToast: () => setToast(null) };
}

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 2000,
        background: colors.white,
        borderRadius: radius.md,
        boxShadow: shadow.hover,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: "260px",
        maxWidth: "380px",
        border: `1px solid ${colors.border}`,
        animation: "slideInRight 0.25s ease both",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: BG[toast.type],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {ICONS[toast.type]}
      </div>
      <span style={{ fontSize: "14px", color: colors.slate, flex: 1 }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: colors.slateLighter,
          padding: "2px",
          display: "flex",
        }}
      >
        <X size={14} />
      </button>
      <style>{`@keyframes slideInRight { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}