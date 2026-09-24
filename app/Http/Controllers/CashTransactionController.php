<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCashTransactionRequest;
use App\Models\CashTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CashTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', CashTransaction::class);

        return Inertia::render('cash/index', [
            'transactions' => CashTransaction::query()->latest('occurred_at')->paginate(10),
            'balance' => CashTransaction::query()->selectRaw("COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE -amount END), 0) as total")->value('total'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCashTransactionRequest $request): RedirectResponse
    {
        CashTransaction::create([...$request->validated(), 'user_id' => $request->user()->id]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lançamento de caixa registrado.']);

        return to_route('cash.index');
    }
}
