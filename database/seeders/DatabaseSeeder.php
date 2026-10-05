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
        $users = collect([
            [
                'name' => 'Mario',
                'email' => 'mario@imperiocelulares.com',
                'role' => 'proprietario',
                'password' => env('SEED_OWNER_PASSWORD'),
            ],
            [
                'name' => 'Cristina',
                'email' => 'cristina@imperiocelulares.com',
                'role' => 'gerente',
                'password' => env('SEED_MANAGER_PASSWORD'),
            ],
            [
                'name' => 'Ladyla',
                'email' => 'ladyla@imperiocelulares.com',
                'role' => 'atendente',
                'password' => env('SEED_ATTENDANT_PASSWORD'),
            ],
        ])->filter(fn (array $user): bool => filled($user['password']))->all();

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
