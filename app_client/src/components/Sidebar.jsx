import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const sidebarRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(
        'http://localhost:3001/logout',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error al hacer logout en el servidor:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h4 className="sidebar-title">Forrest</h4>
      <nav className="nav flex-column mt-4">
        <NavLink to="/userhome" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <i className="bi bi-house-door me-2"></i> Home
        </NavLink>
        <NavLink to="/misrutas" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <i className="bi bi-heart me-2"></i> Mis Rutas
        </NavLink>
        <NavLink to="/explorar" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <i className="bi bi-map me-2"></i> Explorar Rutas
        </NavLink>
        <NavLink to="/estadisticas" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <i className="bi bi-bar-chart me-2"></i> Estadísticos
        </NavLink>
        <NavLink to="/foro" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <i className="bi bi-chat-dots me-2"></i> Foro
        </NavLink>
        <NavLink to="/historial" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
          <i className="bi bi-clock-history me-2"></i> Historial
        </NavLink>
        <hr />
        <button className="btn btn-success logout-button w-100 mt-2" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
