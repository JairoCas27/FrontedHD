import React from 'react';
import { FiPlus } from 'react-icons/fi';

export default function EncabezadoTabla({ titulo, subtitulo, botonTexto, onBotonClick, accentColor = "rgb(52,151,195)" }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '2rem',
      width: '100%',
      textAlign: 'left'
    }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          {titulo}
        </h1>
        {subtitulo && (
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            {subtitulo}
          </p>
        )}
      </div>

      {botonTexto && (
        <button 
          onClick={onBotonClick}
          style={{
            backgroundColor: accentColor,
            color: '#ffffff',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(52, 151, 195, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          <FiPlus size={16} />
          {botonTexto}
        </button>
      )}
    </div>
  );
}