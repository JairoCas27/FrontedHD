import React from 'react';
import { MdNotifications, MdAccountCircle } from 'react-icons/md';

/**
 * Header del panel administrativo
 * Muestra información del usuario y notificaciones
 */
const Header = () => {
     // Datos del usuario (simulados - luego vendrán del backend)
    const user = {
        name: 'Pepe Lucho',
        email: 'admin@urbanpark.com',
        avatar: null,
        role: 'Admin'
    };

    /**
     * Maneja las notificaciones (preparado para futuro)
     */
    const handleNotifications = () => {
        alert('Próximamente: Notificaciones');
    };

    return (
        <header className="bg-up-secondary shadow-sm border-bottom" style={{ height: '70px' }}>
            <div className="d-flex justify-content-between align-items-center h-100 px-4">
                {/* Título */}
                <div className="d-flex align-items-center gap-3">
                    <h2 className="h5 fw-bold text-up-primary mb-0">
                        Panel de Administración
                    </h2>
                </div>

                {/* Iconos y perfil de usuario */}
                <div className="d-flex align-items-center gap-4">
                    {/* Botón de notificaciones */}
                    <button
                        onClick={handleNotifications}
                        className="btn btn-link text-up-primary position-relative p-0 border-0"
                        style={{ textDecoration: 'none' }}
                    >
                        <MdNotifications size={24} />
                        <span className="position-absolute top-0 start-100 
                        translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                            3
                        </span>
                    </button>

                    {/* Información de usuario*/}
                    <div className="d-flex align-items-center gap-2">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                        ) : (
                            <MdAccountCircle size={32} />
                        )}
                        <div className="text-start d-none d-md-block">
                            <small className="d-block fw-bold text-dark">{user.name}</small>
                            <small className="text-muted" style={{ fontSize: '11px' }}>{user.role}</small>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
