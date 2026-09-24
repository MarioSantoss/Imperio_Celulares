<?php

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;

it('redirects guests from the product inventory', function () {
    $this->get(route('products.index'))
        ->assertRedirect(route('login'));
});

it('creates a product for an authorized manager', function () {
    $user = User::factory()->create(['role' => 'gerente']);

    $response = $this->actingAs($user)->post(route('products.store'), [
        'name' => 'iPhone 16 Pro',
        'brand' => 'Apple',
        'cost_price' => '5000.00',
        'sale_price' => '6999.90',
        'stock' => 4,
        'minimum_stock' => 1,
    ]);

    $response->assertRedirect(route('products.index'));
    $this->assertDatabaseHas('products', [
        'name' => 'iPhone 16 Pro',
        'stock' => 4,
    ]);
});

it('filters products by the search query', function () {
    $user = User::factory()->create(['role' => 'atendente']);
    Product::factory()->create(['name' => 'Galaxy S24 Ultra', 'brand' => 'Samsung']);
    Product::factory()->create(['name' => 'iPhone 15', 'brand' => 'Apple']);

    $response = $this->actingAs($user)->get(route('products.index', ['search' => 'Galaxy']));

    $response->assertOk()->assertInertia(fn ($page) => $page
        ->component('products/index')
        ->where('search', 'Galaxy')
        ->has('products.data', 1)
        ->where('products.data.0.name', 'Galaxy S24 Ultra'));
});

it('adds stock and records an entry movement', function () {
    $user = User::factory()->create(['role' => 'atendente']);
    $product = Product::factory()->create(['stock' => 3]);

    $response = $this->actingAs($user)->post(route('movements.store'), [
        'product_id' => $product->id,
        'type' => 'Entrada',
        'quantity' => 5,
        'reason' => 'Compra de fornecedor',
    ]);

    $response->assertRedirect(route('movements.index'));
    expect($product->fresh()->stock)->toBe(8);
    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $product->id,
        'type' => 'Entrada',
        'quantity' => 5,
    ]);
});

it('rejects an exit larger than the available stock', function () {
    $user = User::factory()->create(['role' => 'atendente']);
    $product = Product::factory()->create(['stock' => 2]);

    $response = $this->actingAs($user)->post(route('movements.store'), [
        'product_id' => $product->id,
        'type' => 'Saída',
        'quantity' => 3,
        'reason' => 'Venda balcão',
    ]);

    $response->assertSessionHasErrors('quantity');
    expect($product->fresh()->stock)->toBe(2);
    expect(StockMovement::query()->count())->toBe(0);
});

it('forbids attendants from creating products', function () {
    $user = User::factory()->create(['role' => 'atendente']);

    $this->actingAs($user)->get(route('products.create'))
        ->assertForbidden();
});
