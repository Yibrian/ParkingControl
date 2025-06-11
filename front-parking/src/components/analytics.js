import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../services/api';
import SlideLayout from './SlideLayout';
import Header from './Header';
import {
    PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6384', '#36A2EB', '#FFCE56'];

const Analytics = () => {
    // Usuarios
    const [usuariosTotal, setUsuariosTotal] = useState(0);
    const [usuariosPorRol, setUsuariosPorRol] = useState({ labels: [], values: [] });
    const [usuariosActivos, setUsuariosActivos] = useState({ labels: [], values: [] });
    const [usuariosNuevosMes, setUsuariosNuevosMes] = useState({ labels: [], values: [] });

    // Espacios
    const [espaciosTotal, setEspaciosTotal] = useState(0);
    const [espaciosActivos, setEspaciosActivos] = useState({ labels: [], values: [] });
    const [ocupacionHora, setOcupacionHora] = useState({ labels: [], values: [] });
    const [disponibilidadEspacios, setDisponibilidadEspacios] = useState({ labels: [], values: [] });

    // Reservas
    const [reservasTotal, setReservasTotal] = useState(0);
    const [reservasPorEstado, setReservasPorEstado] = useState({ labels: [], values: [] });
    const [reservasPorDia, setReservasPorDia] = useState({ labels: [], values: [] });
    const [reservasPorMes, setReservasPorMes] = useState({ labels: [], values: [] });
    const [reservasPorTipoVehiculo, setReservasPorTipoVehiculo] = useState({ labels: [], values: [] });

    // Ingresos
    const [ingresosTotal, setIngresosTotal] = useState(0);
    const [ingresosPorMes, setIngresosPorMes] = useState({ labels: [], values: [] });
    const [ingresosPorEspacio, setIngresosPorEspacio] = useState({ labels: [], values: [] });

    // Vehículos
    const [vehiculosTotal, setVehiculosTotal] = useState(0);
    const [vehiculosPorTipo, setVehiculosPorTipo] = useState({ labels: [], values: [] });

    useEffect(() => {
        // Usuarios
        analyticsApi.get('/usuarios/total').then(res => setUsuariosTotal(res.data.total));
        analyticsApi.get('/usuarios/por-rol').then(res => setUsuariosPorRol(res.data));
        analyticsApi.get('/usuarios/activos-inactivos').then(res => setUsuariosActivos(res.data));
        analyticsApi.get('/usuarios/nuevos-por-mes').then(res => setUsuariosNuevosMes(res.data));

        // Espacios
        analyticsApi.get('/espacios/total').then(res => setEspaciosTotal(res.data.total));
        analyticsApi.get('/espacios/activos-inactivos').then(res => setEspaciosActivos(res.data));
        analyticsApi.get('/espacios/ocupacion-por-hora').then(res => setOcupacionHora(res.data));
        analyticsApi.get('/espacios/disponibilidad').then(res => setDisponibilidadEspacios(res.data));

        // Reservas
        analyticsApi.get('/reservas/total').then(res => setReservasTotal(res.data.total));
        analyticsApi.get('/reservas/por-estado').then(res => setReservasPorEstado(res.data));
        analyticsApi.get('/reservas-por-dia').then(res => setReservasPorDia(res.data));
        analyticsApi.get('/reservas/por-mes').then(res => setReservasPorMes(res.data));
        analyticsApi.get('/reservas/por-tipo-vehiculo').then(res => setReservasPorTipoVehiculo(res.data));

        // Ingresos
        analyticsApi.get('/ingresos/total').then(res => setIngresosTotal(res.data.total));
        analyticsApi.get('/ingresos/por-mes').then(res => setIngresosPorMes(res.data));
        analyticsApi.get('/ingresos/por-espacio').then(res => setIngresosPorEspacio(res.data));

        // Vehículos
        analyticsApi.get('/vehiculos/total').then(res => setVehiculosTotal(res.data.total));
        analyticsApi.get('/vehiculos/por-tipo').then(res => setVehiculosPorTipo(res.data));
    }, []);

    // Utilidades para transformar datos
    const toPieData = (data) =>
        data.labels.map((label, i) => ({ name: label, Cantidad: data.values[i] }));

    const toBarData = (data, labelKey = 'name', valueKey = 'Cantidad') =>
        data.labels.map((label, i) => ({ [labelKey]: label, [valueKey]: data.values[i] }));

    const toLineData = (data, labelKey = 'name', valueKey = 'Cantidad') =>
        data.labels.map((label, i) => ({ [labelKey]: label, [valueKey]: data.values[i] }));

    return (
        <SlideLayout activePage="/admin/analytics">
            <Header title="Panel de Analíticas" />
            <div className="p-6">
                {/* Top stats */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-blue-600">{usuariosTotal}</span>
                        <span className="text-gray-500">Usuarios totales</span>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-green-600">{espaciosTotal}</span>
                        <span className="text-gray-500">Espacios totales</span>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-indigo-600">{reservasTotal}</span>
                        <span className="text-gray-500">Reservas totales</span>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-pink-600">
                            {Number(ingresosTotal).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-gray-500">Ingresos totales</span>
                    </div>
                </div>

                {/* Gráficos principales */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Usuarios por rol */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Usuarios por Rol</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={toPieData(usuariosPorRol)}
                                    dataKey="Cantidad"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {usuariosPorRol.labels.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Usuarios activos vs inactivos */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Usuarios Activos vs Inactivos</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={toPieData(usuariosActivos)}
                                    dataKey="Cantidad"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {usuariosActivos.labels.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Más gráficos */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Nuevos usuarios por mes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Nuevos Usuarios por Mes</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={toLineData(usuariosNuevosMes)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Cantidad" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Espacios activos vs inactivos */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Espacios Activos vs Inactivos</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={toPieData(espaciosActivos)}
                                    dataKey="Cantidad"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {espaciosActivos.labels.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Ocupación de espacios por hora */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Ocupación de Espacios por Hora</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={toLineData(ocupacionHora)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Cantidad" name="Cantidad" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Disponibilidad actual de espacios */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Disponibilidad Actual de Espacios</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={toBarData(disponibilidadEspacios)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Cantidad" name="Cantidad" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reservas */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Reservas por estado */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Reservas por Estado</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={toPieData(reservasPorEstado)}
                                    dataKey="Cantidad"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {reservasPorEstado.labels.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Reservas por tipo de vehículo */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Reservas por Tipo de Vehículo</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={toBarData(reservasPorTipoVehiculo)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Cantidad" name="Cantidad" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Reservas por día */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Reservas por Día</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={toLineData(reservasPorDia)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Cantidad" stroke="#FF8042" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Reservas por mes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Reservas por Mes</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={toBarData(reservasPorMes)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Cantidad" name="Cantidad" fill="#A020F0" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ingresos */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Ingresos por mes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Ingresos por Mes</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={toBarData(ingresosPorMes)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Cantidad" name="Cantidad" fill="#00C49F" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Ingresos por espacio */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Ingresos por Espacio</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={toBarData(ingresosPorEspacio)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Cantidad" name="Cantidad" fill="#FF6384" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vehículos */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Vehículos por tipo */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="font-semibold mb-4">Vehículos por Tipo</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={toPieData(vehiculosPorTipo)}
                                    dataKey="Cantidad"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {vehiculosPorTipo.labels.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Total vehículos */}
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        <span className="text-3xl font-bold text-blue-600">{vehiculosTotal}</span>
                        <span className="text-gray-500">Vehículos</span>
                    </div>
                </div>
            </div>
        </SlideLayout>
    );
};

export default Analytics;