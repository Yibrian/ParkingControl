import React from 'react';
import ClientSlideLayout from './ClientSlideLayout';
import ClientHeader from './ClientHeader';

const ClientNotifications = () => (
    <ClientSlideLayout activePage="/client/notificaciones">
        <ClientHeader />
        <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notificaciones</h2>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Aquí aparecerán tus notificaciones.</p>
            </div>
        </div>
    </ClientSlideLayout>
);

export default ClientNotifications;