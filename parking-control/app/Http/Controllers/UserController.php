<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /**
     * Actualizar el perfil del usuario autenticado.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        // Validar los datos enviados
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:100|min:2',
            'last_name' => 'nullable|string|max:100|min:2',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'identification' => 'nullable|string|unique:users,identification,' . $user->id, // Validar identificación
            'phone' => 'nullable|string|max:15',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Actualizar solo los campos enviados en la solicitud
        $user->fill($request->only(['name', 'last_name', 'email', 'identification', 'phone']));

        // Actualizar la contraseña si se proporciona
        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        // Guardar los cambios en la base de datos
        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'user' => $user,
        ], Response::HTTP_OK);
    }

    /**
     * Cambiar el estado de un usuario (activar/desactivar).
     */
    public function toggleActive($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], 404);
        }

        $user->active = !$user->active;
        $user->save();

        return response()->json(['message' => 'Estado del usuario actualizado.', 'active' => $user->active], 200);
    }

    /**
     * Crear un nuevo usuario.
     */
    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|min:2',
            'last_name' => 'required|string|max:100|min:2',
            'email' => 'required|email|unique:users,email',
            'identification' => 'required|string|unique:users,identification|max:20', // Validar identificación
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:15',
            'rol' => 'required|in:ADMINISTRADOR,EMPLEADO,CLIENTE',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'identification' => $request->input('identification'), // Guardar identificación
            'password' => Hash::make($request->input('password')),
            'phone' => $request->input('phone'),
            'rol' => $request->input('rol'),
        ]);

        return response()->json(['message' => 'Usuario creado exitosamente.', 'user' => $user], Response::HTTP_CREATED);
    }

    /**
     * Obtener el perfil del usuario autenticado.
     */
    public function getProfile()
    {
        $user = auth()->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'identification' => $user->identification, // Incluir identificación
            'phone' => $user->phone,
            'userimg' => $user->userimg,
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar la foto de perfil del usuario autenticado.
     */
    public function updateProfilePicture(Request $request)
    {
        $user = auth()->user();

        // Validar que el archivo sea una imagen y no exceda 1MB
        $validator = Validator::make($request->all(), [
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:1024', // Máximo 1MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Obtener el archivo de la solicitud
        $file = $request->file('profile_picture');

        // Verificar si el usuario ya tiene una imagen personalizada
        if ($user->userimg !== 'profile_images/default-profile.png') {
            $existingImagePath = public_path('storage/' . $user->userimg);

            // Si existe una imagen anterior, eliminarla
            if (file_exists($existingImagePath)) {
                unlink($existingImagePath);
            }
        }

        // Generar un nuevo nombre único para la imagen
        $newFileName = uniqid() . '.' . $file->getClientOriginalExtension();

        // Mover la nueva imagen al directorio de almacenamiento
        $file->move(public_path('storage/profile_images'), $newFileName);

        // Actualizar la ruta de la imagen en la base de datos
        $user->userimg = 'profile_images/' . $newFileName;
        $user->save();

        return response()->json([
            'message' => 'Foto de perfil actualizada correctamente.',
            'userimg' => $user->userimg,
        ], Response::HTTP_OK);
    }

    /**
     * Eliminar la foto de perfil del usuario autenticado.
     */
    public function deleteProfilePicture()
    {
        $user = auth()->user();

        // Solo eliminar si no es la imagen por defecto
        if ($user->userimg !== 'profile_images/default-profile.png') {
            $existingImagePath = public_path('storage/' . $user->userimg);

            if (file_exists($existingImagePath)) {
                unlink($existingImagePath);
            }

            // Poner la imagen por defecto
            $user->userimg = 'profile_images/default-profile.png';
            $user->save();
        }

        return response()->json([
            'message' => 'Foto de perfil eliminada y reemplazada por la imagen por defecto.',
            'userimg' => $user->userimg,
        ], 200);
    }

    /**
     * Obtener todos los usuarios.
     */
    public function getUsers()
    {
        $users = User::all(['id', 'name', 'last_name', 'email', 'identification', 'phone', 'rol', 'active']); // Incluir identificación
        return response()->json($users, Response::HTTP_OK);
    }

    /**
     * Obtener un usuario por su correo electrónico.
     */
    public function getUserByEmail($email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($user, Response::HTTP_OK);
    }

    /**
     * Actualizar un usuario.
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], Response::HTTP_NOT_FOUND);
        }

        // Validar los datos enviados
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:100|min:2',
            'last_name' => 'nullable|string|max:100|min:2',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'identification' => 'nullable|string|unique:users,identification,' . $user->id,
            'phone' => 'nullable|string|max:15',
            'rol' => 'nullable|in:ADMINISTRADOR,EMPLEADO,CLIENTE',
            'password' => 'nullable|string|min:8', // Validar contraseña
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Actualizar solo los campos enviados en la solicitud
        $user->fill($request->only(['name', 'last_name', 'email', 'identification', 'phone', 'rol']));

        // Actualizar la contraseña si se proporciona
        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        // Guardar los cambios en la base de datos
        $user->save();

        return response()->json(['message' => 'Usuario actualizado correctamente.', 'user' => $user], Response::HTTP_OK);
    }
}