<?php

namespace App\Models;

use Database\Factories\RepairFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['customer_id', 'user_id', 'device_model', 'device_identifier', 'service_type', 'part_model', 'service_value', 'status', 'notification_channel', 'notified_at', 'estimated_completion_at', 'warranty_until', 'notes'])]
class Repair extends Model
{
    /** @use HasFactory<RepairFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'service_value' => 'decimal:2',
            'estimated_completion_at' => 'datetime',
            'warranty_until' => 'date',
            'notified_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
