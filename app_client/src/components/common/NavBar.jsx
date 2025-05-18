import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/General.css';

function NavbarComponent({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  return (
    <nav className="navbar navbar-light d-flex justify-content-between align-items-center px-3">
      {isHome ? (
        <img src="/images/logo_sin_fondo.png" alt="Logo" className="logo img-fluid" />
      ) : (
        <Button
          variant="light"
          onClick={toggleSidebar}
          className="navbar-toggler"
          type="button"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>
      )}

      {isHome ? (
        <Button
          variant="link"
          className="btn-link"
          onClick={() => navigate('/login')}
        >
          <i className="bi bi-person-fill me-2"></i> Iniciar Sesión
        </Button>
      ) : (
        <img src="/images/logo_sin_fondo.png" alt="Logo" className="logo img-fluid" />
      )}
    </nav>
  );
}

export default NavbarComponent;
