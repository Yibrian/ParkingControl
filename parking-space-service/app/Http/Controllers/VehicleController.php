<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class VehicleController extends Controller
{
    // Listar vehículos de un usuario
    public function index(Request $request)
    {
        $userId = $request->input('user_id');
        if (!$userId) {
            return response()->json(['error' => 'user_id es requerido'], 400);
        }
        $vehicles = Vehicle::where('user_id', $userId)->get();
        return response()->json($vehicles, 200);
    }

    // Añadir vehículo
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'plate' => 'required|string|unique:vehicles,plate',
            'type' => 'required|string',
        ]);

        // Si es el primer vehículo, lo marcamos como default
        $isDefault = Vehicle::where('user_id', $validated['user_id'])->count() === 0;

        $vehicle = Vehicle::create([
            'user_id' => $validated['user_id'],
            'plate' => $validated['plate'],
            'type' => $validated['type'],
            'is_default' => $isDefault,
        ]);

        return response()->json($vehicle, 201);
    }

    // Editar vehículo
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'plate' => 'sometimes|string|unique:vehicles,plate,' . $vehicle->id,
            'type' => 'sometimes|string',
        ]);

        $vehicle->update($validated);

        return response()->json($vehicle, 200);
    }

    // Eliminar vehículo (borrado físico)
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete();
        return response()->json(['message' => 'Vehículo eliminado'], 200);
    }

    // Cambiar vehículo predeterminado
    public function setDefault(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $userId = $vehicle->user_id;

        // Desmarcar todos los vehículos del usuario
        Vehicle::where('user_id', $userId)->update(['is_default' => false]);
        // Marcar este como default
        $vehicle->is_default = true;
        $vehicle->save();

        return response()->json($vehicle, 200);
    }
}