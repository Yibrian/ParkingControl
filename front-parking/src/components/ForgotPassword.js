import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que el correo sea de Gmail
        if (!email.endsWith('@gmail.com')) {
            toast.error('El correo debe ser una dirección de Gmail.');
            return;
        }

        try {
            // Llamar al microservicio para enviar el correo
            await api.post('http://localhost:8081/api/password-reset/send-link', { email });
            toast.success('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('El correo no está registrado en la base de datos.');
            } else {
                toast.error('Error al enviar el correo. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Recuperar Contraseña</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Ingresa tu correo de Gmail para restablecer tu contraseña.
                </p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                    >
                        Enviar Correo
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;