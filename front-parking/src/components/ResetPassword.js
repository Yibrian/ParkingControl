import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Obtener el token del query string

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Llamar al microservicio para restablecer la contraseña
            await api.post('http://localhost:8081/api/password-reset/reset', {
                token,
                password,
                password_confirmation: confirmPassword,
            });
            toast.success('Contraseña actualizada correctamente.');
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
                <h2 className="text-2xl font-bold text-gray-900 text-center">Restablecer Contraseña</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Ingresa tu nueva contraseña.
                </p>
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
                            className="block w-full rounded-md border px-3 py-2 text-gray-900"
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
                            className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                    >
                        Restablecer Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;