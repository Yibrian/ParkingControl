<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::query();
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }
    
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user_id)
            ->where('read', false)
            ->count();

        return response()->json(['unread' => $count]);
    }

    public function markAllRead(Request $request)
    {
        \App\Models\Notification::where('user_id', $request->user_id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['error' => 'Notificación no encontrada.'], 404);
        }
        $notification->delete();
        return response()->json(['success' => true]);
    }
}