import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import NavbarComponent from './common/NavBar';
import Footer from './common/Footer';
import { useNavigate } from 'react-router-dom';

function PrivateLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-grow-1 d-flex flex-column">
        <NavbarComponent toggleSidebar={toggleSidebar} />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default PrivateLayout;
