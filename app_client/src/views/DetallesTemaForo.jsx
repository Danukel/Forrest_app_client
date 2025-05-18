// src/pages/DetallesTemaForo.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import '../styles/DetallesTemaForo.css';

const DetallesTemaForo = () => {
  const { id } = useParams();
  const [tema, setTema] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTema = async () => {
      try {
        const response = await fetch(`http://localhost:3001/forum/${id}`, {
          //method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Error al obtener el tema: ${response.status} - ${response.statusText}. Detalles: ${errorDetails}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setTema(data);
          setRespuestas(data.respuestas);
        } else {
          throw new Error('La respuesta no es JSON.');
        }
      } catch (error) {
        console.error('Error al obtener el tema:', error.message);
      }
    };

    fetchTema();
  }, [id]);

  const handleResponder = async () => {
    if (nuevaRespuesta.trim() === '' || !userId) return;

    const nueva = {
      content: nuevaRespuesta,
      userId: userId,
    };

    try {
      const response = await fetch(`http://localhost:3001/forum/${id}/responder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nueva),
      });

      if (!response.ok) throw new Error('Error al enviar la respuesta');

      const data = await response.json();
      setRespuestas([...respuestas, {
        _id: data._id,
        texto: data.content,
        autor: data.userId?.username || 'Tú',
        createdAt: data.createdAt
      }]);
      setNuevaRespuesta('');
    } catch (error) {
      console.error('Error al responder:', error);
    }
  };

  if (!tema) {
    return <p>Cargando...</p>;
  }

  return (
    <PrivateLayout>
      <Container className="my-5">
        {/* Tema principal */}
        <Card className="mb-4 p-4">
          <h5 className="fw-bold fst-italic">{tema.titulo}</h5>
          <p className="mt-3">{tema.contenido}</p>
          <p className="text-muted">
            <strong>Publicado por: {tema.autor}</strong>
          </p>
        </Card>

        {/* Formulario de respuesta */}
        <Form className="mb-4 d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Escribe tu respuesta..."
            value={nuevaRespuesta}
            onChange={(e) => setNuevaRespuesta(e.target.value)}
          />
          <Button variant="success" onClick={handleResponder}>
            Responder
          </Button>
        </Form>

        {/* Lista de respuestas */}
        {respuestas.map((resp) => (
          <Card key={resp._id} className="mb-2 p-3">
            <p className="fst-italic mb-1">{resp.texto}</p>
            <p className="text-muted fw-bold small">• {resp.autor}</p>
          </Card>
        ))}
      </Container>
    </PrivateLayout>
  );
};

export default DetallesTemaForo;
