<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ValidatePasswordResetToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->input('token');

        // Verificar si el token existe en la tabla password_resets
        $tokenData = DB::table('password_resets')->where('token', $token)->first();

        if (!$tokenData) {
            return response()->json(['error' => 'Token inválido o expirado.'], 400);
        }

        return $next($request);
    }
}
