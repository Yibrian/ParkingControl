import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import Profile from './components/Profile';
import ClientDashboard from './components/ClientDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ClientProfile from './components/ClientProfile';
import ClientReservations from './components/ClientReservations';
import ClientNotifications from './components/ClientNotifications';
import EmployeeProfile from './components/EmployeeProfile';

function App() {
    return (
        <>
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
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
                    <Route
                        path="/employee"
                        element={
                            <PrivateRoute>
                                <EmployeeDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/client"
                        element={
                            <PrivateRoute>
                                <ClientDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/client/profile"
                        element={
                            <PrivateRoute>
                                <ClientProfile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/client/reservas"
                        element={
                            <PrivateRoute>
                                <ClientReservations />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/client/notificaciones"
                        element={
                            <PrivateRoute>
                                <ClientNotifications />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/employee/profile"
                        element={
                            <PrivateRoute>
                                <EmployeeProfile />
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