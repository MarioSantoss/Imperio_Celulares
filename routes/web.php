<?php

use App\Http\Controllers\CashTransactionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductIssueController;
use App\Http\Controllers\RepairController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('produtos', [ProductController::class, 'index'])->name('products.index');
    Route::get('produtos/cadastrar', [ProductController::class, 'create'])->name('products.create');
    Route::post('produtos', [ProductController::class, 'store'])->name('products.store');
    Route::get('produtos/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('produtos/{product}/editar', [ProductController::class, 'edit'])->name('products.edit');
    Route::patch('produtos/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('produtos/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('movimentacoes', [StockMovementController::class, 'index'])->name('movements.index');
    Route::post('movimentacoes', [StockMovementController::class, 'store'])->name('movements.store');
    Route::get('assistencias', [RepairController::class, 'index'])->name('repairs.index');
    Route::get('assistencias/cadastrar', [RepairController::class, 'create'])->name('repairs.create');
    Route::post('assistencias', [RepairController::class, 'store'])->name('repairs.store');
    Route::patch('assistencias/{repair}', [RepairController::class, 'update'])->name('repairs.update');
    Route::post('assistencias/{repair}/avisar', [RepairController::class, 'notify'])->name('repairs.notify');
    Route::get('assistencias/{repair}/recibo', [RepairController::class, 'receipt'])->name('repairs.receipt');
    Route::get('caixa', [CashTransactionController::class, 'index'])->name('cash.index');
    Route::post('caixa', [CashTransactionController::class, 'store'])->name('cash.store');
    Route::get('vendas', [SaleController::class, 'index'])->name('sales.index');
    Route::post('vendas', [SaleController::class, 'store'])->name('sales.store');
    Route::get('vendas/{sale}/recibo', [SaleController::class, 'show'])->name('sales.receipt');
    Route::get('ocorrencias-produtos', [ProductIssueController::class, 'index'])->name('product-issues.index');
    Route::post('ocorrencias-produtos', [ProductIssueController::class, 'store'])->name('product-issues.store');
    Route::patch('ocorrencias-produtos/{product_issue}', [ProductIssueController::class, 'update'])->name('product-issues.update');
    Route::get('relatorios', [ReportController::class, 'index'])->name('reports.index');
    Route::get('relatorios/exportar', [ReportController::class, 'export'])->name('reports.export');
});

require __DIR__.'/settings.php';
