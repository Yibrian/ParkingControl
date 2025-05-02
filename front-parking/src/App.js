import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
    return (
        <>
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <PrivateRoute>
                                <AdminUsers />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;