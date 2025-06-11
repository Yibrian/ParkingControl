import React, { useEffect, useState } from 'react';
import EmployeeSlideLayout from './EmployeeSlideLayout';
import EmployeeHeader from './EmployeeHeader';
import { parkingSpacesApi } from '../services/api';

function calcularPrecio(startDate, startTime, pricePerHour) {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date();
    const diffMs = end - start;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours * pricePerHour;
}

function formatTimeAmPm(time) {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
}

const Salida = () => {
    const [reservas, setReservas] = useState([]);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [precio, setPrecio] = useState(0);

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const res = await parkingSpacesApi.get('/employee-reservations', {
                    params: { employee_id: user.id }
                });
                
                setReservas(res.data.filter(r => r.status === 'pendiente'));
            } catch {
                setReservas([]);
            }
        };
        fetchReservas();
    }, [user.id]);

    const handleAprobarSalida = (reserva) => {
        const total = calcularPrecio(reserva.start_date, reserva.start_time, reserva.space.price_per_hour);
        setSelectedReserva(reserva);
        setPrecio(total);
        setShowModal(true);
    };

    const handleConfirmarPago = async () => {
        try {
            await parkingSpacesApi.put(`/employee-reservations/${selectedReserva.id}/finish`);
            setReservas(reservas.filter(r => r.id !== selectedReserva.id));
            setShowModal(false);
        } catch {
            // Manejar error
        }
    };

    return (
        <EmployeeSlideLayout activePage="/employee/salida">
            <EmployeeHeader />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Salida de vehículos</h2>
                {reservas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        No hay reservas pendientes para salida.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservas.map(reserva => (
                            <div key={reserva.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-lg">{reserva.space?.name || 'Zona'}</div>
                                    <div className="text-sm text-gray-600">
                                        Tipo de Vehículo: {reserva.space?.vehicle_type}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Fecha de inicio: {reserva.start_date} {formatTimeAmPm(reserva.start_time)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Placa: {reserva.vehicle_plate} · {reserva.vehicle_type}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Descripción: {reserva.description}
                                    </div>
                                </div>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleAprobarSalida(reserva)}
                                >
                                    Aprobar salida
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && selectedReserva && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">Total a pagar</h2>
                            <div className="mb-4 text-xl font-bold">
                                {new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(precio)}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={handleConfirmarPago}
                                >
                                    Confirmar pago y salida
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </EmployeeSlideLayout>
    );
};

export default Salida;