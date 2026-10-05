<?php

use App\Models\Product;
use App\Models\User;

it('registers a sale, decreases stock and creates a cash entry', function () {
    $user = User::factory()->create(['role' => 'atendente']);
    $product = Product::factory()->create(['stock' => 5, 'sale_price' => 100]);

    $this->actingAs($user)->post(route('sales.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
        'payment_method' => 'pix',
        'customer_name' => 'Ana',
        'customer_phone' => '11999990000',
    ])->assertRedirect(route('sales.index'));

    expect($product->fresh()->stock)->toBe(3);
    $this->assertDatabaseHas('sales', ['total' => 200.00]);
    $this->assertDatabaseHas('cash_transactions', ['category' => 'Venda', 'amount' => 200.00]);
});

it('rejects a sale above the available stock', function () {
    $user = User::factory()->create(['role' => 'atendente']);
    $product = Product::factory()->create(['stock' => 1]);

    $this->actingAs($user)->post(route('sales.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
        'payment_method' => 'dinheiro',
    ])->assertSessionHasErrors('quantity');
});

it('allows managers to export reports and blocks attendants', function () {
    $this->actingAs(User::factory()->create(['role' => 'gerente']))
        ->get(route('reports.export'))
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $this->actingAs(User::factory()->create(['role' => 'atendente']))
        ->get(route('reports.index'))
        ->assertForbidden();
});
