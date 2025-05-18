import React from 'react';
import '../styles/RutaInfoCard.css';
import { useNavigate } from 'react-router-dom';

function RutaInfoCard({ ruta, expandida, onExpandir }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detallesruta/${ruta.id}`);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation(); // Evita que se dispare el click del card
    onExpandir();
  };

  return (
    <div
      className="ruta-info-card d-flex justify-content-between align-items-center mb-4 p-3 rounded bg-light"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div>
        <h5 className="fw-semibold">{ruta.nombre}</h5>
        <p className={`mb-1 descripcion ${expandida ? 'expandida' : ''}`}>
          {expandida ? ruta.descripcion : `${ruta.descripcion.slice(0, 100)}...`}
        </p>
        <small>Distancia: {ruta.distancia}</small><br />
        <small>Dificultad: {ruta.dificultad}</small><br />
        <button className="btn btn-link p-0" onClick={handleExpandClick}>
          {expandida ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
      </div>
      <div className="fs-3">
        {ruta.iconoTiempo && (
          <img 
            src={`https:${ruta.iconoTiempo}`} 
            alt="Icono clima" 
            className="icono-clima"
          />
        )}
      </div>
    </div>
  );
}

export default RutaInfoCard;
