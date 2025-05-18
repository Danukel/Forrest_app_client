import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

// Crea una instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor para añadir automáticamente el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas globales (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Puedes hacer logout automático aquí si quieres
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;