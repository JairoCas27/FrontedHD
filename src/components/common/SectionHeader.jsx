// src/components/common/SectionHeader.jsx

import { colors } from "../../theme/colors";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "28px",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: colors.slate }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: colors.slateLight }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}