import React, { useState } from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';
import api from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
    const [user, setUser] = useState(() => {
        // Cargar datos desde localStorage al inicializar
        const storedUser = localStorage.getItem('currentUser');
        return storedUser
            ? JSON.parse(storedUser)
            : {
                  name: '',
                  last_name: '',
                  email: '',
                  identification: '', 
                  phone: '', 
                  userimg: '',
              };
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Estado para vehículos
    const [vehicles, setVehicles] = useState([
        // Ejemplo de datos iniciales, reemplaza por datos reales del backend
        { id: 1, plate: 'ABC 123', type: 'Carro', selected: true },
        { id: 2, plate: 'ABC 223', type: 'Moto', selected: false },
    ]);
    const [newPlate, setNewPlate] = useState('');
    const [newType, setNewType] = useState('Carro');

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        const payload = {
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            identification: user.identification, // Agregar el campo identification
        };

        if (password) {
            payload.password = password;
            payload.password_confirmation = confirmPassword;
        }

        try {
            const response = await api.put('/profile', payload);

            // Actualizar el estado del usuario y localStorage
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            toast.success('Perfil actualizado correctamente.');
            setIsModalOpen(false);

            // Recargar la página para reflejar los cambios
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.data) {
                const errors = error.response.data.errors || error.response.data.error;
                if (typeof errors === 'object') {
                    Object.values(errors).forEach((err) => toast.error(err));
                } else {
                    toast.error(errors);
                }
            } else {
                toast.error('Error al actualizar el perfil. Inténtalo de nuevo.');
            }
            console.error('Error updating profile:', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadPicture = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Por favor selecciona una imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', selectedFile);

        try {
            const response = await api.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Actualizar la imagen del usuario en el estado y en localStorage
            const updatedUser = { ...user, userimg: response.data.userimg };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            toast.success('Foto de perfil actualizada correctamente.');
            setIsPhotoModalOpen(false);

            // Recargar la página para reflejar los cambios
            window.location.reload();
        } catch (error) {
            toast.error('Error al subir la foto de perfil. Inténtalo de nuevo.');
        }
    };

    // Función para eliminar la foto de perfil
    const handleDeletePicture = async () => {
        try {
            const response = await api.delete('/profile/picture');
            // Usa la ruta que retorna el backend
            const updatedUser = { ...user, userimg: response.data.userimg };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            toast.success('Foto de perfil eliminada. Se ha colocado la imagen por defecto.');
            window.location.reload();
        } catch (error) {
            toast.error('Error al eliminar la foto de perfil. Inténtalo de nuevo.');
        }
    };

    return (
        <ClientSlideLayout activePage="/client/profile">
            <ClientHeader />
            <div className="px-6 py-4">
                <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
                    <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={`http://localhost:8000/storage/${user.userimg}`}
                                alt="Avatar"
                                className="h-28 w-28 rounded-full border-2 border-gray-300"
                            />
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPhotoModalOpen(true)}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                                >
                                    Subir Foto
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeletePicture}
                                    className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700"
                                    disabled={user.userimg === 'profile_images/default-profile.png'}
                                >
                                    Eliminar Foto
                                </button>
                            </div>
                        </div>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Nombres
                                </label>
                                <p className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100">
                                    {user.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Apellidos
                                </label>
                                <p className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100">
                                    {user.last_name}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <p className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100">
                                {user.email}
                            </p>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Teléfono
                            </label>
                            <p className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100">
                                {user.phone}
                            </p>
                        </div>

                        {/* Identificación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">
                                Identificación
                            </label>
                            <p className="block w-full rounded-md border px-3 py-2 text-gray-900 bg-gray-100">
                                {user.identification}
                            </p>
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

                        {/* Módulo de Vehículos */}
                        <div className="mt-10 border rounded-lg p-6 bg-white">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Vehículos</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Seleccione la matrícula de su vehículo predeterminada
                            </p>
                            <div className="flex gap-4 mb-6">
                                {vehicles.map((v) => (
                                    <button
                                        key={v.id}
                                        className={`flex flex-col items-center px-6 py-3 rounded-lg border text-center shadow-sm transition ${
                                            v.selected
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                                : 'border-gray-200 bg-white text-gray-500'
                                        }`}
                                        onClick={() => {
                                            setVehicles(vehicles.map(veh => ({
                                                ...veh,
                                                selected: veh.id === v.id
                                            })));
                                        }}
                                    >
                                        <span className="text-base">{v.plate}</span>
                                        <span className="text-xs mt-1">{v.type}</span>
                                    </button>
                                ))}
                            </div>
                            <form
                                className="flex gap-4 items-center"
                                onSubmit={e => {
                                    e.preventDefault();
                                    if (!newPlate) return;
                                    setVehicles([
                                        ...vehicles,
                                        {
                                            id: Date.now(),
                                            plate: newPlate,
                                            type: newType,
                                            selected: false,
                                        },
                                    ]);
                                    setNewPlate('');
                                    setNewType('Carro');
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Añade la matrícula de tu vehículo"
                                    className="rounded-md border px-3 py-2 text-gray-900 w-64"
                                    value={newPlate}
                                    onChange={e => setNewPlate(e.target.value)}
                                />
                                <select
                                    className="rounded-md border px-3 py-2 text-gray-900"
                                    value={newType}
                                    onChange={e => setNewType(e.target.value)}
                                >
                                    <option value="Carro">Carro</option>
                                    <option value="Moto">Moto</option>
                                </select>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                                    title="Agregar vehículo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </form>
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
                                <label htmlFor="identification" className="block text-sm font-medium text-gray-900">
                                    Identificación
                                </label>
                                <input
                                    id="identification"
                                    type="text"
                                    value={user.identification}
                                    onChange={(e) => setUser({ ...user, identification: e.target.value })}
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

            {/* Modal para subir foto */}
            {isPhotoModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-lg font-bold mb-4">Subir Foto de Perfil</h2>
                        <form onSubmit={handleUploadPicture} className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Tamaño máximo: 1MB. Formatos permitidos: JPEG, PNG, JPG, GIF.
                                </p>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-900 border rounded-md"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPhotoModalOpen(false)}
                                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ClientSlideLayout>
    );
};

export default Profile;