<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceSetAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'price_set_id',
        'user_id',
        'scope',
    ];

    public function priceSet()
    {
        return $this->belongsTo(PriceSet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
