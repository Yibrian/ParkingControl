import React, { useEffect, useState } from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';
import { parkingSpacesApi } from '../services/api';

const ClientNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await parkingSpacesApi.get('/notifications', {
                    params: { user_id: user.id }
                });
                setNotifications(res.data);
            } catch {
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, [user.id]);

    useEffect(() => {
        const markAllRead = async () => {
            try {
                await parkingSpacesApi.post('/notifications/mark-all-read', {
                    user_id: user.id
                });
            } catch {}
        };
        markAllRead();
    }, [user.id]);

    const handleDelete = async (id) => {
        try {
            await parkingSpacesApi.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch {
            // Puedes mostrar un toast si quieres
        }
    };

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
        const d = new Date(date);
        return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function getNotificationIcon(title) {
        if (title === 'Reserva confirmada') {
            
            return <span className="mr-2 text-green-600">✔️</span>;
        }
        if (title === 'Reserva cancelada') {
            
            return <span className="mr-2 text-red-600">❌</span>;
        }
        
        return <span className="mr-2 text-yellow-500">⚠️</span>;
    }

    return (
        <ClientSlideLayout activePage="/client/notificaciones">
            <ClientHeader />
            <div className="px-8 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notificaciones</h2>
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-gray-500">Aquí aparecerán tus notificaciones.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="bg-white rounded-lg shadow p-6 relative">
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                                    title="Eliminar notificación"
                                >
                                    ×
                                </button>
                                <div className="flex items-center mb-2">
                                    {getNotificationIcon(n.title)}
                                    <span className="font-bold">{n.title}</span>
                                </div>
                                <div className="text-gray-800 whitespace-pre-line">{n.message}</div>
                                {n.start_date && n.start_time && n.end_date && n.end_time && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Fecha de inicio: {formatDate(n.start_date)} {formatTime(n.start_time)}<br />
                                        Fecha de finalización: {formatDate(n.end_date)} {formatTime(n.end_time)}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ClientSlideLayout>
    );
};

export default ClientNotifications;