<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductIssueRequest;
use App\Http\Requests\UpdateProductIssueRequest;
use App\Models\Product;
use App\Models\ProductIssue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProductIssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', ProductIssue::class);

        return Inertia::render('product-issues/index', ['products' => Product::query()->orderBy('name')->get(['id', 'name']), 'issues' => ProductIssue::query()->with('product:id,name')->latest()->paginate(10)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return $this->index();
    }

    public function update(UpdateProductIssueRequest $request, ProductIssue $productIssue): RedirectResponse
    {
        $productIssue->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status da ocorrência atualizado.']);

        return to_route('product-issues.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductIssueRequest $request): RedirectResponse
    {
        ProductIssue::create([...$request->validated(), 'user_id' => $request->user()->id]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ocorrência de produto registrada.']);

        return to_route('product-issues.index');
    }
}
