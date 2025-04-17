import React, { useState } from 'react';

const Header = ({ title, currentUser }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            {/* Left Section: Title and Search Bar */}
            <div className="flex items-center space-x-4 w-full">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full max-w-2xl px-6 py-3 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Right Section: User Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center space-x-2"
                    onClick={toggleDropdown}
                >
                    {/* Avatar */}
                    <img
                    src={currentUser?.profile_image_url || 'https://via.placeholder.com/40'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                    />
                    {/* User Info */}
                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email || 'email@example.com'}</p>
                    </div>
                    {/* Dropdown Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                        />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
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
                )}
            </div>
        </header>
    );
};

export default Header;