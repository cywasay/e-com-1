<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'buyer_type',
        'stripe_payment_intent',
        'total_amount',
        'shipping_address',
        'status',
        'tracking_number',
        'carrier',
        'notes',
    ];

    protected $casts = [
        'shipping_address' => 'json',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Relationship: User (Customer).
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Relationship: Order Items.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
