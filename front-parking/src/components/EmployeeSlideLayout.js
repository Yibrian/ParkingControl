import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingControlLogo from '../assets/images/ParkingControl.png';
import EmployeeHeader from './EmployeeHeader'; // Asegúrate de que la ruta sea correcta

const EmployeeSlideLayout = ({ children, activePage }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: 'Espacios del parqueadero',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="mr-2">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm8-136H104a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V152h24a36,36,0,0,0,0-72Zm0,56H112V96h24a20,20,0,0,1,0,40Z"></path>
                </svg>
            ),
            route: '/employee',
            activeColor: 'text-red-600',
            inactiveColor: 'text-gray-600',
        },
        {
            name: 'Salida de vehículos',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            route: '/employee/salida',
            activeColor: 'text-red-600',
            inactiveColor: 'text-gray-600',
        },
        {
            name: 'Historial',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            route: '/employee/historial',
            activeColor: 'text-red-600',
            inactiveColor: 'text-gray-600',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md fixed top-0 left-0 h-screen z-50">
                <div className="p-6">
                    <img src={ParkingControlLogo} alt="Parking Control Logo" className="h-30 mx-auto" />
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
                    <EmployeeHeader />
                </header>
                <main className="flex-1 flex flex-col pt-20 px-8 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default EmployeeSlideLayout;