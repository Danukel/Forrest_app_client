// components/MapaInteractivo.js
import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

function MapaClickHandler({ onClickMapa }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClickMapa(lat, lng);
    },
  });
  return null;
}

function MapaInteractivo({ onUbicacionSeleccionada }) {
  return (
    <MapContainer center={[40.4168, -3.7038]} zoom={6} style={{ height: '200px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapaClickHandler onClickMapa={onUbicacionSeleccionada} />
    </MapContainer>
  );
}

export default MapaInteractivo;
