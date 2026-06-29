import React from 'react';

export default function BadgeEstado({ estado }) {
  const llave = estado ? estado.trim().toLowerCase() : '';

  let config = {
    bg: 'rgba(100, 116, 139, 0.1)',
    color: '#64748b'
  };

  // Mapeo de colores SaaS premium
  if (['disponible', 'activo', 'ingreso', 'entrada'].includes(llave)) {
    config = { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }; // Verde
  } else if (['ocupado', 'inactivo', 'salida'].includes(llave)) {
    config = { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };   // Rojo
  } else if (['mantención', 'mantenimiento', 'pendiente'].includes(llave)) {
    config = { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };  // Amarillo/Ámbar
  }

  return (
    <span style={{
      backgroundColor: config.bg,
      color: config.color,
      padding: '0.3rem 0.65rem',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '700',
      display: 'inline-block',
      textTransform: 'capitalize'
    }}>
      {estado}
    </span>
  );
}