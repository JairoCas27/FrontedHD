import React from 'react';
import Logo1 from '../images/Logo1.png';

const Sidebar = () => {
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'residentes', name: 'Residentes' },
        { id: 'reservas', name: 'Reservas' },
        { id: 'mapa', name: 'Mapa de Parking' },
        { id: 'configuracion', name: 'Configuración' },
    ];

    return (
        <aside className="bg-up-primary text-white" style={{ width: '280px', minHeight: '100vh' }}>
            {/* Logo */}
            <div className="p-4 border-bottom border-light border-opacity-25">
                <img src={Logo1} alt="Logo UrbanPark" className="w-75" />
            </div>

            {/* Menú */}
            <nav className="p-3">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className="w-100 text-start px-3 py-2 mb-2 border-0 rounded-3 bg-transparent text-white-50"
                        style={{ transition: 'all 0.3s' }}
                    >
                        <span className="fw-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;