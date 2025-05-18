import React, { useState, useEffect } from 'react';
import ForoCard from '../components/ForoAdminCard';
import PrivateLayout from '../components/PrivateLayoutAdmin';
import '../styles/AdminForo.css';
import { Container, Dropdown } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

function AdminForo() {
  const [filtro, setFiltro] = useState('todas');
  const [temas, setTemas] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTemas();
  }, []);

  const fetchTemas = async () => {
    try {
      const res = await fetch('http://localhost:3001/forum', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTemas(data);
    } catch (err) {
      alert('Error al cargar temas: ' + err.message);
    }
  };

  const eliminarTema = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/forum/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      setTemas((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const validarTema = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/forum/validate/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setTemas((prev) =>
        prev.map((t) => (t._id === id ? { ...t, validated: true } : t))
      );
    } catch (err) {
      alert('Error al validar: ' + err.message);
    }
  };

  const filtrarTemas = (temas, filtro) => {
    switch (filtro) {
      case 'validas':
        return temas.filter((t) => t.validated);
      case 'pendientes':
        return temas.filter((t) => !t.validated);
      default:
        return temas;
    }
  };

  const getNombreFiltro = () => {
    switch (filtro) {
      case 'validas': return 'Válidas';
      case 'pendientes': return 'Pendientes de validar';
      default: return 'Todas';
    }
  };

  const temasFiltrados = filtrarTemas(temas, filtro);

  return (
    <PrivateLayout>
      <Container className="mt-4">
        <h3 className="mb-4">Foro</h3>

        {/* Dropdown de filtros */}
        <Dropdown className="mb-4">
          <Dropdown.Toggle variant="secondary" id="dropdown-filtro">
            <FaFilter className="me-2" /> {getNombreFiltro()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFiltro('todas')}>
              Todas
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFiltro('validas')}>
              Válidas
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFiltro('pendientes')}>
              Pendientes de validar
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Tarjetas del foro filtradas */}
        {temasFiltrados.map((tema) => (
          <ForoCard
            key={tema._id}
            id={tema._id}
            titulo={tema.title}
            contenido={tema.content}
            autor={tema.userId?.username || 'Anónimo'}
            respuestas={tema.replies?.length || 0}
            validado={tema.validated}
            onEliminar={eliminarTema}
            onValidar={validarTema}
          />
        ))}
      </Container>
    </PrivateLayout>
  );
}

export default AdminForo;
