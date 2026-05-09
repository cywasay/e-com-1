<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SiteController extends Controller
{
    /**
     * Display a listing of sites.
     */
    public function index()
    {
        $sites = Site::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $sites,
            'message' => 'Sites retrieved successfully.'
        ]);
    }

    /**
     * Store a newly created site.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:sites,domain',
            'slug' => 'nullable|string|max:255|unique:sites,slug',
            'logo_url' => 'nullable|url|max:500',
            'primary_color' => 'nullable|string|size:7|regex:/^#([A-Fa-f0-9]{6})$/',
            'secondary_color' => 'nullable|string|size:7|regex:/^#([A-Fa-f0-9]{6})$/',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $site = Site::create($data);

        return response()->json([
            'success' => true,
            'data' => $site,
            'message' => 'Site created successfully.'
        ], 201);
    }

    /**
     * Update the specified site.
     */
    public function update(Request $request, $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Site not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255|unique:sites,domain,' . $id,
            'slug' => 'nullable|string|max:255|unique:sites,slug,' . $id,
            'logo_url' => 'nullable|url|max:500',
            'primary_color' => 'nullable|string|size:7|regex:/^#([A-Fa-f0-9]{6})$/',
            'secondary_color' => 'nullable|string|size:7|regex:/^#([A-Fa-f0-9]{6})$/',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $site->update($data);

        return response()->json([
            'success' => true,
            'data' => $site,
            'message' => 'Site updated successfully.'
        ]);
    }

    /**
     * Remove the specified site.
     */
    public function destroy($id)
    {
        $site = Site::withCount('products')->find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Site not found.'
            ], 404);
        }

        if ($site->products_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete site with assigned products.'
            ], 422);
        }

        $site->delete();

        return response()->json([
            'success' => true,
            'message' => 'Site deleted successfully.'
        ]);
    }

    /**
     * Assign products to a site.
     */
    public function assignProducts(Request $request, $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Site not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $site->products()->syncWithoutDetaching($request->product_ids);

        return response()->json([
            'success' => true,
            'message' => 'Products assigned successfully.'
        ]);
    }

    /**
     * Remove a product from a site.
     */
    public function removeProduct($id, $productId)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Site not found.'
            ], 404);
        }

        $site->products()->detach($productId);

        return response()->json([
            'success' => true,
            'message' => 'Product removed from site successfully.'
        ]);
    }

    /**
     * Assign categories to a site.
     */
    public function assignCategories(Request $request, $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Site not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $site->categories()->syncWithoutDetaching($request->category_ids);

        return response()->json([
            'success' => true,
            'message' => 'Categories assigned successfully.'
        ]);
    }
}
