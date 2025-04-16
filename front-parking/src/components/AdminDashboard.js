import React from 'react';
import ParkingControlLogo from '../assets/images/ParkingControl.png'; // Asegúrate de que la ruta sea correcta

const AdminDashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <img
                        src={ParkingControlLogo}
                        alt="Parking Control Logo"
                        className="h-16 mx-auto"
                    />
                </div>
                <nav className="mt-6">
                    <ul>
                        <li className="mb-2">
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100"
                            >
                                <span className="material-icons-outlined mr-2">local_parking</span>
                                Espacios del parqueadero
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                <span className="material-icons-outlined mr-2">person</span>
                                Usuarios
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Espacios del parqueadero</h1>
                    <button className="btn btn-add">Añadir</button>
                </header>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full max-w-md px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Parking Spaces */}
                <div className="space-y-4">
                    {/* Zona 1 */}
                    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                        <div>
                            <p className="text-3xl font-bold text-green-600">29</p>
                            <p className="text-sm text-gray-600">Libres de 50</p>
                        </div>
                        <div className="flex-1 ml-4">
                            <h2 className="text-lg font-semibold text-gray-900">Zona 1</h2>
                            <p className="text-sm text-gray-600">
                                <span className="material-icons-outlined text-red-500 mr-1">place</span>
                                Tipo de espacio: Carros normales
                            </p>
                            <p className="text-sm text-gray-600">8 am a 12 pm</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">6,000 Pesos/hr</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                            <button className="btn btn-edit">Editar</button>
                            <button className="btn btn-disable">Desactivar</button>
                        </div>
                    </div>

                    {/* Zona 2 */}
                    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                        <div>
                            <p className="text-3xl font-bold text-green-600">10</p>
                            <p className="text-sm text-gray-600">Libres de 20</p>
                        </div>
                        <div className="flex-1 ml-4">
                            <h2 className="text-lg font-semibold text-gray-900">Zona 2</h2>
                            <p className="text-sm text-gray-600">
                                <span className="material-icons-outlined text-red-500 mr-1">place</span>
                                Tipo de espacio: Camiones
                            </p>
                            <p className="text-sm text-gray-600">8 am a 12 pm</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">16,000 Pesos/hr</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                            <button className="btn btn-edit">Editar</button>
                            <button className="btn btn-disable">Desactivar</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* User Dropdown */}
            <div className="absolute top-6 right-6">
                <div className="relative">
                    <button className="flex items-center space-x-2">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900">Administrador</span>
                        <span className="material-icons-outlined">expand_more</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Mi perfil
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Salir
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;