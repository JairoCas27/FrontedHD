import React from 'react';
import { FiPlus } from 'react-icons/fi';

export default function EncabezadoTabla({ titulo, subtitulo, botonTexto, onBotonClick, action, accentColor = "rgb(52,151,195)" }) {
  return (
    <div className="et-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '2rem',
      width: '100%',
      textAlign: 'left'
    }}>
      <style>{`@media (max-width: 768px) { .et-header { flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; } .et-title { font-size: 1.2rem !important; } }`}</style>
      <div>
        <h1 className="et-title" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          {titulo}
        </h1>
        {subtitulo && (
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            {subtitulo}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}

      {!action && botonTexto && (
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