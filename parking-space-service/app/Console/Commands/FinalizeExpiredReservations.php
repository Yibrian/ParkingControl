<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use App\Models\Space;
use App\Models\Notification;
use Carbon\Carbon;

class FinalizeExpiredReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:finalize-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Finaliza reservas cuyo tiempo ha terminado';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        $expired = Reservation::where('status', 'confirmada')
            ->where(function ($q) use ($now) {
                $q->where('end_date', '<', $now->toDateString())
                  ->orWhere(function ($q2) use ($now) {
                      $q2->where('end_date', $now->toDateString())
                         ->where('end_time', '<=', $now->format('H:i:s'));
                  });
            })
            ->get();

        foreach ($expired as $reservation) {
            $reservation->status = 'finalizada';
            $reservation->save();

            // Liberar espacio
            $space = $reservation->space;
            if ($space) {
                $space->available_spaces = min($space->available_spaces + 1, $space->total_spaces);
                $space->save();
            }

            // Notificación
            Notification::create([
                'user_id' => $reservation->user_id,
                'title' => 'Reserva finalizada',
                'message' => 'Tu reserva para el espacio ' . ($space ? $space->name : '') .
                    ' ha finalizado el ' . date('d/m/Y', strtotime($reservation->end_date)) .
                    ' a las ' . date('h:i A', strtotime($reservation->end_time)) . '.',
            ]);
        }

        $this->info('Reservas finalizadas: ' . $expired->count());
    }
}
