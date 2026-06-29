// src/components/common/InfoCard.jsx

import { useState } from "react";
import { colors, radius, shadow, transition } from "../../theme/colors";

export default function InfoCard({ title, children, action }) {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: radius.lg,
        padding: "28px",
        boxShadow: shadow.sm,
        border: `1px solid ${colors.border}`,
        animation: "fadeIn 0.4s ease both",
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          {title && (
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: colors.slate }}>
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}