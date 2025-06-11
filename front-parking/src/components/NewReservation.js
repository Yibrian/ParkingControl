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

        // Horario de apertura/cierre del espacio (ejemplo: "08:00", "22:00")
        const openTime = space.start_time; // formato "HH:mm"
        const closeTime = space.end_time;  // formato "HH:mm"

        // Validaciones de fechas y horas
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().slice(0, 10);

        // 1. Fecha de inicio: no puede ser anterior a hoy
        if (startDate < todayStr) {
            toast.error('La fecha de inicio no puede ser anterior a hoy.');
            return;
        }

        // 2. Hora de inicio debe estar dentro del horario de apertura si es hoy
        if (startDate === todayStr) {
            if (startTime < openTime || startTime > closeTime) {
                toast.error(`La hora de inicio debe estar entre ${openTime} y ${closeTime}.`);
                return;
            }
        }

        // 3. Fecha de finalización: igual o posterior a la de inicio
        if (endDate < startDate) {
            toast.error('La fecha de finalización debe ser igual o posterior a la de inicio.');
            return;
        }

        // 4. Hora de finalización debe estar dentro del horario de apertura/cierre
        if (endTime < openTime || endTime > closeTime) {
            toast.error(`La hora de finalización debe estar entre ${openTime} y ${closeTime}.`);
            return;
        }

        // 5. Si es el mismo día, la hora de finalización debe ser mayor a la de inicio
        if (startDate === endDate) {
            if (startTime >= endTime) {
                toast.error('La hora de finalización debe ser posterior a la de inicio.');
                return;
            }
        }

        // 6. Duración válida: la fecha/hora de finalización debe ser posterior a la de inicio
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime <= startDateTime) {
            toast.error('La fecha y hora de finalización debe ser posterior a la de inicio.');
            return;
        }

        const diffMs = endDateTime - startDateTime;
        const diffHours = diffMs / (1000 * 60 * 60);
        const totalAmount = Math.ceil(diffHours) * space.price_per_hour;

        setLoading(true);
        try {
            const stripeRes = await parkingSpacesApi.post('/stripe/checkout', {
                user_id: user.id,
                space_id: space.id,
                vehicle_id: selectedVehicle,
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
                description,
                amount: totalAmount,
            });
            window.location.href = stripeRes.data.url;
        } catch (error) {
            toast.error('No se pudo iniciar el pago.');
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