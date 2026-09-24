<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['iPhone 15 Pro', 'Galaxy S24 Ultra', 'Moto G73 5G', 'Redmi Note 12 Pro']),
            'brand' => fake()->randomElement(['Apple', 'Samsung', 'Motorola', 'Xiaomi']),
            'ram' => fake()->randomElement(['6 GB', '8 GB', '12 GB']),
            'storage' => fake()->randomElement(['128 GB', '256 GB', '512 GB']),
            'color' => fake()->safeColorName(),
            'imei' => fake()->unique()->numerify('###############'),
            'cost_price' => fake()->randomFloat(2, 500, 7000),
            'sale_price' => fake()->randomFloat(2, 800, 9000),
            'stock' => fake()->numberBetween(0, 30),
            'minimum_stock' => fake()->numberBetween(1, 5),
        ];
    }
}
