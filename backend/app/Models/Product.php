<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
        'price',
        'base_retail_price',
        'base_wholesale_price',
        'moq',
        'visibility',
        'weight_grams',
        'status',
        'is_featured',
        'is_bestseller',
        'is_eco_friendly',
        'is_new_arrival',
        'base_cost',
        'compare_at_price',
        'charge_tax',
        'margin_percentage',
        'tax_percentage',
        'handling_fee',
        'sku',
        'barcode',
        'stock_qty',
        'track_inventory',
        'continue_selling_when_out_of_stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_eco_friendly' => 'boolean',
        'is_new_arrival' => 'boolean',
        'charge_tax' => 'boolean',
        'base_cost' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'margin_percentage' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
        'handling_fee' => 'decimal:2',
        'moq' => 'integer',
        'stock_qty' => 'integer',
        'track_inventory' => 'boolean',
        'continue_selling_when_out_of_stock' => 'boolean',
    ];

    /**
     * Bootstrap the model and its traits.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name')) {
                $product->slug = static::generateUniqueSlug($product->name, $product->id);
            }
        });
    }

    /**
     * Generate a unique slug for the product.
     */
    protected static function generateUniqueSlug($name, $ignoreId = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->when($ignoreId, function ($query) use ($ignoreId) {
            return $query->where('id', '!=', $ignoreId);
        })->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    /**
     * Relationship: Category.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relationship: Sites this product is assigned to.
     */
    public function sites()
    {
        return $this->belongsToMany(Site::class, 'site_product')->withTimestamps();
    }

    /**
     * Relationship: Variants.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Relationship: Images.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Relationship: Quantity Sets.
     */
    public function quantitySets()
    {
        return $this->hasMany(QuantitySet::class);
    }

    /**
     * Relationship: Inventory Logs.
     */
    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    /**
     * Relationship: Cart Items.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
