import { colors, transition } from "../../theme/colors";

export default function ToggleSwitch({ checked, onChange, label, disabled }) {
  return (
    <div
      onClick={!disabled ? () => onChange(!checked) : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "48px",
          height: "26px",
          backgroundColor: checked ? "#c3fac4" : "#f09393",
          borderRadius: "13px",
          transition,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "24px" : "2px",
            width: "22px",
            height: "22px",
            backgroundColor: colors.white,
            borderRadius: "50%",
            transition: "left 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      {label !== undefined ? (
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.slate }}>
          {label ?? (checked ? "Activo" : "Inactivo")}
        </span>
      ) : (
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: colors.slate }}>
          {checked ? "Activo" : "Inactivo"}
        </span>
      )}
    </div>
  );
}
