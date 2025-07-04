import React, { useEffect, useState } from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';
import { parkingSpacesApi } from '../services/api';
import { toast } from 'react-toastify';

function formatTime(time) {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
}

function formatDate(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Calcular total pagado por una reserva
function calcularTotalPagado(reserva) {
    if (!reserva.space || !reserva.start_date || !reserva.start_time || !reserva.end_date || !reserva.end_time) return 0;
    const start = new Date(`${reserva.start_date}T${reserva.start_time}`);
    const end = new Date(`${reserva.end_date}T${reserva.end_time}`);
    const diffMs = end - start;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours * reserva.space.price_per_hour;
}

const ClientReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [extraHours, setExtraHours] = useState(1);
    const [loading, setLoading] = useState(false);
    const [spaces, setSpaces] = useState([]);

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await parkingSpacesApi.get('/reservations', {
                    params: { user_id: user.id }
                });
                setReservations(res.data);
            } catch {
                toast.error('No se pudieron cargar las reservas.');
            }
        };
        fetchReservations();
    }, [user.id]);

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const res = await parkingSpacesApi.get('/spaces');
                setSpaces(res.data);
            } catch {
                toast.error('No se pudieron cargar los espacios.');
            }
        };
        fetchSpaces();
    }, []);

    const handleAddHoursClick = (reservation) => {
        setSelectedReservation(reservation);
        setExtraHours(1);
        setShowModal(true);
    };

    const handleConfirmAddHours = async () => {
        setLoading(true);
        try {
            const space = selectedReservation.space
                ? selectedReservation.space
                : spaces.find(s => s.id === selectedReservation.space_id);

            const pricePerHour = space?.price_per_hour;
            if (!pricePerHour) {
                toast.error('No se pudo obtener el precio del espacio.');
                setLoading(false);
                setShowModal(false);
                return;
            }

            const stripeRes = await parkingSpacesApi.post('/stripe/checkout', {
                reservation_id: selectedReservation.id,
                extra_hours: extraHours,
                amount: pricePerHour * extraHours,
            });
            window.location.href = stripeRes.data.url;
        } catch (error) {
            toast.error('No se pudo procesar la extensión.');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            await parkingSpacesApi.put(`/reservations/${reservationId}/cancel`);
            setReservations(reservations =>
                reservations.map(r =>
                    r.id === reservationId ? { ...r, status: 'cancelada' } : r
                )
            );
            toast.success('Reserva cancelada y espacio liberado.');
        } catch {
            toast.error('No se pudo cancelar la reserva.');
        }
    };

    // Calcular total pagado acumulado
    const totalPagadoAcumulado = reservations.reduce(
        (acc, reserva) => acc + calcularTotalPagado(reserva),
        0
    );

    return (
        <ClientSlideLayout activePage="/client/reservas">
            <ClientHeader />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-6">
                    Reservas
                    <span className="text-base font-normal text-gray-700">
                        Total pagado acumulado:{' '}
                        <span className="font-bold">
                            {Number(totalPagadoAcumulado).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                        </span>
                    </span>
                </h2>
                <div className="space-y-4">
                    {reservations.map(res => (
                        <div key={res.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                            <div>
                                <div className="font-bold text-lg">{res.space?.name || 'Zona'}</div>
                                <div className="text-sm text-gray-600">
                                    Tipo de Vehículo: {res.space?.vehicle_type}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Fecha de inicio: {formatDate(res.start_date)} {formatTime(res.start_time)}<br />
                                    Fecha de finalización: {formatDate(res.end_date)} {formatTime(res.end_time)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Estado: <span className="font-semibold">{res.status}</span>
                                </div>
                                <div className="text-sm text-gray-900 font-bold mt-2">
                                    Total pagado:{' '}
                                    {Number(calcularTotalPagado(res)).toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP
                                </div>
                            </div>
                            <div className="flex items-center gap-x-4">
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() => {
                                        if (res.status === 'confirmada') handleCancelReservation(res.id);
                                    }}
                                    disabled={res.status !== 'confirmada'}
                                >
                                    Cancelar Reserva
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => {
                                        if (res.status === 'confirmada') handleAddHoursClick(res);
                                    }}
                                    disabled={res.status !== 'confirmada'}
                                >
                                    Agregar Horas
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal para agregar horas */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">Agregar Horas</h2>
                            <label className="block mb-2">¿Cuántas horas deseas añadir?</label>
                            <input
                                type="number"
                                min={1}
                                value={extraHours}
                                onChange={e => setExtraHours(Number(e.target.value))}
                                className="block w-full rounded-md border px-3 py-2 mb-4"
                            />
                            <div className="mb-4">
                                Total a pagar:{' '}
                                <span className="font-bold">
                                    {selectedReservation.space?.price_per_hour * extraHours} COP
                                </span>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={handleConfirmAddHours}
                                    disabled={loading}
                                >
                                    {loading ? 'Procesando...' : 'Pagar y Añadir'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientSlideLayout>
    );
};

export default ClientReservations;