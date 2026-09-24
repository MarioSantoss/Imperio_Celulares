<?php

namespace Database\Factories;

use App\Models\CashTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CashTransaction>
 */
class CashTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'entrada',
            'category' => 'Serviço',
            'amount' => fake()->randomFloat(2, 20, 500),
            'payment_method' => 'pix',
            'description' => fake()->sentence(4),
            'occurred_at' => now(),
        ];
    }
}
