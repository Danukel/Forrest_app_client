import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import PrivateLayout from '../components/PrivateLayout';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/CrearOpinion.css';

function CrearOpinion() {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handlePublicar = () => {
    console.log('Valoración:', rating);
    console.log('Comentario:', comentario);
    // Aquí se enviarán los datos a la API más adelante
    navigate('/detallesruta/1');
  };


  return (
    <PrivateLayout>
      <Container className="crear-opinion-container my-5">
        <h4 className="mb-4">Opinión</h4>

        <div className="valoracion-box p-3 mb-4 rounded">
          <p className="mb-2 fw-semibold fst-italic">Valoración</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={32}
              className="me-2 star"
              color={star <= rating ? '#0d6efd' : '#ccc'}
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <div className="comentario-box p-3 rounded mb-4">
          <Form.Group>
            <Form.Label className="fw-semibold fst-italic">Deje aquí su comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu opinión..."
            />
          </Form.Group>
        </div>

        <div className="d-flex justify-content-between">
          <Button variant="success" onClick={() => navigate(-1)}>
            Atrás
          </Button>
          <Button variant="success" onClick={handlePublicar}>
            Publicar
          </Button>
        </div>
      </Container>
    </PrivateLayout>
  );
}

export default CrearOpinion;
