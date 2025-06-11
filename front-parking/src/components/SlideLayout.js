import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingControlLogo from '../assets/images/ParkingControl.png';
import Header from './Header';

const SlideLayout = ({ children, activePage }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: 'Espacios del parqueadero',
            icon: (
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
            route: '/admin',
            activeColor: 'text-red-600', // Color rojo para la página activa
            inactiveColor: 'text-gray-600', // Color gris para la página inactiva
        },
        {
            name: 'Usuarios',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                </svg>
            ),
            route: '/admin/users',
            activeColor: 'text-red-600', 
            inactiveColor: 'text-gray-600', 
        },
        {
            name: 'Analíticas',
            icon: (
                // SVG de gráfico/estadísticas
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17v-6m4 6V7m-8 10v-2m16 2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z" />
                </svg>
            ),
            route: '/admin/analytics',
            activeColor: 'text-blue-600',
            inactiveColor: 'text-gray-600',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md fixed top-0 left-0 h-screen z-50">
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
            <div className="flex-1 flex flex-col ml-64">
                <header className="fixed top-0 left-64 right-0 z-40 bg-white shadow-md">
                    <Header />
                </header>
                <main className="flex-1 flex flex-col pt-20 px-8 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default SlideLayout;