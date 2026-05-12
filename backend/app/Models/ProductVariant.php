<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'barcode',
        'options',
        'price',
        'stock_qty',
        'base_cost',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'stock_qty' => 'integer',
        'base_cost' => 'decimal:2',
    ];

    /**
     * Relationship: Product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
