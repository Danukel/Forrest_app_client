import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    console.log('Formulario de registro:', formData);  // Verifica los datos
  
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        navigate('/login');
      } else {
        const errorMsg = await response.text();
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src="/images/logo_sin_fondo.png" alt="Logo" className="login-logo" />
        <h2 className="text-center">Registrarse</h2>

        <Form className="mt-4" onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Control type="text" name="username" placeholder="Nombre de usuario" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control type="email" name="email" placeholder="Correo electrónico" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control type="password" name="password" placeholder="Contraseña" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Control type="password" name="confirmPassword" placeholder="Confirmar contraseña" required onChange={handleChange} />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 rounded-pill">
            Registrarse
          </Button>
        </Form>

        <p className="mt-3 text-center small">
          ¿Ya tienes una cuenta? <a href="/login" className="text-success">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;