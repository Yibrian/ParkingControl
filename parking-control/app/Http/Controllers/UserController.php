<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /**
     * Actualizar el perfil del usuario autenticado.
     */
    public function updateProfile(Request $request)
{
    $user = auth()->user();

    $request->validate([
        'name' => 'required|string|max:100|min:2',
        'last_name' => 'required|string|max:100|min:2',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:15',
        'password' => 'nullable|string|min:8|confirmed',
    ]);

    $user->update([
        'name' => $request->input('name'),
        'last_name' => $request->input('last_name'),
        'email' => $request->input('email'),
        'phone' => $request->input('phone'),
        'password' => $request->input('password') ? Hash::make($request->input('password')) : $user->password,
    ]);

    return response()->json(['message' => 'Perfil actualizado correctamente.'], Response::HTTP_OK);
}

    /**
     * Cambiar el estado de un usuario (activar/desactivar).
     */
    public function toggleActive($id)
    {
        $admin = auth()->user();

        if (!$admin->isAdmin()) {
            return response()->json(['error' => 'No tienes permisos para realizar esta acción.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], 404);
        }

        $user->active = !$user->active; // Cambiar el estado
        $user->save();

        return response()->json(['message' => 'Estado del usuario actualizado.', 'active' => $user->active], 200);
    }

    /**
     * Actualizar la imagen de perfil del usuario autenticado.
     */
    public function updateProfileImage(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Subir la imagen
        $path = $request->file('profile_image')->store('profile_images', 'public');

        // Actualizar el usuario con la nueva ruta de la imagen
        $user->update(['profile_image' => $path]);

        return response()->json([
            'message' => 'Imagen de perfil actualizada exitosamente.',
            'profile_image_url' => $user->profile_image_url,
        ]);
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
            'phone' => $user->phone,
            'profile_image_url' => $user->profile_image_url,
        ], Response::HTTP_OK);
    }
}