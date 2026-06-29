import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

export default function AppLayout({ Sidebar, allowedRole }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <PrivateRoute allowedRole={allowedRole}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div style={{ flexGrow: 1, marginLeft: isOpen ? '240px' : '72px', transition: 'margin-left 0.35s ease', padding: '2rem' }}>
          <Outlet />
        </div>
      </div>
    </PrivateRoute>
  );
}