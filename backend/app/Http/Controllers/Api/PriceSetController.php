<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceSet;
use App\Models\PriceSetItem;
use App\Models\PriceSetAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\User;
use App\Services\PricingService;

class PriceSetController extends Controller
{
    public function index()
    {
        $priceSets = PriceSet::withCount('items')->latest()->get();
        return response()->json(['success' => true, 'data' => $priceSets]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:global_sale,buyer_specific',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $priceSet = PriceSet::create(array_merge($request->all(), ['created_by' => $request->user()->id]));

        return response()->json(['success' => true, 'data' => $priceSet], 201);
    }

    public function show($id)
    {
        $priceSet = PriceSet::with(['items.product', 'assignments.user'])->find($id);
        if (!$priceSet) {
            return response()->json(['success' => false, 'message' => 'Price set not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $priceSet]);
    }

    public function update(Request $request, $id)
    {
        $priceSet = PriceSet::find($id);
        if (!$priceSet) return response()->json(['success' => false, 'message' => 'Not found'], 404);

        $priceSet->update($request->all());
        return response()->json(['success' => true, 'data' => $priceSet]);
    }

    public function addItem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'override_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $item = PriceSetItem::create(array_merge($request->all(), ['price_set_id' => $id]));
        return response()->json(['success' => true, 'data' => $item]);
    }

    public function removeItem($id, $itemId)
    {
        PriceSetItem::where('price_set_id', $id)->where('id', $itemId)->delete();
        return response()->json(['success' => true]);
    }

    public function assign(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required_if:scope,buyer_specific|nullable|exists:users,id',
            'scope' => 'required|in:all_b2b,buyer_specific',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $assignment = PriceSetAssignment::create(array_merge($request->all(), ['price_set_id' => $id]));
        return response()->json(['success' => true, 'data' => $assignment]);
    }

    public function unassign($id, $assignmentId)
    {
        PriceSetAssignment::where('price_set_id', $id)->where('id', $assignmentId)->delete();
        return response()->json(['success' => true]);
    }

    public function previewPrice(Request $request, PricingService $pricingService)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($request->product_id);
        $user = $request->user_id ? User::find($request->user_id) : null;

        $preview = $pricingService->resolvePriceDetailed($product, $user);

        return response()->json([
            'success' => true,
            'data' => $preview
        ]);
    }
}
