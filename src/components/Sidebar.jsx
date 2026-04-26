import React from 'react';
import Logo1 from '../images/Logo1.png';
import {
    MdDashboard,
    MdPeople,
    MdBookOnline,
    MdMap,
    MdSettings,
    MdLogout
} from 'react-icons/md';

const Sidebar = ({ activePage, setActivePage }) => {
    // Lista de opciones del menú principal
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: MdDashboard },
        { id: 'residentes', name: 'Residentes', icon: MdPeople },
        { id: 'reservas', name: 'Reservas', icon: MdBookOnline },
        { id: 'mapa', name: 'Mapa de Parking', icon: MdMap },
        { id: 'configuracion', name: 'Configuración', icon: MdSettings },
    ];

    //Modal que maneja el cierre de sesion (backen en un futuro)
    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            alert('Sesión cerrada exitosamente.');
        }
    };

    return (
        <aside className="bg-up-primary text-white" style={{
            width: '280px', minHeight: '100vh', display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Logo */}
            <div className="p-4 border-bottom border-light border-opacity-25">
                <img src={Logo1} alt="Logo UrbanPark" className="w-75" />
            </div>

            {/* Menú de navegación del sidebar*/}
            <nav className="p-3 flex-grow-1">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`w-100 d-flex align-items-center gap-3 px-3 py-2 mb-2 border-0 rounded-3 ${activePage === item.id
                                    ? 'bg-up-secondary text-white'
                                    : 'bg-transparent text-white-50'
                                }`}

                            style={{ transition: 'all 0.3s' }}

                            onMouseEnter={(e) => {
                                if (activePage !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activePage !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                }
                            }}
                        >
                            <Icon size={24} />
                            <span className="fw-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Botón de cerrar sesión */}
            <div className="p-3 border-top border-light border-opacity-25">
                <button
                    onClick={handleLogout}
                    className="w-100 d-flex align-items-center gap-3 px-3 py-2 border-0 rounded-3 
                    bg-transparent text-white-50"
                    style={{ transition: 'all 0.3s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    }}
                >
                    <MdLogout size={24} />
                    <span className="fw-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;