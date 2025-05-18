import { useState, useEffect  } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      if (user.role === 'admin') {
        navigate('/adminhome');
      } else {
        navigate('/userhome');
      }
    }
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Usuario guardado:', data.user);

        if (data.user.role === 'admin') {
          navigate('/adminhome');
        } else {
          navigate('/userhome');
        }
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('Error de red o del servidor');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src="/images/logo_sin_fondo.png" alt="Logo" className="login-logo" />
        <h2 className="text-center">Iniciar Sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <Form className="mt-4" onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 rounded-pill">
            Iniciar sesión
          </Button>
        </Form>

        <p className="mt-3 text-center small">
          ¿No tienes una cuenta? <a href="/register" className="text-success">Registrarse aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Login;