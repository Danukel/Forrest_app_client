import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PrivateLayout from '../components/PrivateLayout';
import RutaCard from '../components/RutaCard';

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;
  console.log(localStorage.getItem('user'));
  console.log("User ID obtenido:", userId);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId) {
      console.warn('No hay userId disponible');
      return;
    }

    const fetchHistorial = async () => {
      console.log(`Solicitando historial para userId: ${userId}`);

      try {
        const res = await fetch(`http://localhost:3001/users/${userId}/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Respuesta del backend:', res);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${text}`);
        }

        const data = await res.json();
        console.log('Datos de historial recibidos:', data);

        setHistorial(data);
      } catch (error) {
        console.error('Error al cargar historial de rutas:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchHistorial();
  }, [userId]);

  return (
    <PrivateLayout>
      <Container className="my-5">
        <h2 className="mb-4">Historial de rutas</h2>
        {cargando ? (
          <p>Cargando...</p>
        ) : historial.length === 0 ? (
          <p>No hay rutas en tu historial aún.</p>
        ) : (
          <Row>
            {historial.map(ruta => (
              <Col key={ruta._id} md={4} className="mb-4">
                <RutaCard ruta={ruta.route} tipo="historial" />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PrivateLayout>
  );
}

export default Historial;
