<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    // Public: Get all active catalogs
    public function indexPublic()
    {
        $catalogs = Catalog::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $catalogs
        ]);
    }

    // Admin: Get all catalogs
    public function indexAdmin()
    {
        $catalogs = Catalog::orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $catalogs
        ]);
    }

    // Admin: Create catalog
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'file_url' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $catalog = Catalog::create($validated);

        return response()->json([
            'success' => true,
            'data' => $catalog
        ], 201);
    }

    // Admin: Update catalog
    public function update(Request $request, $id)
    {
        $catalog = Catalog::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'file_url' => 'sometimes|required|string',
            'is_active' => 'boolean',
        ]);

        $catalog->update($validated);

        return response()->json([
            'success' => true,
            'data' => $catalog
        ]);
    }

    // Admin: Delete catalog
    public function destroy($id)
    {
        $catalog = Catalog::findOrFail($id);
        $catalog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catalog deleted successfully'
        ]);
    }
}
