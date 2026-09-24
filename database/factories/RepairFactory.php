<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Repair;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Repair>
 */
class RepairFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'device_model' => fake()->randomElement(['iPhone 13', 'Galaxy A54', 'Moto G84']),
            'service_type' => fake()->randomElement(['Troca de tela', 'Troca de bateria', 'Conector de carga']),
            'service_value' => fake()->randomFloat(2, 80, 900),
            'status' => 'recebido',
            'warranty_until' => now()->addMonths(2),
        ];
    }
}
