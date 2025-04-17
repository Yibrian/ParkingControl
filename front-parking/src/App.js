import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import Profile from './components/Profile';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <>
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;