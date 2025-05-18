import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Icono personalizado para el usuario
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Centrar el mapa a la ubicación del usuario
function CenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);  // Actualiza la vista del mapa
  }, [position, map]); // Solo actualiza si la posición cambia
  return null;
}

const RutaEnCurso = () => {
  const { state } = useLocation(); // Obtiene el estado de la navegación
  const { rutaCoordenadas } = state || {}; // Desestructura las coordenadas

  const [posicionUsuario, setPosicionUsuario] = useState(null);
  const token = localStorage.getItem('token');

  // Seguimiento de la ubicación del usuario
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosicionUsuario([latitude, longitude]);  // Actualiza la posición del usuario
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);  // Limpia el watcher cuando el componente se desmonta
  }, []);

  if (!rutaCoordenadas) return <p>No hay coordenadas disponibles.</p>; // Manejo de error si no hay coordenadas

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer
        center={rutaCoordenadas[0] || [0, 0]}  // Centra el mapa en la primera coordenada si está disponible
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Ruta */}
        <Polyline positions={rutaCoordenadas} color="blue" />

        {/* Posición del usuario */}
        {posicionUsuario && (
          <>
            <Marker position={posicionUsuario} icon={userIcon} />
            <CenterMap position={posicionUsuario} />  {/* Centra el mapa en la ubicación del usuario */}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default RutaEnCurso;
