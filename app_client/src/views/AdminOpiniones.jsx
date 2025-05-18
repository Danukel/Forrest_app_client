import React, { useState, useEffect } from 'react';
import OpinionCard from '../components/OpinionAdminCard';
import PrivateLayout from '../components/PrivateLayoutAdmin';
import '../styles/AdminOpinion.css';
import { Container, Dropdown } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

function AdminOpiniones() {
  const [filtro, setFiltro] = useState('todas');
  const [opiniones, setOpiniones] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOpiniones();
  }, []);

  const fetchOpiniones = async () => {
  try {
    const res = await fetch('http://localhost:3001/rating/ratings', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al obtener opiniones');
    }

    if (!Array.isArray(data)) {
      console.error('Respuesta inesperada de /ratings:', data);
      alert('Error: El servidor no devolvió una lista de opiniones.');
      return;
    }

    setOpiniones(data);
  } catch (err) {
    alert('Error al cargar opiniones: ' + err.message);
    console.error('Error completo:', err);
  }
};

  const eliminarOpinion = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/rating/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setOpiniones((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const validarOpinion = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/rating/validate/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setOpiniones((prev) =>
        prev.map((o) => (o._id === id ? { ...o, validated: true } : o))
      );
    } catch (err) {
      alert('Error al validar: ' + err.message);
    }
  };

  const filtrarOpiniones = (lista, filtro) => {
    if (!Array.isArray(lista)) return [];
    switch (filtro) {
      case 'validas':
        return lista.filter((o) => o.validated);
      case 'pendientes':
        return lista.filter((o) => !o.validated);
      default:
        return lista;
    }
  };

  const getNombreFiltro = () => {
    switch (filtro) {
      case 'validas':
        return 'Válidas';
      case 'pendientes':
        return 'Pendientes de validar';
      default:
        return 'Todas';
    }
  };

  const opinionesFiltradas = filtrarOpiniones(opiniones, filtro);

  return (
    <PrivateLayout>
      <Container className="mt-4">
        <h3 className="mb-4">Opiniones</h3>

        <Dropdown className="mb-4">
          <Dropdown.Toggle variant="secondary" id="dropdown-filtro">
            <FaFilter className="me-2" /> {getNombreFiltro()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFiltro('todas')}>Todas</Dropdown.Item>
            <Dropdown.Item onClick={() => setFiltro('validas')}>Válidas</Dropdown.Item>
            <Dropdown.Item onClick={() => setFiltro('pendientes')}>Pendientes de validar</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {Array.isArray(opinionesFiltradas) && opinionesFiltradas.length > 0 ? (
          opinionesFiltradas.map((op) => (
            <OpinionCard
              key={op._id}
              id={op._id}
              stars={op.score ?? 0}
              content={<strong>{op.comment}</strong>}
              date={new Date(op.createdAt).toLocaleDateString()}
              route={op.route?.name || 'Ruta desconocida'}
              author={op.user?.username || 'Anónimo'}
              onEliminar={eliminarOpinion}
              onValidar={validarOpinion}
              validado={op.validated} 
            />
          ))
        ) : (
          <p>No hay opiniones disponibles.</p>
        )}
      </Container>
    </PrivateLayout>
  );
}

export default AdminOpiniones;
