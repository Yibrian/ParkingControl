import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // URL del servicio parking-control
});

export const passwordResetApi = axios.create({
    baseURL: 'http://localhost:8081/api/v1', // URL del servicio password-reset-service
});

export const parkingSpacesApi = axios.create({
    baseURL: 'http://localhost:8082/api', // URL del servicio parking-space-service
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;