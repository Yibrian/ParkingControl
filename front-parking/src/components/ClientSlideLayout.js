import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingControlLogo from '../assets/images/ParkingControl.png';

const ClientSlideLayout = ({ children, activePage }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: 'Espacios del parqueadero',
            icon: (
                // Mismo SVG que admin
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="mr-2"
                >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm8-136H104a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V152h24a36,36,0,0,0,0-72Zm0,56H112V96h24a20,20,0,0,1,0,40Z"></path>
                </svg>
            ),
            route: '/client',
            activeColor: 'text-red-600',
            inactiveColor: 'text-gray-600',
        },
        {
            name: 'Reservas',
            icon: (
                // SVG de calendario
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            route: '/client/reservas',
            activeColor: 'text-red-600',
            inactiveColor: 'text-gray-600',
        },
        {
            name: 'Notificaciones',
            icon: (
                // SVG de campana
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            route: '/client/notificaciones',
            activeColor: 'text-red-600',
            inactiveColor: 'text-gray-600',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <img
                        src={ParkingControlLogo}
                        alt="Parking Control Logo"
                        className="h-30 mx-auto"
                    />
                </div>
                <nav className="mt-6">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.name} className="mb-2">
                                <button
                                    onClick={() => navigate(item.route)}
                                    className={`flex items-center px-4 py-2 text-sm font-medium ${
                                        activePage === item.route
                                            ? `${item.activeColor} bg-gray-100`
                                            : `${item.inactiveColor} hover:bg-gray-100`
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col">{children}</main>
        </div>
    );
};

export default ClientSlideLayout;