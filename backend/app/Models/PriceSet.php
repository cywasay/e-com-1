<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'starts_at',
        'ends_at',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Relationship: Items in this price set.
     */
    public function items()
    {
        return $this->hasMany(PriceSetItem::class);
    }

    /**
     * Relationship: Assignments for this price set.
     */
    public function assignments()
    {
        return $this->hasMany(PriceSetAssignment::class);
    }

    /**
     * Relationship: Creator.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope: Active price sets within date range.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            });
    }
}
