<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Mario',
                'email' => 'mario@imperiocelulares.com',
                'role' => 'proprietario',
                'password' => 'Mario@123456',
            ],
            [
                'name' => 'Cristina',
                'email' => 'cristina@imperiocelulares.com',
                'role' => 'gerente',
                'password' => 'Cristina@123456',
            ],
            [
                'name' => 'Ladyla',
                'email' => 'ladyla@imperiocelulares.com',
                'role' => 'atendente',
                'password' => 'Ladyla@123456',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user,
            );
        }

        $products = Product::factory(8)->create();

        $products->each(function (Product $product): void {
            StockMovement::factory()->create([
                'product_id' => $product->id,
                'type' => 'Entrada',
                'quantity' => $product->stock,
            ]);
        });
    }
}
