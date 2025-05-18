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
      <NavLink to="/adminhome" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
        <i className="bi bi-house-door me-2"></i> Home
      </NavLink>
      <NavLink to="/adminstats" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
        <i className="bi bi-gear me-2"></i> Estadisticas Web
      </NavLink>
      <NavLink to="/adminforo" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
        <i className="bi bi-chat-dots me-2"></i> Administrar Foro
      </NavLink>
      <NavLink to="/adminopiniones" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
        <i className="bi bi-pencil-square me-2"></i> Gestionar Opiniones
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
