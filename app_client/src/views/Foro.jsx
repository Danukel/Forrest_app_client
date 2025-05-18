import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa'; // Importa el ícono de filtro
import PrivateLayout from '../components/PrivateLayout';
import TemaCard from '../components/TemaCard';

function Foro() {
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState(''); // Estado para almacenar el filtro seleccionado
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const res = await fetch('http://localhost:3001/forum', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${text}`);
        }

        const data = await res.json();
        console.log('Temas recibidos:', data);
        setTemas(data);
      } catch (error) {
        console.error('Error al cargar los temas del foro:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchTemas();
  }, []);

  const ordenarTemas = (temas, filtro) => {
    switch (filtro) {
      case 'recientes':
        return temas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'antiguos':
        return temas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return temas;
    }
  };

  const handleFiltroSelect = (filtroSeleccionado) => {
    setFiltro(filtroSeleccionado);
  };

  const temasOrdenados = ordenarTemas(temas, filtro);

  return (
    <PrivateLayout>
      <Container className="my-5">
        <h2 className="mb-4">Foro</h2>

        <Button 
          variant="success" 
          className="mb-4 rounded-pill" 
          onClick={() => navigate('/foro/crear')}
        >
          Crear tema
        </Button>

        {/* Filtro */}
        <Dropdown className="mb-4">
          <Dropdown.Toggle variant="secondary" id="dropdown-filtro">
            <FaFilter /> Filtros
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFiltroSelect('recientes')}>
              Más recientes
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFiltroSelect('antiguos')}>
              Más antiguos
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFiltroSelect('respuestas')}>
              Más respuestas
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {cargando ? (
          <p>Cargando temas...</p>
        ) : temasOrdenados.length === 0 ? (
          <p>No hay temas creados aún.</p>
        ) : (
          <Row>
            {temasOrdenados.map((tema) => (
              <Col key={tema._id} md={6} className="mb-4">
                <TemaCard tema={tema} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </PrivateLayout>
  );
}

export default Foro;