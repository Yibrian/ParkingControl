import React, { useState, useEffect } from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';
import { parkingSpacesApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
    const [spaces, setSpaces] = useState([]);
    const navigate = useNavigate();

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

    // Formatear hora a 12h con AM/PM
    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    };

    const handleProfileClick = () => navigate('/client/profile');

    return (
        <ClientSlideLayout activePage="/client">
            <ClientHeader />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Espacios del parqueadero</h2>
                <div className="space-y-6">
                    {spaces.map((space) => (
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
                                // onClick={() => reservarEspacio(space.id)} // Aquí irá la lógica de reserva
                            >
                                Reservar
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                    Mi perfil
                </button>
            </div>
        </ClientSlideLayout>
    );
};

export default ClientDashboard;