<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProductsImport;

class ProductController extends Controller
{
    protected $pricingService;

    public function __construct(PricingService $pricingService)
    {
        $this->pricingService = $pricingService;
    }

    /**
     * Display a listing of products (paginated).
     */
    public function index(Request $request)
    {
        // Admin should see EVERYTHING including soft-deleted and incomplete products
        $query = Product::withTrashed()->with(['category:id,name', 'sites:id,name,domain', 'images']);

        // Only apply filters if explicitly requested
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Keep availability but ensure it's optional
        if ($request->has('availability') && $request->availability === 'in_stock') {
            $query->whereHas('variants', function($q) {
                $q->where('stock_qty', '>', 0);
            });
        }

        // Sorting
        $sort = $request->input('sort', 'featured');
        if ($sort === 'newest') {
            $query->latest();
        } elseif ($sort === 'price_low') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_high') {
            $query->orderBy('price', 'desc');
        } elseif ($sort === 'featured') {
            $query->orderBy('is_featured', 'desc')->latest();
        } else {
            $query->latest();
        }

        $products = $query->paginate(20);

        // Resolve prices
        $user = $request->user();
        foreach ($products as $product) {
            $product->resolved_price = $this->pricingService->resolvePrice($product, $user);
        }

        return response()->json([
            'success' => true,
            'data' => $products,
            'message' => 'Products retrieved successfully.'
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, $id)
    {
        $product = Product::with(['category', 'sites:id,name,domain', 'variants', 'images'])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $product->resolved_price = $this->pricingService->resolvePrice($product, $request->user());

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Product details retrieved successfully.'
        ]);
    }

    /**
     * Public index for storefront.
     */
    public function indexPublic(Request $request)
    {
        $query = Product::where('status', 'published')
            ->whereNotNull('name')
            ->where(function ($q) {
                $q->whereNotNull('base_retail_price')
                  ->orWhereNotNull('price');
            })
            ->with(['category:id,name', 'images']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Availability filter
        if ($request->has('availability') && $request->availability === 'in_stock') {
            $query->whereHas('variants', function($q) {
                $q->where('stock_qty', '>', 0);
            });
        }

        // Sorting
        $sort = $request->input('sort', 'featured');
        if ($sort === 'newest') {
            $query->latest();
        } elseif ($sort === 'price_low') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_high') {
            $query->orderBy('price', 'desc');
        } elseif ($sort === 'featured') {
            $query->orderBy('is_featured', 'desc')->latest();
        } else {
            $query->latest();
        }

        $products = $query->paginate(20);

        // Resolve prices
        $user = $request->user('sanctum');
        foreach ($products as $product) {
            $product->resolved_price = $this->pricingService->resolvePrice($product, $user);
        }

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Show product by slug.
     */
    public function showBySlug(Request $request, $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'published')
            ->with(['category', 'variants', 'images'])
            ->first();

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
        }

        $product->resolved_price = $this->pricingService->resolvePrice($product, $request->user('sanctum'));

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'base_retail_price' => 'nullable|numeric|min:0',
            'base_wholesale_price' => 'nullable|numeric|min:0',
            'moq' => 'nullable|integer|min:1',
            'visibility' => 'nullable|in:both,b2c_only,b2b_only',
            'weight_grams' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_eco_friendly' => 'boolean',
            'is_new_arrival' => 'boolean',
            'site_ids' => 'nullable|array',
            'site_ids.*' => 'exists:sites,id',
            'base_cost' => 'nullable|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'charge_tax' => 'boolean',
            'margin_percentage' => 'nullable|numeric|min:0',
            'tax_percentage' => 'nullable|numeric|min:0',
            'handling_fee' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:100',
            'barcode' => 'nullable|string|max:100',
            'stock_qty' => 'nullable|integer|min:0',
            'track_inventory' => 'boolean',
            'continue_selling_when_out_of_stock' => 'boolean',
        ]);

        if ($validator->fails()) {
            \Log::error('Product Validation Error:', [
                'errors' => $validator->errors()->toArray(),
                'data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if (empty($data['visibility'])) $data['visibility'] = 'both';
        if (!isset($data['base_retail_price']) && isset($data['price'])) {
            $data['base_retail_price'] = $data['price'];
        }

        $product = Product::create($data);

        if ($request->has('site_ids')) {
            $product->sites()->sync($request->site_ids);
        }

        return response()->json([
            'success' => true,
            'data' => $product->load(['sites', 'variants', 'images']),
            'message' => 'Product created successfully.'
        ], 201);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'base_retail_price' => 'nullable|numeric|min:0',
            'base_wholesale_price' => 'nullable|numeric|min:0',
            'moq' => 'nullable|integer|min:1',
            'visibility' => 'required|in:both,b2c_only,b2b_only',
            'weight_grams' => 'nullable|integer|min:0',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_eco_friendly' => 'boolean',
            'is_new_arrival' => 'boolean',
            'site_ids' => 'nullable|array',
            'site_ids.*' => 'exists:sites,id',
            'base_cost' => 'nullable|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'charge_tax' => 'boolean',
            'margin_percentage' => 'nullable|numeric|min:0',
            'tax_percentage' => 'nullable|numeric|min:0',
            'handling_fee' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:100',
            'barcode' => 'nullable|string|max:100',
            'stock_qty' => 'nullable|integer|min:0',
            'track_inventory' => 'boolean',
            'continue_selling_when_out_of_stock' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if (!isset($data['base_retail_price']) && isset($data['price'])) {
            $data['base_retail_price'] = $data['price'];
        }

        $product->update($data);

        if ($request->has('site_ids')) {
            $product->sites()->sync($request->site_ids);
        }

        return response()->json([
            'success' => true,
            'data' => $product->load(['sites', 'variants', 'images']),
            'message' => 'Product updated successfully.'
        ]);
    }

    /**
     * Remove the specified product (soft delete).
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.'
        ]);
    }

    /**
     * List all variants for a product.
     */
    public function listVariants($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product->variants,
            'message' => 'Variants retrieved successfully.'
        ]);
    }

    /**
     * Store a new variant.
     */
    public function storeVariant(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'sku' => 'nullable|string|max:100|unique:product_variants,sku',
            'barcode' => 'nullable|string|max:100',
            'options' => 'required|array',
            'price' => 'nullable|numeric|min:0',
            'base_cost' => 'nullable|numeric|min:0',
            'stock_qty' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $variant = $product->variants()->create($request->all());

        return response()->json([
            'success' => true,
            'data' => $variant,
            'message' => 'Variant created successfully.'
        ], 201);
    }

    /**
     * Update a variant.
     */
    public function updateVariant(Request $request, $id, $variantId)
    {
        $variant = ProductVariant::where('product_id', $id)->find($variantId);
        if (!$variant) {
            return response()->json(['success' => false, 'message' => 'Variant not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,' . $variantId,
            'barcode' => 'nullable|string|max:100',
            'options' => 'required|array',
            'price' => 'nullable|numeric|min:0',
            'base_cost' => 'nullable|numeric|min:0',
            'stock_qty' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $variant->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $variant,
            'message' => 'Variant updated successfully.'
        ]);
    }

    /**
     * Delete a variant.
     */
    public function destroyVariant($id, $variantId)
    {
        $variant = ProductVariant::where('product_id', $id)->find($variantId);
        if (!$variant) {
            return response()->json(['success' => false, 'message' => 'Variant not found.'], 404);
        }

        $variant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Variant deleted successfully.'
        ]);
    }

    /**
     * Store product images.
     */
    public function storeImages(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentImageCount = $product->images()->count();
        if ($currentImageCount + count($request->file('images')) > 10) {
            return response()->json([
                'success' => false,
                'message' => 'A product can have a maximum of 10 images.'
            ], 422);
        }

        $uploadedImages = [];
        $hasPrimary = $product->images()->where('is_primary', true)->exists();

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store("products/{$id}", 'public');
            
            $image = $product->images()->create([
                'url' => $path,
                'is_primary' => !$hasPrimary && $index === 0,
                'sort_order' => $currentImageCount + $index
            ]);

            if (!$hasPrimary && $index === 0) $hasPrimary = true;
            $uploadedImages[] = $image;
        }

        return response()->json([
            'success' => true,
            'data' => $uploadedImages,
            'message' => 'Images uploaded successfully.'
        ], 201);
    }

    /**
     * Set an image as primary.
     */
    public function setPrimaryImage($id, $imageId)
    {
        $image = ProductImage::where('product_id', $id)->find($imageId);
        if (!$image) {
            return response()->json(['success' => false, 'message' => 'Image not found.'], 404);
        }

        ProductImage::where('product_id', $id)->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Primary image set successfully.'
        ]);
    }

    /**
     * Delete an image.
     */
    public function destroyImage($id, $imageId)
    {
        $image = ProductImage::where('product_id', $id)->find($imageId);
        if (!$image) {
            return response()->json(['success' => false, 'message' => 'Image not found.'], 404);
        }

        $isPrimary = $image->is_primary;

        // Delete from storage
        Storage::disk('public')->delete($image->url);
        
        // Delete from DB
        $image->delete();

        // If primary was deleted, set next available as primary
        if ($isPrimary) {
            $nextImage = ProductImage::where('product_id', $id)->orderBy('sort_order')->first();
            if ($nextImage) {
                $nextImage->update(['is_primary' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully.'
        ]);
    }

    /**
     * Import products from CSV/XLSX.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx|max:5120',
        ]);

        $import = new ProductsImport;
        Excel::import($import, $request->file('file'));

        return response()->json([
            'success' => true,
            'data' => $import->getResults(),
            'message' => 'Import complete'
        ]);
    }

    /**
     * Download CSV template for product import.
     */
    public function downloadTemplate()
    {
        $headers = [
            'name',
            'description',
            'category_id',
            'price',
            'status',
            'is_featured',
            'is_bestseller',
            'is_eco_friendly',
            'is_new_arrival'
        ];

        $example = [
            'Example Product',
            'This is a description',
            '1',
            '99.99',
            'draft',
            '0',
            '0',
            '0',
            '0'
        ];

        $callback = function() use ($headers, $example) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);
            fputcsv($file, $example);
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=products_import_template.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ]);
    }

    /**
     * Delete products with missing critical data.
     */
    public function cleanup()
    {
        $deletedCount = Product::whereNull('name')
            ->orWhereNull('status')
            ->orWhere(function($q) {
                $q->whereNull('base_retail_price')
                  ->whereNull('price');
            })
            ->delete();

        return response()->json([
            'success' => true,
            'deleted_count' => $deletedCount,
            'message' => "Successfully deleted $deletedCount invalid products."
        ]);
    }
}
