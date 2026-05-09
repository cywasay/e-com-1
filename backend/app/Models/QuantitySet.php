<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuantitySet extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'label',
        'quantity',
        'base_set_price',
        'is_active',
    ];

    protected $casts = [
        'base_set_price' => 'decimal:2',
        'is_active' => 'boolean',
        'quantity' => 'integer',
    ];

    /**
     * Relationship: Product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
