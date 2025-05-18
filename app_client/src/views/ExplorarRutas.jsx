import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Pagination } from 'react-bootstrap';
import PrivateLayout from '../components/PrivateLayout';
import RutaInfoCard from '../components/RutaInfoCard';
import axios from 'axios';
import '../styles/ExplorarRutas.css';
import MapaInteractivo from '../components/MapaInteractivo';

function ExplorarRutas() {
  const [rutasFiltradas, setRutasFiltradas] = useState([]);
  const [rutaExpandida, setRutaExpandida] = useState(null);
  const [usarUbicacionUsuario, setUsarUbicacionUsuario] = useState(false);
  const [coordenadasUsuario, setCoordenadasUsuario] = useState(null);
  const [coordenadasMapa, setCoordenadasMapa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const rutasPorPagina = 10;

  const [filtros, setFiltros] = useState({
    dificultad: '',
    duracion: '',
    ubicacion: '',
  });

  useEffect(() => {
  const fetchRutas = async () => {
    setLoading(true);
    try {
      const obtenerPosicion = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });

      try {
        const position = await obtenerPosicion();
        const { latitude, longitude } = position.coords;
        setCoordenadasUsuario({ lat: latitude, lng: longitude });
        const params = new URLSearchParams();
        params.append('lat', latitude);
        params.append('lon', longitude);
        const resCercanas = await axios.get(`http://localhost:3001/routes/rutas/buscar?${params.toString()}`);
        setRutasFiltradas(resCercanas.data);
      } catch (geoError) {
        console.log('Esto no debería aparecer')
        const res = await axios.get('http://localhost:3001/routes/rutas');
        setRutasFiltradas(res.data);
      }
    } catch (error) {
      console.error('Error al obtener rutas:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchRutas();
}, []);

  const rutasPaginadas = rutasFiltradas.slice(
    (paginaActual - 1) * rutasPorPagina,
    paginaActual * rutasPorPagina
  );

  const cambiarPagina = (numero) => {
    setPaginaActual(numero);
  };

  const totalPaginas = Math.ceil(rutasFiltradas.length / rutasPorPagina);

  const renderPaginacion = () => (
    <Pagination className="justify-content-center mt-4">
      {[...Array(totalPaginas).keys()].map((_, idx) => (
        <Pagination.Item
          key={idx + 1}
          active={idx + 1 === paginaActual}
          onClick={() => cambiarPagina(idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  const handleExpandir = (idRuta) => {
    setRutaExpandida((prev) => (prev === idRuta ? null : idRuta));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.dificultad) params.append('dificultad', filtros.dificultad);
      if (filtros.duracion) params.append('duracion', filtros.duracion);
      if (usarUbicacionUsuario && coordenadasUsuario) {
        params.append('lat', coordenadasUsuario.lat);
        params.append('lon', coordenadasUsuario.lng);
      } else if (coordenadasMapa) {
        params.append('lat', coordenadasMapa.lat);
        params.append('lon', coordenadasMapa.lng);
      }

      const res = await axios.get(`http://localhost:3001/routes/rutas/buscar?${params.toString()}`);
      setRutasFiltradas(res.data);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setRutasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUbicacionDesdeMapa = async (lat, lng) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: { lat, lon: lng, format: 'json' },
      });
      const ciudad = res.data.address.city || res.data.address.town || res.data.address.village || '';
      setFiltros((prev) => ({ ...prev, ubicacion: ciudad }));
      setCoordenadasMapa({ lat, lng });
    } catch (error) {
      console.error('Error al obtener ubicación desde el mapa:', error);
    }
  };

  return (
    <PrivateLayout>
      <Container fluid className="explorar-container py-5">
        <Row>
          <Col md={3}>
            <div className="filtro-panel">
              <h4 className="mb-4 fw-bold">Filtrar Rutas</h4>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel de Dificultad</Form.Label>
                  <Form.Control as="select" name="dificultad" value={filtros.dificultad} onChange={handleFiltroChange}>
                    <option value="">Seleccionar dificultad</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Moderada">Moderada</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Muy difícil">Muy difícil</option>
                    <option value="Extremo">Extremo</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Duración estimada (horas)</Form.Label>
                  <Form.Control as="select" name="duracion" value={filtros.duracion} onChange={handleFiltroChange}>
                    <option value="">Seleccionar duración</option>
                    <option value="Menos de 1 hora">Menos de 1 hora</option>
                    <option value="Entre 1 y 3 horas">Entre 1 y 3 horas</option>
                    <option value="Entre 3 y 6 horas">Entre 3 y 6 horas</option>
                    <option value="Más de 6 horas">Más de 6 horas</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: usarUbicacionUsuario ? 'gray' : 'black' }}>
                    Ubicación (selección manual)
                  </Form.Label>
                  <Form.Control type="text" name="ubicacion" placeholder="Buscar por ubicación..." value={filtros.ubicacion} onChange={handleFiltroChange} disabled={usarUbicacionUsuario} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox"
                    label="Usar mi ubicación actual"
                    checked={usarUbicacionUsuario}
                    onChange={(e) => setUsarUbicacionUsuario(e.target.checked)}
                  />
                </Form.Group>
                <div className="mapa-simulacion mb-3" style={{ opacity: usarUbicacionUsuario ? 0.5 : 1, pointerEvents: usarUbicacionUsuario ? 'none' : 'auto' }}>
                  <MapaInteractivo onUbicacionSeleccionada={handleUbicacionDesdeMapa} />
                </div>
                <Button variant="success" className="w-100 rounded-pill" onClick={handleBuscar}>
                  Buscar
                </Button>
              </Form>
            </div>
          </Col>
          <Col md={9} className="rutas-columna">
            {loading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-3">Cargando rutas cercanas...</p>
              </div>
            ) : rutasFiltradas.length === 0 ? (
              <p className="text-center mt-5">No se encontraron rutas con esos filtros.</p>
            ) : (
              <>
                {rutasPaginadas.map((ruta) => (
                  <RutaInfoCard
                    key={ruta._id}
                    ruta={{
                      id: ruta._id,
                      nombre: ruta.name,
                      descripcion: ruta.description,
                      distancia: `${ruta.distance} m`,
                      dificultad: getNombreDificultad(ruta.difficulty),
                      iconoTiempo: ruta.iconoClima,
                    }}
                    expandida={rutaExpandida === ruta._id}
                    onExpandir={() => handleExpandir(ruta._id)}
                  />
                ))}
                {renderPaginacion()}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </PrivateLayout>
  );
}

function getNombreDificultad(nivel) {
  switch (nivel) {
    case 0: return 'Fácil';
    case 1: return 'Moderada';
    case 2: return 'Difícil';
    case 3: return 'Muy difícil';
    case 4: return 'Extremo';
    default: return 'Desconocida';
  }
}

export default ExplorarRutas;
