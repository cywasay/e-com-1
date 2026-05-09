<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role'           => ['required', 'in:b2b_buyer,b2c_customer'],
            'phone'          => ['nullable', 'string', 'max:20'],
            'company_name'   => ['required_if:role,b2b_buyer', 'nullable', 'string', 'max:255'],
            'tax_id'         => ['required_if:role,b2b_buyer', 'nullable', 'string', 'max:255'],
        ];
    }
}
