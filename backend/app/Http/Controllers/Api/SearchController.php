<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\PricingService;
use App\Services\PublicProductService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        protected PricingService $pricingService,
        protected PublicProductService $publicProductService,
    ) {
    }

    /**
     * Unified storefront search across products and categories.
     */
    public function __invoke(Request $request)
    {
        $query = trim((string) $request->input('q', ''));

        if (strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => [
                    'products' => [],
                    'categories' => [],
                ],
            ]);
        }

        $user = $request->user('sanctum');
        $productQuery = Product::query();
        $this->publicProductService->applyStorefrontScope($productQuery, $user);

        $products = $productQuery
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                    ->orWhere('sku', 'like', '%' . $query . '%');
            })
            ->with(['category:id,name,slug', 'images'])
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->limit(8)
            ->get();

        $this->pricingService->resolvePricesForCollection($products, $user);
        $this->publicProductService->sanitizeCollection($products, $user);

        $categories = Category::query()
            ->where('is_active', true)
            ->where('name', 'like', '%' . $query . '%')
            ->orderBy('sort_order')
            ->limit(6)
            ->get(['id', 'name', 'slug', 'parent_id']);

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products,
                'categories' => $categories,
            ],
        ]);
    }
}
