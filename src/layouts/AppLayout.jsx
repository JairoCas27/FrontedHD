import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import { FiMenu } from 'react-icons/fi';

export default function AppLayout({ Sidebar, allowedRole }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [location, isMobile]);

  return (
    <PrivateRoute allowedRole={allowedRole}>
      <div className="al-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        {isMobile && isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 998,
            }}
          />
        )}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="al-content" style={{
          flexGrow: 1,
          marginLeft: isMobile ? '0' : (isOpen ? '240px' : '72px'),
          transition: 'margin-left 0.35s ease',
          padding: isMobile ? '4.5rem 1rem 1rem' : '2rem',
          minWidth: 0,
          overflowX: 'hidden',
        }}>
          <Outlet />
        </div>
      </div>
    </PrivateRoute>
  );
}
