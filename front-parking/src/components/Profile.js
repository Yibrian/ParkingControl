import React, { useState, useEffect } from 'react';
import SlideLayout from './SlideLayout';
import Header from './Header';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile', {
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                password,
                password_confirmation: confirmPassword,
            });
            alert('Perfil actualizado correctamente.');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <SlideLayout activePage="/profile">
            <Header title="Mi Perfil" currentUser={user} />
            <div className="px-6 py-4">
                <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
                    <div className="space-y-6">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                    Nombres
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={user.name}
                                    readOnly
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                                    Apellidos
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={user.last_name}
                                    readOnly
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100"
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
                                type="email"
                                value={user.email}
                                readOnly
                                className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100"
                            />
                        </div>

                        {/* Celular */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                Teléfono
                            </label>
                            <input
                                id="phone"
                                type="text"
                                value={user.phone}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                className="block w-full rounded-md border px-3 py-2 text-gray-900"
                            />
                        </div>

                        {/* Botón Editar */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para editar perfil */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-lg font-bold mb-4">Editar Perfil</h2>
                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                    Nombres
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                                    Apellidos
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={user.last_name}
                                    onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Nueva Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SlideLayout>
    );
};

export default Profile;