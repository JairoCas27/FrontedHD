// src/components/common/StatCard.jsx

import { useState } from "react";
import { colors, radius, shadow, transition } from "../../theme/colors";

export default function StatCard({ icon: Icon, label, value, accent = colors.orange, bg = colors.orangeLight }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.white,
        borderRadius: radius.lg,
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: hovered ? shadow.hover : shadow.sm,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition,
        cursor: "default",
        border: `1px solid ${colors.border}`,
        animation: "fadeIn 0.4s ease both",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: radius.sm,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color={accent} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: colors.slate, lineHeight: 1 }}>
          {value ?? "—"}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: colors.slateLight }}>
          {label}
        </p>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}