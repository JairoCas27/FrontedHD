// src/components/common/EmptyState.jsx

import { colors, radius } from "../../theme/colors";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        gap: "12px",
        textAlign: "center",
      }}
    >
      {Icon && (
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: radius.md,
            background: colors.orangeLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <Icon size={24} color={colors.orange} />
        </div>
      )}
      <p style={{ margin: 0, fontWeight: 600, color: colors.slate, fontSize: "15px" }}>
        {title}
      </p>
      {description && (
        <p style={{ margin: 0, color: colors.slateLight, fontSize: "13px", maxWidth: "280px" }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "8px" }}>{action}</div>}
    </div>
  );
}