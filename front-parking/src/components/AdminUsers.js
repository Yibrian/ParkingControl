import React, { useState, useEffect } from 'react';
import SlideLayout from './SlideLayout';
import Header from './Header';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal para añadir usuario
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal para editar usuario
    const [currentUser, setCurrentUser] = useState(null); // Usuario actual para editar
    const [newUser, setNewUser] = useState({
        name: '',
        last_name: '',
        email: '',
        identification: '',
        password: '',
        phone: '',
        rol: 'ADMINISTRADOR',
    });
    const [filterName, setFilterName] = useState('');
    const [filterRol, setFilterRol] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Error al cargar los usuarios.');
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/users', newUser);
            const createdUser = response.data.user;

            const updatedUser = { ...createdUser, active: true };
            setUsers([...users, updatedUser]);

            toast.success('Usuario creado exitosamente.');
            setIsAddModalOpen(false);

            setNewUser({
                name: '',
                last_name: '',
                email: '',
                identification: '',
                password: '',
                phone: '',
                rol: 'ADMINISTRADOR',
            });
        } catch (error) {
            if (error.response && error.response.data.error) {
                const errors = error.response.data.error;
                Object.values(errors).forEach((err) => toast.error(err[0]));
            } else {
                toast.error('Error al crear el usuario.');
            }
        }
    };

    // Validar que siempre haya al menos un administrador y uno activo
    const validateAdminCount = (usersList, userToUpdate = null, updatedFields = {}) => {
        // Simula el estado después de la edición/desactivación
        const simulatedUsers = usersList.map(u => {
            if (userToUpdate && u.id === userToUpdate.id) {
                return { ...u, ...updatedFields };
            }
            return u;
        });

        // Filtrar administradores
        const admins = simulatedUsers.filter(u => u.rol === 'ADMINISTRADOR');
        const activeAdmins = admins.filter(u => u.active);

        return {
            hasAdmin: admins.length > 0,
            hasActiveAdmin: activeAdmins.length > 0,
        };
    };

    // Al activar/desactivar usuarios
    const handleToggleActive = async (id) => {
        // Obtener el usuario actual desde localStorage
        const loggedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (loggedUser && loggedUser.id === id) {
            toast.error('No puedes desactivar tu propio usuario.');
            return;
        }

        // Simula el cambio de estado
        const userToToggle = users.find(u => u.id === id);
        const simulatedActive = !userToToggle.active;

        const { hasActiveAdmin } = validateAdminCount(
            users,
            userToToggle,
            { active: simulatedActive }
        );

        if (userToToggle.rol === 'ADMINISTRADOR' && !hasActiveAdmin) {
            toast.error('Debe haber al menos un ADMINISTRADOR activo.');
            return;
        }

        try {
            const response = await api.patch(`/users/${id}/toggle-active`);
            const updatedUsers = users.map((user) =>
                user.id === id ? { ...user, active: response.data.active } : user
            );
            setUsers(updatedUsers);
            toast.success('Estado del usuario actualizado.');
        } catch (error) {
            console.error('Error toggling user active state:', error);
            toast.error('Error al cambiar el estado del usuario.');
        }
    };

    const handleEditUser = (user) => {
        setCurrentUser(user); // Establecer el usuario actual para editar
        setIsEditModalOpen(true);
    };

    // Al guardar cambios de edición
    const handleSaveChanges = async (e) => {
        e.preventDefault();

        // Validar que quede al menos un administrador y uno activo
        const { hasAdmin, hasActiveAdmin } = validateAdminCount(
            users,
            currentUser,
            {
                rol: currentUser.rol,
                active: currentUser.active !== undefined ? currentUser.active : true,
            }
        );

        if (!hasAdmin) {
            toast.error('Debe existir al menos un usuario con rol ADMINISTRADOR.');
            return;
        }
        if (!hasActiveAdmin) {
            toast.error('Debe haber al menos un ADMINISTRADOR activo.');
            return;
        }

        try {
            const response = await api.put(`/users/${currentUser.id}`, currentUser);
            const updatedUsers = users.map((user) =>
                user.id === currentUser.id ? response.data.user : user
            );
            setUsers(updatedUsers);

            toast.success('Usuario actualizado correctamente.');
            setIsEditModalOpen(false);
            setCurrentUser(null);
        } catch (error) {
            if (error.response && error.response.data.error) {
                const errors = error.response.data.error;
                Object.values(errors).forEach((err) => toast.error(err[0]));
            } else {
                toast.error('Error al actualizar el usuario.');
            }
        }
    };

    return (
        <SlideLayout activePage="/admin/users">
            <Header title="Usuarios" />
            <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Usuarios</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn btn-add"
                    >
                        Añadir
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        value={filterName}
                        onChange={e => setFilterName(e.target.value)}
                        className="rounded-md border px-3 py-2 text-gray-900"
                    />
                    <select
                        value={filterRol}
                        onChange={e => setFilterRol(e.target.value)}
                        className="rounded-md border px-3 py-2 text-gray-900"
                    >
                        <option value="">Todos los roles</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                        <option value="EMPLEADO">Empleado</option>
                        <option value="CLIENTE">Cliente</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {users
                        .filter(user =>
                            (!filterName ||
                                `${user.name} ${user.last_name}`.toLowerCase().includes(filterName.toLowerCase())
                            ) &&
                            (!filterRol || user.rol === filterRol)
                        )
                        .map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg"
                            >
                                {/* Información del usuario */}
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.name} {user.last_name}
                                    </p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-600">{user.phone}</p>
                                </div>

                                {/* Contenedor de estado, rol y botones */}
                                <div className="flex items-center space-x-6">
                                    {/* Indicador de estado */}
                                    <div className="flex flex-col items-center w-16">
                                        <span
                                            className={`h-4 w-4 rounded-full ${
                                                user.active ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                            title={user.active ? 'Activo' : 'Desactivado'}
                                        ></span>
                                    </div>

                                    {/* Rol del usuario */}
                                    <div className="flex flex-col items-center w-32">
                                        <span
                                            className={`px-2 py-1 text-sm rounded-full ${
                                                user.rol === 'ADMINISTRADOR'
                                                    ? 'bg-orange-100 text-orange-600'
                                                    : user.rol === 'CLIENTE'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-blue-100 text-blue-600'
                                            }`}
                                        >
                                            {user.rol}
                                        </span>
                                    </div>

                                    {/* Botón de activar/desactivar */}
                                    <div className="flex flex-col items-center w-24">
                                        <button
                                            onClick={() => handleToggleActive(user.id)}
                                            className={`btn ${
                                                user.active ? 'btn-disable' : 'btn-save'
                                            }`}
                                        >
                                            {user.active ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </div>

                                    {/* Botón de editar */}
                                    <div className="flex flex-col items-center w-24">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="btn btn-edit"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal para añadir usuario */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Añadir Usuario</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                    Nombres
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, name: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                                    Apellidos
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={newUser.last_name}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, last_name: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, email: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="identification" className="block text-sm font-medium text-gray-900">
                                    Identificación
                                </label>
                                <input
                                    id="identification"
                                    type="text"
                                    value={newUser.identification}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, identification: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={newUser.phone}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, phone: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="rol" className="block text-sm font-medium text-gray-900">
                                    Tipo de Usuario
                                </label>
                                <select
                                    id="rol"
                                    value={newUser.rol}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, rol: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                >
                                    <option value="ADMINISTRADOR">Administrador</option>
                                    <option value="EMPLEADO">Empleado</option>
                                    <option value="CLIENTE">Cliente</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, password: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para editar usuario */}
            {isEditModalOpen && currentUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                    Nombres
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={currentUser.name}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, name: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                                    Apellidos
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={currentUser.last_name}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, last_name: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={currentUser.email}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, email: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="identification" className="block text-sm font-medium text-gray-900">
                                    Identificación
                                </label>
                                <input
                                    id="identification"
                                    type="text"
                                    value={currentUser.identification}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, identification: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={currentUser.phone}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, phone: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="rol" className="block text-sm font-medium text-gray-900">
                                    Tipo de Usuario
                                </label>
                                <select
                                    id="rol"
                                    value={currentUser.rol}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, rol: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                    required
                                >
                                    <option value="ADMINISTRADOR">Administrador</option>
                                    <option value="EMPLEADO">Empleado</option>
                                    <option value="CLIENTE">Cliente</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Nueva Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={currentUser.password || ''}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, password: e.target.value })
                                    }
                                    className="block w-full rounded-md border px-3 py-2 text-gray-900"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SlideLayout>
    );
};

export default AdminUsers;