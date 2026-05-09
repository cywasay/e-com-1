<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B2bApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'business_type',
        'est_order_volume',
        'tax_id',
        'status',
        'admin_notes',
    ];

    /**
     * Relationship: User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
