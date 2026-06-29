export const validateLoginForm = ({ correo, password }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
    if (!correo.trim() && !password.trim()) return { valid: false, message: "Por favor completa todos los campos", field: "both" }
    if (!correo.trim()) return { valid: false, message: "El correo es obligatorio", field: "correo" }
    if (!emailRegex.test(correo.trim())) return { valid: false, message: "El correo no tiene un formato válido", field: "correo" }
    if (!password.trim()) return { valid: false, message: "La contraseña es obligatoria", field: "password" }
  
    return { valid: true, message: null, field: null }
  } 