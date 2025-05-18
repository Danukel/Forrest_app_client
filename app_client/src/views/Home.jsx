import React, { useState } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import Navbar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import '../styles/General.css';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import RutaCard from '../components/RutaCardHome'; // Asegúrate de tener este componente

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(`http://localhost:3001/routes/search/${searchTerm}`);
      if (!res.ok) throw new Error('Error en la búsqueda');
      const data = await res.json();
      setSearchResults(data);
      setShowModal(true); // Mostrar el modal con resultados
    } catch (err) {
      console.error('Error al buscar rutas:', err);
    }
  };

  const handleSelect = (ruta) => {
    navigate(`/detallesrutasin/${ruta._id}`);
    setSearchResults([]);
    setShowModal(false); // Cierra el modal tras seleccionar
  };

  return (
    <div className="home-container d-flex flex-column min-vh-100">
      <Navbar />

      {/* Hero Section */}
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
            <Button variant="success" className="ms-2" onClick={handleSearch}>
              Buscar
            </Button>

          </Form>
        </div>
      </header>

      {/* Testimonial */}
      <section className="testimonial-section text-center my-5 px-3">
        <h4>Lo que dicen nuestros senderistas</h4>
        <blockquote className="fst-italic mt-3">
          "Gracias a esta web encontré rutas increíbles y bien organizadas. ¡Muy recomendable!"<br />
          - Juan Pérez
        </blockquote>
      </section>

      <Footer />
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
                  <RutaCard ruta={ruta} onClick={() => handleSelect(ruta)} />
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
    </div>
  );
}

export default Home;
