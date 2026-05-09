<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'slug',
        'logo_url',
        'primary_color',
        'secondary_color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relationship: Products assigned to this site.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'site_product')->withTimestamps();
    }

    /**
     * Relationship: Categories assigned to this site.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'site_category')->withTimestamps();
    }
}
