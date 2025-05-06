import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { toast } from 'react-toastify';
import { passwordResetApi } from '../services/api';
import ParkingControlLogo from '../assets/images/ParkingControl.png'; // Asegúrate de que la ruta sea correcta

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Hook para redirección
    const token = searchParams.get('token');

    // Verificar si el token está presente en la URL
    useEffect(() => {
        if (!token) {
            toast.error('Acceso no autorizado. Redirigiendo al inicio de sesión...');
            navigate('/login'); // Redirige al login si no hay token
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        try {
            await passwordResetApi.post('/password-reset/reset', {
                token,
                password,
                password_confirmation: confirmPassword,
            });
            toast.success('Contraseña actualizada correctamente.');

            // Redirigir al usuario al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('El token es inválido o ha expirado.');
            } else {
                toast.error('Error al actualizar la contraseña. Inténtalo de nuevo.');
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
                    Restablecer Contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu nueva contraseña para continuar
                </p>

                {/* Formulario */}
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Nueva Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
                    >
                        Restablecer Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;