import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PrivateLayout from '../components/PrivateLayout';
import RutaCard from '../components/RutaCard';

function MisRutas() {
  const [favoritas, setFavoritas] = useState([]);
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
  
    const fetchFavoritas = async () => {
      console.log(`Solicitando favoritas para userId: ${userId}`);
  
      try {
        const res = await fetch(`http://localhost:3001/users/${userId}/favorites`, {
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
        console.log('Datos recibidos:', data);
  
        setFavoritas(data);
      } catch (error) {
        console.error('Error al cargar rutas favoritas:', error);
      } finally {
        setCargando(false);
      }
    };
  
    fetchFavoritas();
  }, [userId]);
  

  const eliminarRuta = async (userId, routeId) => {
    try {
      const res = await fetch(`http://localhost:3001/users/${userId}/favorites/${routeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
      if (!res.ok) {
        throw new Error('Error al eliminar la ruta');
      }
  
      console.log('Ruta eliminada correctamente');

      // Actualiza el estado 'favoritas' eliminando la ruta de la lista
    setFavoritas(prevFavoritas => prevFavoritas.filter(ruta => ruta._id !== routeId));
    } catch (error) {
      console.error('Error al eliminar la ruta:', error);
    }
  };

  return (
    <PrivateLayout>
      <Container className="my-5">
        <h2 className="mb-4">Mis rutas favoritas</h2>
        {cargando ? (
          <p>Cargando...</p>
        ) : favoritas.length === 0 ? (
          <p>No tienes rutas favoritas aún.</p>
        ) : (
          <Row>
            {favoritas.map(ruta => (
              <Col key={ruta._id} md={4} className="mb-4">
                  <RutaCard
                    ruta={ruta}
                    tipo="misrutas"
                    onEliminar={() => eliminarRuta(userId, ruta._id)}  // Aquí pasamos el userId y routeId
                  />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PrivateLayout>
  );
}

export default MisRutas;
