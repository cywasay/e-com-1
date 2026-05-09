<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CaseStudy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'client_name',
        'industry',
        'featured_image',
        'author_id',
        'status',
    ];

    /**
     * Relationship: Author (User).
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope: Published case studies only.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
