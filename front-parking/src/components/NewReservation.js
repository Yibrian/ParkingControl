import React, { useState } from 'react';
import { parkingSpacesApi } from '../services/api';
import { toast } from 'react-toastify';

const NewReservation = ({ space, vehicles, onBack }) => {
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Crear la reserva
            const reservationRes = await parkingSpacesApi.post('/reservations', {
                user_id: user.id,
                space_id: space.id,
                vehicle_id: selectedVehicle,
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
                description,
            });
            const reservation = reservationRes.data;

            // 2. Crear sesión de pago Stripe
            const stripeRes = await parkingSpacesApi.post('/stripe/checkout', {
                reservation_id: reservation.id,
                amount: space.price_per_hour,
            });
            window.location.href = stripeRes.data.url;
        } catch (error) {
            toast.error('No se pudo crear la reserva o iniciar el pago.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded-lg mt-6">
            <button
                type="button"
                onClick={onBack}
                className="mb-4 text-gray-600 hover:text-blue-600 flex items-center"
            >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
            </button>
            <form className="grid grid-cols-2 gap-6 mt-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Fecha de inicio</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Hora inicio</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Fecha de finalización</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Finalización</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Seleccionar vehículo</label>
                    <select
                        value={selectedVehicle}
                        onChange={e => setSelectedVehicle(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                    >
                        <option value="">Elige tu vehículo</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.plate} ({v.type})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Descripción (opcional)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        placeholder="Descripción"
                    />
                </div>
                <div className="col-span-2 flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Añadir nueva reserva'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewReservation;