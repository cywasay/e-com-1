<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceSetItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'price_set_id',
        'product_id',
        'quantity_set_id',
        'override_price',
    ];

    protected $casts = [
        'override_price' => 'decimal:2',
    ];

    public function priceSet()
    {
        return $this->belongsTo(PriceSet::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function quantitySet()
    {
        return $this->belongsTo(QuantitySet::class);
    }
}
