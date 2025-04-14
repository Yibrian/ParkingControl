import axios from 'axios';

// Configuración de Axios con la URL base del backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1', // Cambia esta URL si tu backend está en otro puerto o dominio
});

// Interceptor para agregar el token JWT a las cabeceras de las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtén el token JWT del almacenamiento local
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Agrega el token a las cabeceras
    }
    return config;
});

export default api;