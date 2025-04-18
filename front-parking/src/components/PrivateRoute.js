// filepath: c:\Users\Yibrian Alvarez\Documents\VisualStudio\laravel\front-parking\src\components\PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Verifica si hay un token en localStorage

    if (!token) {
        return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
    }

    return children;
};

export default PrivateRoute;