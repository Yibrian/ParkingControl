import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ClientHeader = ({ title }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: 'Usuario',
        email: 'email@example.com',
        userimg: 'profile_images/default-profile.png',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/profile');
                setCurrentUser(response.data);
            } catch (error) {
                // Silenciar error si no hay sesión
            }
        };
        fetchUser();
    }, []);

    const handleProfileClick = () => navigate('/client/profile');
    const handleLogoutClick = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            <div className="flex items-center space-x-4 w-full">
                <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full max-w-2xl px-6 py-3 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="relative">
                <button
                    className="flex items-center space-x-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <img
                        src={`http://localhost:8000/storage/${currentUser.userimg}`}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{currentUser.email || 'email@example.com'}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg">
                        <button
                            onClick={handleProfileClick}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Mi perfil
                        </button>
                        <button
                            onClick={handleLogoutClick}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Salir
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default ClientHeader;