<?php

namespace App\Http\Controllers;

use App\Models\CashTransaction;
use App\Models\Product;
use App\Models\Repair;
use App\Models\StockMovement;
use App\StockMovementType;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = Carbon::today();
        $weekStart = $today->copy()->subDays(6)->startOfDay();
        $weekMovements = StockMovement::query()
            ->whereBetween('created_at', [$weekStart, $today->copy()->endOfDay()])
            ->get(['type', 'quantity', 'created_at'])
            ->groupBy(fn (StockMovement $movement): string => $movement->created_at->toDateString());

        $weeklyMovement = collect(range(0, 6))->map(function (int $day) use ($weekStart, $weekMovements): array {
            $date = $weekStart->copy()->addDays($day);
            $movements = $weekMovements->get($date->toDateString(), collect());

            return [
                'label' => $date->isoFormat('ddd'),
                'entries' => $movements->where('type', StockMovementType::Entry)->sum('quantity'),
                'exits' => $movements->where('type', StockMovementType::Exit)->sum('quantity'),
            ];
        })->values();

        return Inertia::render('dashboard', [
            'metrics' => [
                'totalProducts' => Product::count(),
                'totalStock' => Product::sum('stock'),
                'lowStock' => Product::whereColumn('stock', '<=', 'minimum_stock')->count(),
                'entriesToday' => StockMovement::where('type', 'Entrada')->whereDate('created_at', $today)->sum('quantity'),
                'exitsToday' => StockMovement::where('type', 'Saída')->whereDate('created_at', $today)->sum('quantity'),
                'repairsToday' => Repair::whereDate('created_at', $today)->count(),
                'repairRevenueToday' => Repair::whereDate('created_at', $today)->sum('service_value'),
                'readyRepairs' => Repair::where('status', 'pronto')->count(),
                'cashBalance' => CashTransaction::query()->selectRaw("COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE -amount END), 0) as total")->value('total'),
            ],
            'recentMovements' => StockMovement::query()->with('product:id,name')->latest()->limit(4)->get(['id', 'product_id', 'type', 'quantity', 'reason', 'created_at']),
            'weeklyMovement' => $weeklyMovement,
        ]);
    }
}
