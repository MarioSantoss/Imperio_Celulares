<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\CashTransaction;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Sale::class);

        return Inertia::render('sales/index', [
            'products' => Product::query()->orderBy('name')->get(['id', 'name', 'sale_price', 'stock']),
            'sales' => Sale::query()->with(['customer:id,name,phone', 'items.product:id,name'])->latest('sold_at')->paginate(10),
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
    public function store(StoreSaleRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $data = $request->validated();
            $product = Product::query()->whereKey($data['product_id'])->lockForUpdate()->firstOrFail();
            $quantity = (int) $data['quantity'];

            if ($quantity > $product->stock) {
                throw ValidationException::withMessages(['quantity' => 'A quantidade excede o estoque disponível.']);
            }

            $customer = null;
            if (($data['customer_phone'] ?? '') !== '') {
                $customer = Customer::query()->updateOrCreate(
                    ['phone' => $data['customer_phone']],
                    ['name' => $data['customer_name'] ?? 'Cliente'],
                );
            }

            $total = (float) $product->sale_price * $quantity;
            $sale = Sale::create([
                'customer_id' => $customer?->id,
                'user_id' => $request->user()->id,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'sold_at' => $data['sold_at'] ?? now(),
            ]);
            $sale->items()->create(['product_id' => $product->id, 'quantity' => $quantity, 'unit_price' => $product->sale_price, 'subtotal' => $total]);
            $product->decrement('stock', $quantity);
            CashTransaction::create(['user_id' => $request->user()->id, 'type' => 'entrada', 'category' => 'Venda', 'amount' => $total, 'payment_method' => $data['payment_method'], 'description' => $product->name, 'occurred_at' => $data['sold_at'] ?? now()]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Venda registrada e estoque atualizado.']);

        return to_route('sales.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale): Response
    {
        Gate::authorize('view', $sale);

        return Inertia::render('sales/receipt', ['sale' => $sale->load(['customer', 'items.product'])]);
    }
}
