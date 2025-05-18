import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/AdminStats.css';
import PrivateLayout from '../components/PrivateLayoutAdmin';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

// Componente gráfico reutilizable
function LineChart({ data, label, color, title }) {
  if (!data) return null;

  const labels = Object.keys(data).sort(); // Fechas ordenadas
  const values = labels.map(date => data[date]);

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data: values,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        tension: 0.2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: title,
        font: { size: 18 }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

function AdminStats() {
  const [loginStats, setLoginStats] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [registrationStats, setRegistrationStats] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/admin/stats')
      .then(res => res.json())
      .then(data => {
        setLoginStats(data.login);
        setRouteStats(data.routes);
        setRegistrationStats(data.registrations);
        setRatingStats(data.ratings);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener estadísticas:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando estadísticas...</p>;
  if (!loginStats || !routeStats || !registrationStats || !ratingStats)
    return <p className="text-center mt-5 text-danger">No se pudieron cargar las estadísticas.</p>;

  const statValues = [
    ['Accesos diarios', `${loginStats.today} accesos`],
    ['Accesos totales', `${loginStats.total} accesos`],
    ['Rutas completadas hoy', `${routeStats.today} rutas`],
    ['Rutas completadas totales', `${routeStats.total} rutas`],
    ['Usuarios registrados hoy', `${registrationStats.today} usuarios`],
    ['Usuarios registrados totales', `${registrationStats.total} usuarios`],
    ['Comentarios hoy', `${ratingStats.today} comentarios`],
    ['Comentarios totales', `${ratingStats.total} comentarios`],
  ];

  return (
    <PrivateLayout>
      <div className="admin-stats-page">
        <div className="container py-5">
          <h2 className="fs-1 fw-bold font-italic text-center mb-5">Resumen de Actividad</h2>

          {/* Estadísticas generales */}
          <div className="row row-cols-1 row-cols-md-2 g-4 mb-5 justify-content-center">
            {statValues.map(([title, value], idx) => (
              <div className="col" key={idx}>
                <div className="stat-card p-3 border rounded shadow-sm text-center bg-white">
                  <p className="stat-title fw-bold">{title}</p>
                  <p className="stat-value text-success fs-4">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="mb-5 p-4 bg-light border rounded">
            <LineChart
              data={loginStats.byDay}
              label="Accesos por día"
              color="#28a745"
              title="Gráfico de Accesos por Día"
            />
          </div>

          <div className="mb-5 p-4 bg-light border rounded">
            <LineChart
              data={routeStats.byDay}
              label="Rutas completadas por día"
              color="#007bff"
              title="Gráfico de Rutas Completadas por Día"
            />
          </div>

          <div className="mb-5 p-4 bg-light border rounded">
            <LineChart
              data={registrationStats.byDay}
              label="Usuarios registrados por día"
              color="#dc3545"
              title="Gráfico de Nuevos Registros por Día"
            />
          </div>

          <div className="mb-5 p-4 bg-light border rounded">
            <LineChart
              data={ratingStats.byDay}
              label="Comentarios realizados por día"
              color="#dc3545"
              title="Gráfico de Nuevos Comentarios por Día"
            />
          </div>
        </div>

        <footer className="bg-white text-center py-3 border-top mt-5">
          <p className="mb-0">© 2025 Senderismo Aragón | Proyecto Grupo 6</p>
        </footer>
      </div>
    </PrivateLayout>
  );
}

export default AdminStats;