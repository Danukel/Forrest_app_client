// src/components/TemaCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TemaCard({ tema }) {
  const navigate = useNavigate();

  return (
    <Card
      className="p-3 shadow-sm h-100"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/foro/tema/${tema._id}`)}
    >
      <Card.Body>
        <Card.Title>{tema.title}</Card.Title>
        <Card.Text>{tema.content}</Card.Text>
        <small className="text-muted">
          Publicado por: {tema.userId?.username || 'Usuario desconocido'}<br />
          Respuestas: {tema.replies?.length || 0}
        </small>
      </Card.Body>
    </Card>
  );
}

export default TemaCard;