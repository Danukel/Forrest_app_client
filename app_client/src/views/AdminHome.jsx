import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/AdminHome.css';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayoutAdmin';

function AdminHome() {
  const navigate = useNavigate();

  return (
    <PrivateLayout>
      <div className="admin-home-page">
        <div className="position-relative" style={{ height: '49vh', overflow: 'hidden' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-100 h-100 object-fit-cover"
            style={{ objectPosition: 'top' }}
          >
            <source src="/images/3121327-uhd_3840_2160_24fps.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <h1 className="display-1 text-white" style={{ fontStyle: 'italic' }}>FORREST</h1>
          </div>
        </div>

        <div className="container bg-white py-4">
          <h2 className="fs-1 fw-bold font-italic text-center mb-4">Secciones</h2>

          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card mb-4 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="card-title font-italic mb-3">Estadísticas</h3>
                  <button className="btn btn-success btn-lg" onClick={() => navigate('/adminstats')}>Ir</button>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="card mb-4 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="card-title font-italic mb-4">Administración</h3>
                  <div className="row">
                    <div className="col">
                      <button className="btn btn-success btn-lg w-100" onClick={() => navigate('/adminforo')}>Foro</button>
                    </div>
                    <div className="col">
                      <button className="btn btn-success btn-lg w-100" onClick={() => navigate('/adminopiniones')}>Opiniones</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default AdminHome;
