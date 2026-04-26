import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../pages/Dashboard';
import Residentes from '../pages/Residentes';
import Reservas from '../pages/Reservas';
import MapaParking from '../pages/MapaParking';
import Configuracion from '../pages/Configuracion';

/**
 * Layout principal del PA
 * Maneja la navegación entre páginas y renderiza el componente correspondiente
 * 
 */

const AdminLayout = () => {
    // Estado que guarda qué página está activa actualmente
    const [activePage, setActivePage] = React.useState('dashboard');

    //Renderiza el componente según la página activas
    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard />;
            case 'residentes':
                return <Residentes />;
            case 'reservas':
                return <Reservas />;
            case 'mapa':
                return <MapaParking />;
            case 'configuracion':
                return <Configuracion />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="d-flex">

            {/*sidebar con navegación*/}
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <div className="flex-grow-1" style={{ minHeight: '100vh'}}>
                {/* Esto hace que el header sea siempre visible */}
                <Header />
                <main className="bg-up-surface-variant" style={{ minHeight: 'calc(100vh - 70px)' }}>
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;