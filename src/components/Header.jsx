import React, { useState } from 'react';
import { MdNotifications, MdAccountCircle, MdMenu } from 'react-icons/md';

/**
 * Header del panel administrativo
 * Muestra información del usuario y notificaciones
 */
const Header = () => {
    // Estado para controlar el menú desplegable de usuario
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Datos del usuario (simulados - luego vendrán del backend)
    const user = {
        name: 'Pepe Lucho',
        email: 'admin@urbanpark.com',
        avatar: null,
        role: 'Admin'
    };

    /**
     * Maneja el cierre de sesión
     * Por ahora solo muestra alerta, pero está preparado para:
     * 1. Limpiar tokens de autenticación (localStorage/sessionStorage)
     * 2. Redirigir al login
     * 3. Limpiar el estado global de autenticación
     */
    const handleLogout = () => {
        // LO que se hara en un futuro: Implementar cuando haya backend
        // 1. Llamar a API de logout
        // 2. Eliminar token de localStorage
        // 3. Redirigir a página de login

        // Alerta de confirmación
        if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            alert('Sesión cerrada correctamente.');
            // window.location.href = '/login';  // Descomentar cuando exista página de login
        }
    };

    //Maneja las notificaciones (preparado para futuro)
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
                    <div className="dropdown">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="btn btn-link text-up-primary p-0 border-0 
                            d-flex align-items-center gap-2"
                            style={{ textDecoration: 'none' }}
                        >

                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="rounded-circle"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                            ) : (
                                <MdAccountCircle size={32} />
                            )}
                            <div className="text-start d-none d-md-block">
                                <small className="d-block fw-bold text-dark">{user.name}</small>
                                <small className="text-muted" style={{ fontSize: '11px' }}>
                                    {user.role}</small>
                            </div>
                        </button>

                        {/* Menú desplegable */}
                        {showUserMenu && (
                            <div className="dropdown-menu show position-absolute end-0 mt-2" style={{ minWidth: '200px' }}>
                                <div className="dropdown-item-text">
                                    <small className="text-muted d-block">Conectado como</small>
                                    <strong>{user.email}</strong>
                                </div>

                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" onClick={() => alert('Perfil - Próximamente')}>
                                    <MdAccountCircle className="me-2" size={18} />
                                    Mi Perfil
                                </button>
                                <button className="dropdown-item" onClick={() => alert('Configuración - Próximamente')}>
                                    <MdNotifications className="me-2" size={18} />
                                    Preferencias
                                </button>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                    <MdMenu className="me-2" size={18} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header >
    );
};

export default Header;
