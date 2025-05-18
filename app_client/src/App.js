import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import UserHome from './views/UserHome';
import MisRutas from './views/MisRutas';
import Foro from './views/Foro';
import Explorar from './views/ExplorarRutas';
import Estadisticas from './views/Estadisticas';
import Historial from './views/Historial';
import DetallesRuta from './views/DetallesRuta';
import DetallesRutaSin from './views/DetallesRutaSin';
import PrivateRoute from './components/PrivateRoute';
import CrearOpinion from './views/CrearOpinion';
import DetallesTemaForo from './views/DetallesTemaForo';
import CrearTema from './views/CrearTema';
import 'leaflet/dist/leaflet.css';
import RutaEnCurso from './views/RutaEnCurso';
import AdminHome from './views/AdminHome';
import AdminStats from './views/AdminStats';
import AdminForo from './views/AdminForo';
import AdminOpiniones from './views/AdminOpiniones';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detallesrutasin/:id" element={<DetallesRutaSin />} />

        {/* Rutas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/misrutas" element={<MisRutas />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/detallesruta/:id" element={<DetallesRuta />} />
          <Route path="/detallesruta/:id/opinion" element={<CrearOpinion />} />
          <Route path="/foro/tema/:id" element={<DetallesTemaForo />} />
          <Route path="/foro/crear" element={<CrearTema />} />
          <Route path="/rutas/:id/en-curso" element={<RutaEnCurso />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/adminstats" element={<AdminStats />} />
          <Route path="/adminforo" element={<AdminForo />} />
          <Route path="/adminopiniones" element={<AdminOpiniones />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;