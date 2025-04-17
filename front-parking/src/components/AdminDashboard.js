import React, { useState, useEffect } from 'react';
import Header from './Header';
import SlideLayout from './SlideLayout';
import api from '../services/api';

const AdminDashboard = () => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/profile');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <SlideLayout activePage="/admin">
            <Header title="Espacios del parqueadero" currentUser={currentUser} />
            <div className="px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Zona 1</h2>
                {/* Add your content here */}
            </div>
        </SlideLayout>
    );
};

export default AdminDashboard;