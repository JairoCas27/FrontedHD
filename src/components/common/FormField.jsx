// src/components/common/FormField.jsx

import { colors, radius } from "../../theme/colors";

export default function FormField({ label, name, value, onChange, type = "text", placeholder, required, options }) {
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: radius.sm,
    border: `1px solid ${colors.border}`,
    fontSize: "14px",
    color: colors.slate,
    background: colors.white,
    fontFamily: "system-ui, sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 500, color: colors.slate }}>
        {label} {required && <span style={{ color: colors.red }}>*</span>}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={inputStyle}
        >
          <option value="">Seleccionar...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = colors.orange)}
          onBlur={(e) => (e.target.style.borderColor = colors.border)}
        />
      )}
    </div>
  );
}