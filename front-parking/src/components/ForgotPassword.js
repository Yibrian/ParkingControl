import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { passwordResetApi } from '../services/api';
import ParkingControlLogo from '../assets/images/ParkingControl.png'; // Asegúrate de que la ruta sea correcta

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await passwordResetApi.post('/password-reset/send-link', { email });
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
                    Recuperar Contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo electrónico para recibir un enlace de restablecimiento
                </p>

                {/* Formulario */}
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
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
                    >
                        Enviar Correo
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;