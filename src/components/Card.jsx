import React from 'react';

/**
 * Componente de tarjeta para mostrar resumen y estadísticas
 * 
 */

const Card = ({ title, value, color }) => {
    const bgColors = {
        primary: 'bg-up-primary',
        secondary: 'bg-up-secondary',
        accent: 'bg-up-accent',
        light: 'bg-up-surface-variant',
    };

    // Componente que renderiza una tarjeta con un título, valor principal  y un recuadro decorativo
    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 hover-lift">
            <div className="d-flex justify-content-between align-items-start">

                {/* Sección izquierda: título y valor */}
                <div>
                    <p className="text-up-primary-light small fw-medium mb-1">{title}</p>
                    <h2 className="display-6 fw-bold text-up-primary mb-0">{value}</h2>
                </div>

                {/* Sección derecha: caja de color */}
                <div className={`${bgColors[color]} rounded-3 d-flex 
                align-items-center justify-content-center`}
                style={{ width: '55px', height: '55px' }}>
            </div>
        </div>
        </div >
    );
};

export default Card;