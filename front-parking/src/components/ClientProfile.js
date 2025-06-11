import React, { useState, useEffect } from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';
import { parkingSpacesApi } from '../services/api';
import api from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
    const [user, setUser] = useState(() => {
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

    // Vehículos
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
    const [vehicleForm, setVehicleForm] = useState({ plate: '', type: 'Carro' });

    // Cargar vehículos del usuario
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await parkingSpacesApi.get('/vehicles', {
                    params: { user_id: user.id },
                });
                setVehicles(response.data);
                // Selecciona el predeterminado
                const defaultVehicle = response.data.find(v => v.is_default);
                setSelectedVehicle(defaultVehicle || null);
            } catch {
                setVehicles([]);
            }
        };
        if (user.id) fetchVehicles();
    }, [user.id]);

    // Seleccionar vehículo predeterminado
    const handleSelectVehicle = async (vehicle) => {
        try {
            await parkingSpacesApi.patch(`/vehicles/${vehicle.id}/default`);
            setVehicles(vehicles.map(v => ({
                ...v,
                is_default: v.id === vehicle.id,
            })));
            setSelectedVehicle(vehicle);
            toast.success('Vehículo predeterminado actualizado.');
        } catch {
            toast.error('No se pudo actualizar el vehículo predeterminado.');
        }
    };

    // Añadir vehículo
    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const response = await parkingSpacesApi.post('/vehicles', {
                user_id: user.id,
                plate: vehicleForm.plate,
                type: vehicleForm.type,
            });
            setVehicles([...vehicles, response.data]);
            setIsVehicleModalOpen(false);
            setVehicleForm({ plate: '', type: 'Carro' });
            toast.success('Vehículo añadido.');
        } catch (error) {
            toast.error('No se pudo añadir el vehículo.');
        }
    };

    // Editar vehículo
    const handleEditVehicle = async (e) => {
        e.preventDefault();
        try {
            const response = await parkingSpacesApi.put(`/vehicles/${selectedVehicle.id}`, {
                plate: vehicleForm.plate,
                type: vehicleForm.type,
            });
            setVehicles(vehicles.map(v =>
                v.id === selectedVehicle.id ? response.data : v
            ));
            setIsEditVehicleModalOpen(false);
            toast.success('Vehículo actualizado.');
        } catch {
            toast.error('No se pudo editar el vehículo.');
        }
    };

    // Eliminar vehículo
    const handleDeleteVehicle = async () => {
        try {
            await parkingSpacesApi.delete(`/vehicles/${selectedVehicle.id}`);
            setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
            setSelectedVehicle(null);
            setIsEditVehicleModalOpen(false);
            toast.success('Vehículo eliminado.');
        } catch {
            toast.error('No se pudo eliminar el vehículo.');
        }
    };

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

                        {/* Vehículos */}
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
                                            v.is_default
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                                : 'border-gray-200 bg-white text-gray-500'
                                        }`}
                                        onClick={() => handleSelectVehicle(v)}
                                    >
                                        <span className="text-base">{v.plate}</span>
                                        <span className="text-xs mt-1">{v.type}</span>
                                    </button>
                                ))}
                                {/* Botón para añadir */}
                                <button
                                    type="button"
                                    className="rounded-lg border border-blue-500 bg-white text-blue-600 px-4 py-2 font-bold shadow-sm flex items-center justify-center hover:bg-blue-50"
                                    onClick={() => {
                                        setVehicleForm({ plate: '', type: 'Carro' });
                                        setIsVehicleModalOpen(true);
                                    }}
                                    title="Añadir vehículo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                {/* Botón para editar */}
                                {vehicles.length > 0 && (
                                    <button
                                        type="button"
                                        className="rounded-lg border border-yellow-500 bg-white text-yellow-600 px-4 py-2 font-bold shadow-sm flex items-center justify-center hover:bg-yellow-50"
                                        onClick={() => {
                                            // Si hay un vehículo seleccionado, edítalo; si no, edita el primero
                                            const vehicleToEdit = selectedVehicle || vehicles[0];
                                            setVehicleForm({
                                                plate: vehicleToEdit.plate,
                                                type: vehicleToEdit.type,
                                            });
                                            setIsEditVehicleModalOpen(true);
                                        }}
                                        title="Editar vehículo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Modal para añadir vehículo */}
                        {isVehicleModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                                    <h2 className="text-lg font-bold mb-4">Añadir Vehículo</h2>
                                    <form onSubmit={handleAddVehicle} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Placa</label>
                                            <input
                                                type="text"
                                                value={vehicleForm.plate}
                                                onChange={e => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                                                className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Tipo</label>
                                            <input
                                                type="text"
                                                value={vehicleForm.type}
                                                onChange={e => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                                                className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsVehicleModalOpen(false)}
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

                        {/* Modal para editar vehículo */}
                        {isEditVehicleModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                                    <h2 className="text-lg font-bold mb-4">Editar Vehículo</h2>
                                    <form onSubmit={handleEditVehicle} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Placa</label>
                                            <input
                                                type="text"
                                                value={vehicleForm.plate}
                                                onChange={e => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                                                className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Tipo</label>
                                            <input
                                                type="text"
                                                value={vehicleForm.type}
                                                onChange={e => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                                                className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-between space-x-4">
                                            <button
                                                type="button"
                                                onClick={handleDeleteVehicle}
                                                className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                            <div className="flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditVehicleModalOpen(false)}
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
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para editar perfil */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

