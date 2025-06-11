import React, { useState, useEffect } from 'react';
import Header from './Header';
import SlideLayout from './SlideLayout';
import { parkingSpacesApi } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [spaces, setSpaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSpace, setCurrentSpace] = useState({
        name: '',
        vehicle_type: '',
        price_per_hour: '',
        total_spaces: '',
        start_time: '',
        end_time: '',
    });

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await parkingSpacesApi.get('/profile');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch spaces from the backend
    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await parkingSpacesApi.get('/spaces');
                setSpaces(response.data);
            } catch (error) {
                toast.error('Error al cargar los espacios.');
            }
        };

        fetchSpaces();
    }, []);

    // Función para formatear hora a 12h con AM/PM
    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    };

    // Handle form submission for creating or updating a space
    const handleSaveSpace = async (e) => {
        e.preventDefault();

        try {
            if (currentSpace.id) {
                // Update an existing space
                await parkingSpacesApi.put(`/spaces/${currentSpace.id}`, currentSpace);
                toast.success('Espacio actualizado correctamente.');
            } else {
                // Create a new space
                await parkingSpacesApi.post('/spaces', currentSpace);
                toast.success('Espacio creado correctamente.');
            }

            setIsModalOpen(false);
            setCurrentSpace({
                name: '',
                vehicle_type: '',
                price_per_hour: '',
                total_spaces: '',
                start_time: '',
                end_time: '',
            });

            // Refresh the list of spaces
            const response = await parkingSpacesApi.get('/spaces');
            setSpaces(response.data);
        } catch (error) {
            toast.error('Error al guardar el espacio.');
        }
    };

    // Handle toggling active state of a space
    const handleToggleActive = async (id) => {
        try {
            const response = await parkingSpacesApi.patch(`/spaces/${id}/toggle-active`);
            const updatedSpaces = spaces.map((space) =>
                space.id === id ? { ...space, active: response.data.active } : space
            );
            setSpaces(updatedSpaces);
            toast.success('Estado del espacio actualizado.');
        } catch (error) {
            toast.error('Error al cambiar el estado del espacio.');
        }
    };

    return (
        <SlideLayout activePage="/admin">
            <Header title="Espacios del parqueadero" currentUser={currentUser} />
            <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold text-gray-900">Espacios del Parqueadero</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-add"
                    >
                        Añadir Espacio
                    </button>
                </div>
                <div className="space-y-4">
                    {spaces.map((space) => (
                        <div
                            key={space.id}
                            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200"
                        >
                            {/* Información del espacio */}
                            <div className="flex items-center space-x-6">
                                {/* Espacios disponibles */}
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-green-600">
                                        {space.available_spaces || 0}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Libres de {space.total_spaces}
                                    </span>
                                </div>

                                {/* Detalles del espacio */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{space.name}</h2>
                                    <p className="text-sm text-gray-600">
                                        Tipo de Vehículo: {space.vehicle_type}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Horario: {formatTime(space.start_time)} - {formatTime(space.end_time)}
                                    </p>
                                </div>
                            </div>

                            {/* Precio y botones */}
                            <div className="flex items-center space-x-4">
                                {/* Precio por hora */}
                                <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                                    {new Intl.NumberFormat('es-CO', {
                                        style: 'currency',
                                        currency: 'COP',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(space.price_per_hour)}{' '}
                                    por hora
                                </span>

                                {/* Botón de activar/desactivar */}
                                <button
                                    onClick={() => handleToggleActive(space.id)}
                                    className={`btn ${space.active ? 'btn-disable' : 'btn-save'}`}
                                >
                                    {space.active ? 'Desactivar' : 'Activar'}
                                </button>

                                {/* Botón de editar */}
                                <button
                                    onClick={() => {
                                        setCurrentSpace(space);
                                        setIsModalOpen(true);
                                    }}
                                    className="btn btn-edit"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">
                                {currentSpace.id ? 'Editar Espacio' : 'Añadir Espacio'}
                            </h2>
                            <form onSubmit={handleSaveSpace} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={currentSpace.name}
                                        onChange={(e) =>
                                            setCurrentSpace({ ...currentSpace, name: e.target.value })
                                        }
                                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Tipo de Vehículo
                                    </label>
                                    <input
                                        type="text"
                                        value={currentSpace.vehicle_type}
                                        onChange={(e) =>
                                            setCurrentSpace({
                                                ...currentSpace,
                                                vehicle_type: e.target.value,
                                            })
                                        }
                                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Precio por Hora
                                    </label>
                                    <input
                                        type="number"
                                        value={currentSpace.price_per_hour}
                                        onChange={(e) =>
                                            setCurrentSpace({
                                                ...currentSpace,
                                                price_per_hour: e.target.value,
                                            })
                                        }
                                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Espacios Totales
                                    </label>
                                    <input
                                        type="number"
                                        value={currentSpace.total_spaces}
                                        onChange={(e) =>
                                            setCurrentSpace({
                                                ...currentSpace,
                                                total_spaces: e.target.value,
                                            })
                                        }
                                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Hora de Inicio
                                    </label>
                                    <input
                                        type="time"
                                        value={currentSpace.start_time}
                                        onChange={(e) =>
                                            setCurrentSpace({ ...currentSpace, start_time: e.target.value })
                                        }
                                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">
                                        Hora de Fin
                                    </label>
                                    <input
                                        type="time"
                                        value={currentSpace.end_time}
                                        onChange={(e) =>
                                            setCurrentSpace({ ...currentSpace, end_time: e.target.value })
                                        }
                                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                        required
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
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SlideLayout>
    );
};

export default AdminDashboard;