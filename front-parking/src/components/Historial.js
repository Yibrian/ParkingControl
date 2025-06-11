import React, { useEffect, useState } from 'react';
import EmployeeSlideLayout from './EmployeeSlideLayout';
import EmployeeHeader from './EmployeeHeader';
import { parkingSpacesApi } from '../services/api';

function calcularPrecio(startDate, startTime, pricePerHour, endDate, endTime) {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
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

const Historial = () => {
    const [historial, setHistorial] = useState([]);
    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [filtroEspacio, setFiltroEspacio] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const res = await parkingSpacesApi.get('/employee-reservations', {
                    params: { employee_id: user.id }
                });
                setHistorial(res.data.filter(r => r.status === 'finalizada'));
            } catch {
                setHistorial([]);
            }
        };
        fetchHistorial();
    }, [user.id]);

    const historialFiltrado = historial.filter(reserva => {
        const coincidePlaca = filtroPlaca === '' || reserva.vehicle_plate.toLowerCase().includes(filtroPlaca.toLowerCase());
        const coincideEspacio = filtroEspacio === '' || (reserva.space?.name || '').toLowerCase().includes(filtroEspacio.toLowerCase());
        const dentroDeRango =
            (!fechaInicio || reserva.start_date >= fechaInicio) &&
            (!fechaFin || reserva.end_date <= fechaFin);
        return coincidePlaca && coincideEspacio && dentroDeRango;
    });

    return (
        <EmployeeSlideLayout activePage="/employee/historial">
            <EmployeeHeader />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de salidas</h2>
                <div className="mb-4 flex gap-4">
                    <input
                        type="text"
                        placeholder="Filtrar por placa"
                        value={filtroPlaca}
                        onChange={e => setFiltroPlaca(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por espacio"
                        value={filtroEspacio}
                        onChange={e => setFiltroEspacio(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={e => setFechaInicio(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={e => setFechaFin(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                </div>
                {historialFiltrado.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        No hay historial de salidas finalizadas.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {historialFiltrado.map(reserva => (
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
                                        Fecha de finalización: {reserva.end_date} {formatTimeAmPm(reserva.end_time)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Placa: {reserva.vehicle_plate} · {reserva.vehicle_type}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Descripción: {reserva.description}
                                    </div>
                                    <div className="text-sm text-gray-900 font-bold mt-2">
                                        Total pagado:{' '}
                                        {new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(
                                            calcularPrecio(
                                                reserva.start_date,
                                                reserva.start_time,
                                                reserva.space.price_per_hour,
                                                reserva.end_date,
                                                reserva.end_time
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </EmployeeSlideLayout>
    );
};

export default Historial;