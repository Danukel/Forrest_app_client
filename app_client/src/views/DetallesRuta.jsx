import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Spinner} from 'react-bootstrap';
import { MapContainer, TileLayer, Polyline, Marker, Popup, } from 'react-leaflet';
import { useParams, useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import '../styles/DetallesRuta.css';
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
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

const DetallesRuta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorita, setIsFavorita] = useState(false);
  const [opiniones, setOpiniones] = useState([]);
  const [nuevaOpinion, setNuevaOpinion] = useState('');
  const [nuevaPuntuacion, setNuevaPuntuacion] = useState(0);
  const [orden, setOrden] = useState('recientes');
  const [averageRating, setAverageRating] = useState(0);
  const token = localStorage.getItem('token');

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

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

        const resFavs = await fetch(`http://localhost:3001/users/${userId}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataFavs = await resFavs.json();
        setIsFavorita(dataFavs.some(r => r._id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuta();
  }, [id]);

  const toggleFavorita = async () => {
    try {
      const method = isFavorita ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:3001/users/${userId}/favorites/${id}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Error al actualizar favoritos');
      setIsFavorita(!isFavorita);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnviarOpinion = async () => {
    if (nuevaPuntuacion < 1 || nuevaPuntuacion > 5 || !nuevaOpinion.trim()) {
      alert('Completa todos los campos correctamente');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/routes/rutas/${id}/ratings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, score: nuevaPuntuacion, comment: nuevaOpinion }),
      });

      if (!res.ok) throw new Error('Error al enviar opinión');
      const updatedOpiniones = await res.json();
      setOpiniones(updatedOpiniones);
      setNuevaOpinion('');
      setNuevaPuntuacion(0);
    } catch (err) {
      console.error(err);
      alert('Error al enviar opinión');
    }
  };

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
      <PrivateLayout>
        <Container className="my-5 text-center">
          <Spinner animation="border" variant="success" />
          <p>Cargando ruta...</p>
        </Container>
      </PrivateLayout>
    );
  }

  if (!ruta) {
    return (
      <PrivateLayout>
        <Container className="my-5 text-center">
          <p>No se encontró la ruta.</p>
        </Container>
      </PrivateLayout>
    );
  }

  const { name, description, distance, difficulty, duration, elevationGain, location, clima } = ruta;
  const { temperatura, viento, precipitaciones, estado, icono } = clima || {};


  return (
    <PrivateLayout>
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
                <div className="mt-2">
                  <Button variant="link" onClick={toggleFavorita} className="p-0">
                    {isFavorita ? <FaHeart color="red" size={20} /> : <FaRegHeart size={20} />}
                  </Button>
                </div>
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
                <Col xs="auto">
                  <Button
                    variant="success"
                    className="rounded-pill"
                    onClick={async () => {
                      try {
                        await fetch(`http://localhost:3001/users/${userId}/history`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ id })
                        });
                      } catch (err) {
                        console.error('Error al añadir la ruta al historial:', err);
                      }

                      navigate(`/rutas/${id}/en-curso`, {
                        state: { rutaCoordenadas: location.map(p => [p.lat, p.lon]) }
                      });
                    }}
                  >
                    Iniciar ruta
                  </Button>
                </Col>
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

              <div className="mb-3">
                <Form.Label>Tu puntuación:</Form.Label>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <span key={n} onClick={() => setNuevaPuntuacion(n)} style={{ cursor: 'pointer' }}>
                      {nuevaPuntuacion >= n ? <FaStar color="#28a745" /> : <FaRegStar />}
                    </span>
                  ))}
                </div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribe tu opinión..."
                  value={nuevaOpinion}
                  onChange={(e) => setNuevaOpinion(e.target.value)}
                />
                <Button className="mt-2 rounded-pill" variant="success" onClick={handleEnviarOpinion}>
                  Enviar opinión
                </Button>
              </div>

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
    </PrivateLayout>
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


export default DetallesRuta;
