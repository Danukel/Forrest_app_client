import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/RutaCard.css';

function RutaCardHome({ ruta, tipo = 'normal', onEliminar }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Usar '_id' en lugar de 'id' si ese es el campo correcto
    navigate(`/detallesrutasin/${ruta._id}`);  // Cambié 'ruta.id' por 'ruta._id'
  };

  return (
    <div className="ruta-card" onClick={handleClick}>
      <img src="/images/cola_caballo.jpg" className="ruta-imagen" />
      <div className="ruta-overlay">
        <div>
          <h6 className="mb-0 fw-bold">{ruta.name}</h6>
          <small>{ruta.localizacion}</small>
          {tipo === 'historial' && <div className="fecha-texto mt-1">{ruta.fecha}</div>}
        </div>
        {tipo === 'misrutas' && (
          <Button
            variant="success"
            size="sm"
            className="rounded-pill eliminar-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(ruta._id);  // Cambié 'ruta.id' por 'ruta._id'
            }}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}

export default RutaCardHome;
