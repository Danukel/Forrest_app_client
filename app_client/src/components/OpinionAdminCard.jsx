import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

function OpinionCard({ 
  id,
  content, 
  date, 
  route, 
  author, 
  stars, 
  onValidar, 
  onEliminar,
  validado 
}) {
  const numStars = Number(stars); // asegura que stars sea un número

  console.log(`Opinión ID ${id}: ${numStars} estrellas`);

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flex: 1 }}>
            <Card.Text className="fw-bold mb-3">{content}</Card.Text>

            <div className="mb-2">
              <small className="text-muted d-block">
                <strong>Fecha:</strong> {date}
              </small>
              <small className="text-muted d-block">
                <strong>Ruta:</strong> {route}
              </small>
              <small className="text-muted d-block">
                <strong>Publicado por:</strong> {author}
              </small>
            </div>

            {!validado ? (
              <div className="mt-2">
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={() => onValidar(id)}
                  className="me-2"
                >
                  Validar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => onEliminar(id)}
                >
                  Eliminar
                </Button>
              </div>
            ) : (
              <p className="text-success mt-2">✔ Validado</p>
            )}
          </div>

          {/* Estrellas de valoración */}
          <div className="d-flex align-items-center ms-3">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                color={i < numStars ? '#f5c518' : '#ccc'} 
                size={22}
                className="ms-1"
              />
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default OpinionCard;
