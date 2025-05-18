import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import '../styles/CrearTema.css'; // Asegúrate de tener este archivo o elimínalo si no lo usas

function CrearTema() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  // Obtener el ID del usuario desde localStorage
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;
  console.log(localStorage.getItem('user'));
  console.log("User ID obtenido:", userId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Asegurarse de que el ID del usuario esté disponible
    if (!userId) {
      alert("No se pudo obtener el ID del usuario. Inicia sesión.");
      return;
    }

    // Crear el objeto nuevoTema sin asociación con la ruta
    const nuevoTema = {
      title: titulo,
      content: mensaje,
      userId: userId, // Usamos el ID del usuario obtenido de localStorage
    };

    try {
      // Enviar la solicitud al backend para crear un nuevo tema
      const res = await fetch('http://localhost:3001/forum', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(nuevoTema),
      });

      if (!res.ok) {
        throw new Error('Error al crear el tema');
      }

      // Si la publicación fue exitosa, redirigir al foro
      navigate('/foro');
    } catch (error) {
      console.error('Error al enviar el tema:', error);
      alert('Hubo un error al publicar el tema. Intenta de nuevo.');
    }
  };

  return (
    <PrivateLayout>
      <Container className="my-5">
        <h2 className="mb-4">Crear nuevo tema</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitulo" className="mb-4">
            <Form.Label><em>Título</em></Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formMensaje" className="mb-4">
            <Form.Label><em>Mensaje</em></Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />
          </Form.Group>

          <Row className="mt-4 justify-content-between">
            <Col xs="auto">
              <Button variant="secondary" onClick={() => navigate('/foro')}>
                Atrás
              </Button>
            </Col>
            <Col xs="auto">
              <Button type="submit" variant="success">
                Publicar
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </PrivateLayout>
  );
}

export default CrearTema;