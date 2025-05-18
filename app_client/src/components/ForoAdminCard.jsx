import React from 'react';
import { Card, Button } from 'react-bootstrap';

function ForoAdminCard({ id, titulo, contenido, autor, respuestas, onEliminar, onValidar, validado }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Por: {autor}</Card.Subtitle>
        <Card.Text>{contenido}</Card.Text>
        <Card.Text>Respuestas: {respuestas}</Card.Text>

        {!validado && (
          <>
            <Button variant="success" onClick={() => onValidar(id)} className="me-2">
              Validar
            </Button>
            <Button variant="danger" onClick={() => onEliminar(id)}>
              Eliminar
            </Button>
          </>
        )}
        {validado && <p className="text-success">✔ Validado</p>}
      </Card.Body>
    </Card>
  );
}

export default ForoAdminCard;