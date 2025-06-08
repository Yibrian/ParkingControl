import React, { useState, useEffect } from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';
import { parkingSpacesApi } from '../services/api';

import NewReservation from './NewReservation'; // Importa tu componente

const ClientDashboard = () => {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null); // Nuevo estado
    const [vehicles, setVehicles] = useState([]); // Estado para vehículos del usuario
    

    // Obtener los espacios del backend
    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await parkingSpacesApi.get('/spaces');
                setSpaces(response.data);
            } catch (error) {
                // Puedes mostrar un toast aquí si quieres
            }
        };
        fetchSpaces();
    }, []);

    // Obtener vehículos del usuario (puedes ajustar el user_id según tu lógica)
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        const fetchVehicles = async () => {
            try {
                const response = await parkingSpacesApi.get('/vehicles', {
                    params: { user_id: currentUser.id }
                });
                setVehicles(response.data);
            } catch (error) {
                setVehicles([]);
            }
        };
        fetchVehicles();
    }, []);

    // Formatear hora a 12h con AM/PM
    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    };

    // Volver al dashboard desde la vista de reserva
    const handleBack = () => setSelectedSpace(null);

    return (
        <ClientSlideLayout activePage="/client">
            <ClientHeader />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Espacios del parqueadero</h2>
                {selectedSpace ? (
                    <NewReservation
                        space={selectedSpace}
                        vehicles={vehicles}
                        onBack={handleBack}
                        onSubmit={e => { e.preventDefault(); /* lógica futura */ }}
                    />
                ) : (
                    <div className="space-y-6">
                        {spaces
                            .filter(space => space.active) // Solo espacios activos
                            .map((space) => (
                                <div
                                    key={space.id}
                                    className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-3xl font-bold ${space.available_spaces > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                {space.available_spaces || 0}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Libres de {space.total_spaces}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
                                            <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                                                <span className="bg-gray-100 px-2 py-1 rounded">
                                                    {new Intl.NumberFormat('es-CO', {
                                                        style: 'currency',
                                                        currency: 'COP',
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }).format(space.price_per_hour)} /hr
                                                </span>
                                                <span>•</span>
                                                <span>{space.vehicle_type}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600 mt-1">
                                                {/* Icono de reloj */}
                                                <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTime(space.start_time)} - {formatTime(space.end_time)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold flex items-center hover:bg-green-700"
                                        onClick={() => setSelectedSpace(space)}
                                    >
                                        Reservar
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </ClientSlideLayout>
    );
};

export default ClientDashboard;