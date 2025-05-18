import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useAuth() {
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  const isAuthenticated = () => !!getToken();

  const login = (token) => {
    localStorage.setItem('token', token);
    navigate('/userhome');
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Instancia de Axios con token en headers
  const axiosWithAuth = axios.create({
    baseURL: 'http://localhost:4000/api', // cambia según tu backend
    headers: {
      Authorization: getToken()
    }
  });

  // Interceptor para manejar errores globales
  axiosWithAuth.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  // Función para peticiones protegidas
  const request = async (method, url, data = {}) => {
    try {
      const response = await axiosWithAuth({ method, url, data });
      return response.data;
    } catch (err) {
      throw err.response?.data || { error: 'Error desconocido' };
    }
  };

  return {
    getToken,
    isAuthenticated,
    login,
    logout,
    request // función segura para peticiones con token
  };
}
