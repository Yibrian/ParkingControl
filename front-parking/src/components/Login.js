import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import api from '../services/api';
import { toast } from 'react-toastify';
import ParkingControlLogo from '../assets/images/ParkingControl.png'; // Asegúrate de que la ruta sea correcta

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para redirección

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data;

            // Guarda el token en localStorage
            localStorage.setItem('token', access_token);

            // Redirige según el rol del usuario
            if (user.rol === 'ADMINISTRADOR') {
                navigate('/admin'); // Redirige al dashboard de administrador
            } else {
                toast.error('No tienes permisos para acceder a esta sección.');
            }
        } catch (err) {
            if (err.response && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src={ParkingControlLogo}
                        alt="Parking Control Logo"
                        className="h-28 w-28"
                    />
                </div>

                {/* Título */}
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                    Inicio de sesión
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingrese usuario y contraseña
                </p>

                {/* Formulario */}
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Correo Electrónico
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                            />
                        </div>
                    </div>

                    {/* Botón de inicio de sesión */}
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                {/* Enlace para registrarse */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{' '}
                    <a href="/register" className="font-semibold text-primary hover:text-opacity-90">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;