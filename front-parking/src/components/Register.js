import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import ParkingControlLogo from '../assets/images/ParkingControl.png'; // Asegúrate de que la ruta sea correcta

const Register = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }
        try {
            await api.post('/auth/register', {
                name,
                last_name: lastName,
                email,
                password,
                phone, 
            });
            toast.success('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        } catch (err) {
            if (err.response && err.response.data.error) {
                const errors = err.response.data.error;
                Object.values(errors).forEach((error) => toast.error(error[0]));
            } else {
                toast.error('Error al registrar el usuario. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="flex w-full max-w-6xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <div className="hidden w-1/2 lg:flex items-center justify-center">
                    <img
                        src={ParkingControlLogo}
                        alt="Parking Control Logo"
                        className="h-100 w-100" 
                    />
                </div>

                {/* Formulario */}
                <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-900 text-center">
                        ¡Regístrese ahora!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Complete el formulario a continuación para obtener acceso instantáneo
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        {/* Nombre y Apellido */}
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                    Nombres
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                                    Apellidos
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email
                            </label>
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

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                Contraseña
                            </label>
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

                        {/* Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                Teléfono
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-primary"
                            />
                        </div>

                        {/* Botón de registro */}
                        <div>
                            <button
                                type="submit"
                                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                            >
                                Registrarse
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="/login" className="font-semibold text-primary hover:text-opacity-90">
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;