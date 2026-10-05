<?php

namespace App\Http\Controllers;

use App\Models\CashTransaction;
use App\Models\ProductIssue;
use App\Models\Repair;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(in_array($request->user()?->role, ['proprietario', 'gerente'], true), 403);
        $from = $request->date('from')?->startOfDay() ?? now()->startOfMonth();
        $to = $request->date('to')?->endOfDay() ?? now()->endOfDay();

        return Inertia::render('reports/index', [
            'filters' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'summary' => [
                'sales' => Sale::whereBetween('sold_at', [$from, $to])->count(),
                'salesTotal' => Sale::whereBetween('sold_at', [$from, $to])->sum('total'),
                'repairs' => Repair::whereBetween('created_at', [$from, $to])->count(),
                'repairsTotal' => Repair::whereBetween('created_at', [$from, $to])->sum('service_value'),
                'cashBalance' => CashTransaction::whereBetween('occurred_at', [$from, $to])->selectRaw("COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE -amount END), 0) as total")->value('total'),
                'issues' => ProductIssue::whereBetween('created_at', [$from, $to])->count(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        abort_unless(in_array($request->user()?->role, ['proprietario', 'gerente'], true), 403);
        $from = $request->date('from')?->startOfDay() ?? now()->startOfMonth();
        $to = $request->date('to')?->endOfDay() ?? now()->endOfDay();
        $sales = Sale::with('items.product')->whereBetween('sold_at', [$from, $to])->latest('sold_at')->get();

        return response()->streamDownload(function () use ($sales): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Venda', 'Data', 'Produto', 'Quantidade', 'Total', 'Pagamento']);
            foreach ($sales as $sale) {
                foreach ($sale->items as $item) {
                    fputcsv($handle, [$sale->id, $sale->sold_at->format('d/m/Y H:i'), $item->product->name, $item->quantity, $sale->total, $sale->payment_method]);
                }
            }
            fclose($handle);
        }, 'relatorio-vendas.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
