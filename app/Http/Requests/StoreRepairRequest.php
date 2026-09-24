<?php

namespace App\Http\Requests;

use App\Models\Repair;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRepairRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Repair::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'device_model' => ['required', 'string', 'max:255'],
            'device_identifier' => ['nullable', 'string', 'max:100'],
            'service_type' => ['required', 'string', 'max:255'],
            'part_model' => ['nullable', 'string', 'max:255'],
            'service_value' => ['required', 'numeric', 'min:0'],
            'notification_channel' => ['nullable', 'in:ligacao,whatsapp'],
            'estimated_completion_at' => ['nullable', 'date'],
            'warranty_until' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
