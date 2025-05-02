<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    $email = $request->input('email');

    // Verificar si el correo existe en la base de datos
    $userExists = DB::table('users')->where('email', $email)->exists();

    if (!$userExists) {
        return response()->json(['error' => 'El correo no existe en nuestra base de datos.'], 404);
    }

    $token = Str::random(64);

    // Guardar el token en la tabla password_resets
    DB::table('password_resets')->updateOrInsert(
        ['email' => $email],
        ['token' => $token, 'created_at' => now()]
    );

    // Enviar el correo con el enlace de restablecimiento
    Mail::send('emails.password-reset', ['token' => $token], function ($message) use ($email) {
        $message->to($email);
        $message->subject('Restablecimiento de contraseña');
    });

    return response()->json(['message' => 'Correo de restablecimiento enviado.'], 200);
}

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $tokenData = DB::table('password_resets')->where('token', $request->input('token'))->first();

        if (!$tokenData) {
            return response()->json(['error' => 'Token inválido o expirado.'], 400);
        }

        // Actualizar la contraseña del usuario
        $user = DB::table('users')->where('email', $tokenData->email)->first();
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], 404);
        }

        DB::table('users')->where('email', $tokenData->email)->update([
            'password' => Hash::make($request->input('password')),
        ]);

        // Eliminar el token usado
        DB::table('password_resets')->where('email', $tokenData->email)->delete();

        return response()->json(['message' => 'Contraseña actualizada correctamente.'], 200);
    }
}