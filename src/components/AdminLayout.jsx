import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    const [activePage, setActivePage] = React.useState('dashboard');

    return (
        <div className="d-flex">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-grow-1" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
                <div className="p-4">
                    <h1>Panel de Administración</h1>
                    <p>Contenido principal</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;