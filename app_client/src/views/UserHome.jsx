import React, { useEffect, useState } from 'react';
import PrivateLayout from '../components/PrivateLayout';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import RutaCard from '../components/RutaCard';

function UserHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rutas, setRutas] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const res = await fetch('http://localhost:3001/routes/rutas/top');
        if (!res.ok) throw new Error('Error al obtener rutas destacadas');
        const data = await res.json();
        setRutas(data);
      } catch (err) {
        console.error('Error al cargar rutas destacadas:', err);
      }
    };
    fetchRutas();

  }, []);

  const handleSearch = async (term) => {
    try {
      const res = await fetch(`http://localhost:3001/routes/search/${term}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error del servidor: ${res.status} - ${text}`);
      }
      const data = await res.json();
      setSearchResults(data);
      setShowModal(true);
    } catch (err) {
      console.error('Error al buscar rutas:', err);
    }
  };

  return (
    <PrivateLayout>
      <header className="hero-section">
        <video autoPlay loop muted playsInline className="video-background">
          <source src="/images/3121327-uhd_3840_2160_24fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-text">
          <h1>FORREST</h1>
          <h2>Descubre las mejores rutas de senderismo en Aragón</h2>
          <Form
            className="d-flex justify-content-center mt-4"
            onSubmit={e => { e.preventDefault(); handleSearch(searchTerm); }}
          >
            <Form.Control
              type="text"
              placeholder="Buscar rutas..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button variant="success" className="ms-2" onClick={() => handleSearch(searchTerm)}>Buscar</Button>
          </Form>
        </div>
      </header>

      <Container className="my-5">
        <h2 className="text-center mb-4">Rutas Recomendadas</h2>
        <Row>
          {rutas.map(ruta => (
            <Col key={ruta._id} md={4} className="mb-4">
              <RutaCard ruta={ruta} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal con resultados de búsqueda */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Resultados de búsqueda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {searchResults.length > 0 ? (
            <Row>
              {searchResults.map(ruta => (
                <Col key={ruta._id} md={6} className="mb-4">
                  <RutaCard ruta={ruta} />
                </Col>
              ))}
            </Row>
          ) : (
            <p>No se encontraron rutas con ese término.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </PrivateLayout>
  );
}

export default UserHome;
