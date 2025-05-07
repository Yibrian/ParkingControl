<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'El campo correo es obligatorio.',
            'email.email' => 'El correo no tiene el formato correcto.',
            'password.required' => 'El campo contraseña es obligatorio.',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], Response::HTTP_BAD_REQUEST);
        }

        $credentials = $request->only(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Datos de acceso incorrectos. Por favor, verifica tus credenciales.'], Response::HTTP_UNAUTHORIZED);
        }

        $user = auth()->user();

        // Verificar si el usuario está activo
        if (!$user->active) {
            return response()->json(['error' => 'El usuario está desactivado.'], Response::HTTP_FORBIDDEN);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'identification' => $user->identification,
                'rol' => $user->rol,
                'userimg' => $user->userimg,
                'phone' => $user->phone,	
            ],
        ], Response::HTTP_OK);
    }

    public function unauthorized()
    {
        return redirect(route('login'));
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|min:2',
            'last_name' => 'required|string|max:100|min:2', // Validación para 'last_name'
            'email' => 'required|email|unique:users,email',
            'identification' => 'required|string|unique:users,identification|max:20', // Validar identificación
            'password' => 'required|string|max:255|min:8',
            'phone' => 'required|string|max:15', // Cambiado de 'celular' a 'phone'
        ], [
            'identification.required' => 'El campo identificación es obligatorio.',
            'identification.unique' => 'La identificación ya está registrada.',
            'identification.max' => 'La identificación no puede tener más de :max caracteres.',
            'name.required' => 'El campo nombre es obligatorio.',
            'last_name.required' => 'El campo apellido es obligatorio.', // Mensaje de error para 'last_name'
            'name.min' => 'El nombre debe tener al menos :min caracteres.',
            'last_name.min' => 'El apellido debe tener al menos :min caracteres.',
            'name.max' => 'El nombre no puede tener más de :max caracteres.',
            'last_name.max' => 'El apellido no puede tener más de :max caracteres.',
            'email.required' => 'El campo correo es obligatorio.',
            'email.unique' => 'El correo ya está registrado.',
            'email.email' => 'El correo no tiene el formato correcto.',
            'password.required' => 'El campo contraseña es obligatorio.',
            'password.min' => 'El campo contraseña debe tener mínimo :min caracteres.',
            'phone.required' => 'El campo teléfono es obligatorio.',
            'phone.max' => 'El número de teléfono no puede tener más de :max caracteres.',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], Response::HTTP_BAD_REQUEST);
        }

        $exists = User::where('email', htmlspecialchars($request->input('email')))->first();
        
        if (!$exists) {
            $newUser = User::create([
                'name' => htmlspecialchars($request->input('name')),
                'last_name' => htmlspecialchars($request->input('last_name')),
                'email' => htmlspecialchars($request->input('email')),
                'identification' => htmlspecialchars($request->input('identification')),
                'password' => Hash::make($request->input('password')),
                'rol' => 'CLIENTE',
                'phone' => htmlspecialchars($request->input('phone')),
                'userimg_url' => 'https://res.cloudinary.com/dhdvp5zp6/image/upload/v1745363194/default-profile_moiiy5.png', 
            ]);

            if (!$newUser) {
                return response()->json(['error' => 'No se logró crear'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            
            return response()->json($newUser, Response::HTTP_CREATED);
        } else {
            return response()->json(['error' => 'Ya existe un usuario con ese email'], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth()->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'identification' => $user->identification,
            'phone' => $user->phone,
            'rol' => $user->rol,
            'profile_image_url' => $user->profile_image_url,
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        try {
            $token = JWTAuth::getToken();
            
            if (!$token) {
                return response()->json(['error' => 'Token no encontrado'], Response::HTTP_BAD_REQUEST);
            }
            
            JWTAuth::invalidate($token);
            return response()->json(['message' => 'Sesión cerrada correctamente'], Response::HTTP_OK);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo cerrar la sesión'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            $token = JWTAuth::getToken();
            
            if (!$token) {
                return response()->json(['error' => 'Token no encontrado'], Response::HTTP_BAD_REQUEST);
            }
            
            $nuevo_token = auth()->refresh();
            JWTAuth::invalidate($token);
            
            return $this->respondWithToken($nuevo_token);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo cerrar la sesión'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ], Response::HTTP_OK);
    }   
}
