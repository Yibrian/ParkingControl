import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Cambia esta URL si tu backend está en otro puerto o dominio
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;