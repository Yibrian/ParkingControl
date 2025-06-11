import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EmployeeReservationForm = ({ space, onBack, onSubmit }) => {
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !startTime || !vehiclePlate || !vehicleType) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }

        setLoading(true);
        await onSubmit({
            start_date: startDate,
            start_time: startTime,
            vehicle_plate: vehiclePlate,
            vehicle_type: vehicleType,
            description,
            space_id: space.id,
        });
        setLoading(false);
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
                    <label className="block text-sm font-medium text-gray-900">Placa del vehículo</label>
                    <input
                        type="text"
                        value={vehiclePlate}
                        onChange={e => setVehiclePlate(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                        placeholder="Ej: ABC123"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Tipo de vehículo</label>
                    <input
                        type="text"
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        className="block w-full rounded-md border px-3 py-2 text-gray-900"
                        required
                        placeholder="Ej: Carro, Moto"
                    />
                </div>
                <div className="col-span-2">
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
                        {loading ? 'Procesando...' : 'Registrar entrada'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeReservationForm;