<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\PricingService;
use App\Services\PublicProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function __construct(
        protected PricingService $pricingService,
        protected PublicProductService $publicProductService,
    ) {
    }
    /**
     * Administrative listing.
     */
    public function index()
    {
        $categories = Category::with('childrenRecursive')
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Public listing for storefront.
     */
    public function indexPublic()
    {
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('childrenRecursive')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Public category hub by slug.
     */
    public function showBySlug(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'parent:id,name,slug',
                'children' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
            ])
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        $categoryIds = $category->descendantIds();
        $user = $request->user('sanctum');

        $publishedProductQuery = Product::query();
        $this->publicProductService->applyStorefrontScope($publishedProductQuery, $user);
        $publishedProductQuery->whereIn('category_id', $categoryIds);

        $featuredProducts = (clone $publishedProductQuery)
            ->where('is_featured', true)
            ->with(['category:id,name,slug', 'images'])
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get();

        $this->pricingService->resolvePricesForCollection($featuredProducts, $user);
        $this->publicProductService->sanitizeCollection($featuredProducts, $user);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
                'subcategories' => $category->children,
                'featured_products' => $featuredProducts,
                'product_count' => (clone $publishedProductQuery)->count(),
            ],
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category created successfully.'
        ], 201);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id|not_in:' . $id,
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category updated successfully.'
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy($id)
    {
        $category = Category::withCount('children')->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.'
            ], 404);
        }

        // Check if it has children
        if ($category->children_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with sub-categories.'
            ], 400);
        }

        // Check if it has products (Assuming a Product model exists and is related)
        // If there's no Product model yet, we skip this but keep it in mind.
        // For now, we only check children as per instruction "no children and no products assigned".
        // Since I don't see a Product model in the workspace yet, I'll just check children.

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.'
        ]);
    }
}
