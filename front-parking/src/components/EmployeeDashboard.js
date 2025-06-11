import React, { useState, useEffect } from 'react';
import EmployeeSlideLayout from './EmployeeSlideLayout';
import EmployeeHeader from './EmployeeHeader';
import { parkingSpacesApi } from '../services/api';
import EmployeeReservationForm from './EmployeeReservationForm';
import { toast } from 'react-toastify';

const EmployeeDashboard = () => {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [vehicles, setVehicles] = useState([]);

    // Cargar espacios
    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await parkingSpacesApi.get('/spaces');
                setSpaces(response.data);
            } catch (error) {
                toast.error('Error al cargar los espacios.');
                setSpaces([]);
            }
        };
        fetchSpaces();
    }, []);

    // Cargar vehículos del empleado
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        const fetchVehicles = async () => {
            try {
                const response = await parkingSpacesApi.get('/vehicles', {
                    params: { user_id: currentUser.id }
                });
                setVehicles(response.data);
            } catch {
                setVehicles([]);
            }
        };
        fetchVehicles();
    }, []);

    // Formatear hora a 12h con am/pm
    const formatTime = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12 || 12;
        return `${h}:${minute} ${ampm}`;
    };

    // Volver al dashboard desde la vista de reserva
    const handleBack = () => setSelectedSpace(null);

    // Enviar reserva al backend
    const handleSubmitEmployeeReservation = async (reservationData) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        try {
            await parkingSpacesApi.post('/employee-reservations', {
                employee_id: currentUser.id,
                space_id: selectedSpace.id,
                start_date: reservationData.start_date,
                start_time: reservationData.start_time,
                vehicle_plate: reservationData.vehicle_plate,
                vehicle_type: reservationData.vehicle_type,
                description: reservationData.description,
            });
            setSpaces(spaces =>
                spaces.map(s =>
                    s.id === selectedSpace.id
                        ? { ...s, available_spaces: s.available_spaces - 1 }
                        : s
                )
            );
            setSelectedSpace(null);
            toast.success('Reserva creada correctamente.');
        } catch (error) {
            console.error('Error al crear la reserva:', error, error.response?.data);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error al crear la reserva.');
            }
        }
    };

    return (
        <EmployeeSlideLayout activePage="/employee">
            <EmployeeHeader title="" />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Espacios del parqueadero</h2>
                {selectedSpace ? (
                    <EmployeeReservationForm
                        space={selectedSpace}
                        vehicles={vehicles}
                        onBack={handleBack}
                        onSubmit={handleSubmitEmployeeReservation}
                    />
                ) : (
                    <div className="space-y-6">
                        {spaces
                            .filter(space => space.active)
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
                                                <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTime(space.start_time)} - {formatTime(space.end_time)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className={`bg-blue-600 text-white px-6 py-2 rounded-md font-semibold flex items-center hover:bg-blue-700 ${space.available_spaces <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => setSelectedSpace(space)}
                                        disabled={space.available_spaces <= 0}
                                    >
                                        Nueva entrada
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </EmployeeSlideLayout>
    );
};

export default EmployeeDashboard;