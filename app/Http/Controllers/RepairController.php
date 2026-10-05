<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepairRequest;
use App\Http\Requests\UpdateRepairRequest;
use App\Models\Customer;
use App\Models\Repair;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RepairController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Repair::class);

        return Inertia::render('repairs/index', [
            'repairs' => Repair::query()->with('customer:id,name,phone')->latest()->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Repair::class);

        return Inertia::render('repairs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRepairRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $customer = Customer::query()->updateOrCreate(
            ['phone' => $data['customer_phone']],
            ['name' => $data['customer_name']],
        );

        Repair::create([
            ...$data,
            'customer_id' => $customer->id,
            'user_id' => $request->user()->id,
            'status' => 'recebido',
            'estimated_completion_at' => $data['estimated_completion_at'] ?? now()->addHour(),
            'warranty_until' => $data['warranty_until'] ?? now()->addMonths(2)->toDateString(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Assistência registrada com sucesso.']);

        return to_route('repairs.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRepairRequest $request, Repair $repair): RedirectResponse
    {
        $repair->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status da assistência atualizado.']);

        return to_route('repairs.index');
    }

    public function notify(Repair $repair): RedirectResponse
    {
        Gate::authorize('update', $repair);
        $repair->update(['notified_at' => now()]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Aviso registrado para este cliente.']);

        return to_route('repairs.index');
    }

    public function receipt(Repair $repair): Response
    {
        Gate::authorize('view', $repair);

        return Inertia::render('repairs/receipt', ['repair' => $repair->load('customer')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
