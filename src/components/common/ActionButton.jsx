// src/components/common/ActionButton.jsx

import { useState } from "react";
import { colors, radius, transition } from "../../theme/colors";

export default function ActionButton({
  onClick,
  children,
  variant = "primary",
  icon: Icon,
  disabled = false,
  size = "md",
}) {
  const [hovered, setHovered] = useState(false);

  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "system-ui, sans-serif",
    fontWeight: 500,
    transition,
    opacity: disabled ? 0.5 : 1,
    borderRadius: radius.sm,
  };

  const sizes = {
    sm: { padding: "6px 14px", fontSize: "13px" },
    md: { padding: "10px 20px", fontSize: "14px" },
    lg: { padding: "13px 28px", fontSize: "15px" },
  };

  const variants = {
    primary: {
      background: hovered ? colors.orangeDark : colors.orange,
      color: colors.white,
      boxShadow: hovered ? `0 4px 12px ${colors.orange}40` : "none",
    },
    secondary: {
      background: hovered ? colors.orangeLight : colors.white,
      color: colors.orange,
      border: `1px solid ${colors.orangeBorder}`,
    },
    danger: {
      background: hovered ? "#dc2626" : colors.red,
      color: colors.white,
      boxShadow: hovered ? `0 4px 12px ${colors.red}40` : "none",
    },
    ghost: {
      background: hovered ? colors.background : "transparent",
      color: colors.slateLight,
    },
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], transform: hovered && !disabled ? "translateY(-1px)" : "none" }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}