import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PrivateLayout from '../components/PrivateLayout';
import '../styles/Estadisticas.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

function Estadisticas() {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

  const [estadisticas, setEstadisticas] = useState({
    totalDistancia: 0,
    totalTiempo: 0,
    totalRutas: 0,
    totalDesnivel: 0,
    distanciaPorDia: [],
    rutasPorDificultad: [],
  });

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${userId}/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${text}`);
        }

        const historial = await res.json();

        const rutasCompletas = await Promise.all(
          historial.map(async (item) => {
            try {
              const rutaRes = await fetch(`http://localhost:3001/routes/rutas/${item.route._id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const ruta = await rutaRes.json();
              return {
                ...ruta,
                completedAt: item.completedAt
              };
            } catch (error) {
              console.warn(`❗ Fallo ruta ${item.route}:`, error.message);
              return null;
            }
          })
        );

        const rutasValidas = rutasCompletas.filter(r => r !== null);

        const totalDistancia = rutasValidas.reduce((acc, r) => acc + (r?.distance || 0), 0);
        const totalTiempo = rutasValidas.reduce((acc, r) => acc + (r?.duration || 0), 0);
        const totalDesnivel = rutasValidas.reduce((acc, r) => acc + (r?.elevationGain || 0), 0);
        const totalRutas = rutasValidas.length;

        const distanciaPorDia = {};
        rutasValidas.forEach(r => {
          const fecha = new Date(r.completedAt).toISOString().split('T')[0];
          distanciaPorDia[fecha] = (distanciaPorDia[fecha] || 0) + (r.distance || 0);
        });

        const rutasPorDificultad = {};
        rutasValidas.forEach(r => {
          const dificultad = r.difficulty;
          if (dificultad === 0 || dificultad === 1 || dificultad === 2 || dificultad === 3 || dificultad === 4) {
            rutasPorDificultad[dificultad] = (rutasPorDificultad[dificultad] || 0) + 1;
          }
        });

        setEstadisticas({
          totalDistancia,
          totalTiempo,
          totalRutas,
          totalDesnivel,
          distanciaPorDia: Object.entries(distanciaPorDia).map(([fecha, distancia]) => ({ fecha, distancia })),
          rutasPorDificultad: Object.entries(rutasPorDificultad).map(([dificultad, cantidad]) => ({
            dificultad: parseInt(dificultad),
            cantidad
          }))
        });

      } catch (err) {
        console.error('❌ Error general:', err);
      }
    };

    fetchHistorial();
  }, [token, userId]);

  const formatTiempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  };

  const dificultadLabel = (value) => {
    switch (value) {
      case 0: return "Fácil";
      case 1: return "Moderada";
      case 2: return "Difícil";
      case 3: return "Muy difícil";
      case 4: return "Extremo";
      default: return "";
    }
  };

  return (
    <PrivateLayout>
      <Container fluid className="estadisticas-container py-5">
        <Row>
          <Col md={3} className="resumen-panel px-4">
            <h5 className="fw-bold fst-italic mb-4">Resumen de actividad</h5>
            <Card className="mb-3 p-3 resumen-box">
              <span className="fw-semibold">Distancia Total Recorrida</span>
              <small>{estadisticas.totalDistancia.toFixed(2)} km</small>
            </Card>
            <Card className="mb-3 p-3 resumen-box">
              <span className="fw-semibold">Tiempo total</span>
              <small>{formatTiempo(estadisticas.totalTiempo)}</small>
            </Card>
            <Card className="mb-3 p-3 resumen-box">
              <span className="fw-semibold">Rutas completadas</span>
              <small>{estadisticas.totalRutas} rutas</small>
            </Card>
            <Card className="mb-3 p-3 resumen-box">
              <span className="fw-semibold">Desnivel acumulado</span>
              <small>{estadisticas.totalDesnivel} metros</small>
            </Card>
          </Col>

          <Col md={9}>
            <Row>
              <Col md={12} className="mb-4">
                <Card className="p-3">
                  <h6 className="text-center fw-bold mb-3">Distancia por día</h6>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={estadisticas.distanciaPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="distancia" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="p-3">
                  <h6 className="text-center fw-bold mb-3">Rutas por dificultad</h6>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={estadisticas.rutasPorDificultad}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dificultad" tickFormatter={dificultadLabel} />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} rutas`} labelFormatter={dificultadLabel} />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#82ca9d" name="Cantidad de rutas" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </PrivateLayout>
  );
}

export default Estadisticas;
