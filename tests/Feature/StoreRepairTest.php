<?php

use App\Models\CashTransaction;
use App\Models\Repair;
use App\Models\User;

it('allows attendants to register a repair with customer history', function () {
    $user = User::factory()->create(['role' => 'atendente']);

    $response = $this->actingAs($user)->post(route('repairs.store'), [
        'customer_name' => 'Maria Silva',
        'customer_phone' => '11999998888',
        'device_model' => 'iPhone 13',
        'service_type' => 'Troca de tela',
        'service_value' => '350.00',
        'notification_channel' => 'whatsapp',
    ]);

    $response->assertRedirect(route('repairs.index'));
    $this->assertDatabaseHas('customers', ['name' => 'Maria Silva', 'phone' => '11999998888']);
    $this->assertDatabaseHas('repairs', ['device_model' => 'iPhone 13', 'status' => 'recebido']);
    expect(Repair::query()->first()->warranty_until->isFuture())->toBeTrue();
});

it('allows managers to record cash but blocks attendants from viewing it', function () {
    $manager = User::factory()->create(['role' => 'gerente']);

    $response = $this->actingAs($manager)->post(route('cash.store'), [
        'type' => 'entrada',
        'category' => 'Assistência técnica',
        'amount' => '350.00',
        'payment_method' => 'pix',
        'occurred_at' => now()->toDateTimeString(),
    ]);

    $response->assertRedirect(route('cash.index'));
    expect(CashTransaction::query()->count())->toBe(1);

    $this->actingAs(User::factory()->create(['role' => 'atendente']))
        ->get(route('cash.index'))
        ->assertForbidden();
});

it('lets managers update the repair status', function () {
    $manager = User::factory()->create(['role' => 'gerente']);
    $repair = Repair::factory()->create(['status' => 'recebido']);

    $this->actingAs($manager)->patch(route('repairs.update', $repair), [
        'status' => 'pronto',
        'notification_channel' => 'ligacao',
    ])->assertRedirect(route('repairs.index'));

    expect($repair->fresh()->status)->toBe('pronto');
});
