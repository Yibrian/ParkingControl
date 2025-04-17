import React, { useState, useEffect } from 'react';
import Header from './Header';
import SlideLayout from './SlideLayout';
import api from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/profile');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchUsers();
        fetchCurrentUser();
    }, []);

    return (
        <SlideLayout activePage="/admin/users">
            <Header title="Usuarios" currentUser={currentUser} />
            <div className="px-6 py-4 space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg"
                    >
                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                {user.name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.phone}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`px-2 py-1 text-sm rounded-full ${
                                    user.rol === 'ADMINISTRADOR'
                                        ? 'bg-orange-100 text-orange-600'
                                        : 'bg-green-100 text-green-600'
                                }`}
                            >
                                {user.rol}
                            </span>
                            <button className="btn btn-disable">Desactivar</button>
                        </div>
                    </div>
                ))}
            </div>
        </SlideLayout>
    );
};

export default AdminUsers;