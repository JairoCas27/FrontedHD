// src/components/common/Loading.jsx

import { colors } from "../../theme/colors";

export default function Loading({ text = "Cargando..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: `3px solid ${colors.orangeBorder}`,
          borderTopColor: colors.orange,
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ color: colors.slateLight, fontSize: "14px" }}>{text}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}