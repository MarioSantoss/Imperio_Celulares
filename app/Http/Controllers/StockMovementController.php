<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockMovementRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\StockMovementType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Product::class);

        return Inertia::render('movements', [
            'products' => Product::query()->orderBy('name')->get(['id', 'name', 'stock']),
            'movements' => StockMovement::query()->with('product:id,name')->latest()->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return $this->index();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockMovementRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $data = $request->validated();
            $product = Product::query()->whereKey($data['product_id'])->lockForUpdate()->firstOrFail();
            $quantity = (int) $data['quantity'];

            $type = StockMovementType::from($data['type']);

            if ($type === StockMovementType::Exit && $quantity > $product->stock) {
                throw ValidationException::withMessages([
                    'quantity' => 'A quantidade de saída não pode ser maior que o estoque disponível.',
                ]);
            }

            $product->increment('stock', $type === StockMovementType::Entry ? $quantity : -$quantity);

            StockMovement::create([
                ...$data,
                'user_id' => $request->user()->id,
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Movimentação registrada com sucesso.']);

        return to_route('movements.index');
    }
}
