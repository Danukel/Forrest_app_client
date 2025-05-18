import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Spinner} from 'react-bootstrap';
import { MapContainer, TileLayer, Polyline, Marker, Popup, } from 'react-leaflet';
import { useParams, useNavigate } from 'react-router-dom';
//import PrivateLayout from '../components/PrivateLayout';
import '../styles/DetallesRutaSin.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import L from 'leaflet';

// Íconos personalizados
const startIcon = new L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: green; width: 20px; height: 20px; border-radius: 50%;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -20],
});

const endIcon = new L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -20],
});

const DetallesRutaSin = () => {
  const { id } = useParams();
  //const navigate = useNavigate();
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opiniones, setOpiniones] = useState([]);
  const [orden, setOrden] = useState('recientes');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const res = await fetch(`http://localhost:3001/routes/rutas/${id}`);
        if (!res.ok) throw new Error('Error al obtener ruta');
        const data = await res.json();
        setRuta(data);

        const resOpiniones = await fetch(`http://localhost:3001/routes/rutas/${id}/ratings`);
        const dataOpiniones = await resOpiniones.json();
        setOpiniones(dataOpiniones);

        const scores = dataOpiniones.map(op => op.score);
        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
        setAverageRating(avg);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuta();
  }, [id]);


  const getFilteredOpinions = () => {
    switch (orden) {
      case 'recientes': return opiniones.slice().reverse();
      case 'antiguas': return opiniones.slice();
      case 'score': return opiniones.slice().sort((a, b) => b.score - a.score);
      default: return opiniones;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? <FaStar key={i} color="#28a745" /> : <FaRegStar key={i} />
    );
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="success" />
        <p>Cargando ruta...</p>
      </Container>
    );
  }

  if (!ruta) {
    return (
      <Container className="my-5 text-center">
        <p>No se encontró la ruta.</p>
      </Container>
    );
  }

  const { name, description, distance, difficulty, duration, elevationGain, location, clima } = ruta;
  const { temperatura, viento, precipitaciones, estado, icono } = clima || {};


  return (
      <Container className="my-5">
        <Row>
          <Col md={3}>
            <Card className="mb-3 p-3 text-center">
              <h5 className="fw-bold">{name}</h5>
              <img src="/images/ruta7.jpg" alt="Ruta" className="img-fluid my-2 rounded" />
              <div className="text-success">
                {averageRating > 0 ? (
                  <>
                    {renderStars(Math.round(averageRating))}
                    <div><small>({opiniones.length} valoración{opiniones.length !== 1 && 'es'})</small></div>
                  </>
                ) : (
                  <small>Sin valoraciones aún</small>
                )}
              </div>
              <ul className="list-unstyled text-start mt-3 small">
                <li><strong>Distancia:</strong> {distance} km</li>
                <li><strong>Tiempo estimado:</strong> {duration} min</li>
                <li><strong>Dificultad:</strong> {getDificultadTexto(difficulty)}</li>
                <li><strong>Altitud:</strong> {elevationGain || 0} m</li>
                <li><strong>Temperatura:</strong> {temperatura ?? 'N/D'} °C</li>
                <li><strong>Viento:</strong> {viento ?? 'N/D'} km/h</li>
                <li><strong>Precipitaciones:</strong> {precipitaciones ?? 'N/D'} mm</li>
                <li><strong>Estado:</strong> {estado ?? 'No disponible'}</li>
              </ul>
              {icono && (
                <div className="text-center">
                  <img src={icono} alt="Icono clima" width="60" />
                </div>
              )}
            </Card>
          </Col>

          <Col md={9}>
            <Card className="p-4 mb-4">
              <Row className="justify-content-between">
                <Col><h5 className="fw-bold">Descripción</h5></Col>
              </Row>
              <p className="mt-3 descripcion-justificada">{description}</p>
              {location?.length > 0 && (
                <MapContainer center={[location[0].lat, location[0].lon]} zoom={13} style={{ height: '300px', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline positions={location.map(loc => [loc.lat, loc.lon])} color="blue" />
                  <Marker position={[location[0].lat, location[0].lon]} icon={startIcon}><Popup>Inicio</Popup></Marker>
                  <Marker position={[location[location.length - 1].lat, location[location.length - 1].lon]} icon={endIcon}><Popup>Final</Popup></Marker>
                </MapContainer>
              )}
            </Card>

            <Card className="p-4">
              <Row className="justify-content-between mb-3">
                <Col><h5 className="fw-bold">Opiniones</h5></Col>
                <Col xs="auto">
                  <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
                    <option value="recientes">Más recientes</option>
                    <option value="antiguas">Más antiguas</option>
                    <option value="score">Por puntuación</option>
                  </Form.Select>
                </Col>
              </Row>

              <div className="opiniones-scroll">
                {getFilteredOpinions().length > 0 ? (
                  getFilteredOpinions().map((opinion, i) => (
                    <div key={i} className="border-bottom pb-2 mb-2">
                      <div>{renderStars(opinion.score)}</div>
                      <p><strong>{opinion.user.username}</strong></p>
                      <p>{opinion.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay opiniones aún.</p>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

const getDificultadTexto = (valor) => {
  switch (valor) {
    case 0: return 'Fácil';
    case 1: return 'Moderada';
    case 2: return 'Difícil';
    case 3: return 'Muy difícil';
    case 4: return 'Extremo';
    default: return 'Desconocida';
  }
};


export default DetallesRutaSin;
