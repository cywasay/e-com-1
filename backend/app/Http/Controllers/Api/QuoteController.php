<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Services\PricingService;
use App\Services\PublicProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class QuoteController extends Controller
{
    public function __construct(
        protected PricingService $pricingService,
        protected PublicProductService $publicProductService,
    ) {
    }

    /**
     * Submit a new quote request (Public).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|max:255',
            'phone'            => 'required|string|max:20',
            'company_name'     => 'nullable|string|max:255',
            'product_interest' => 'nullable|string|max:255',
            'message'          => 'nullable|string',
            'items'            => 'nullable|array|min:1',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity'   => 'required_with:items|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        $items = $request->input('items', []);
        if (empty($items) && !$request->filled('message')) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => ['message' => ['Message or at least one product line is required.']],
            ], 422);
        }

        try {
            $quote = DB::transaction(function () use ($request, $items) {
            $quote = Quote::create([
                'user_id'          => $request->user()?->id,
                'name'             => $request->name,
                'email'            => $request->email,
                'phone'            => $request->phone,
                'company_name'     => $request->company_name,
                'product_interest' => $request->product_interest,
                'message'          => $request->message ?: 'Quote request with product line items.',
                'status'           => 'new',
            ]);

            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    continue;
                }

                $quantity = (int) ($item['quantity'] ?? 1);
                $moq = max(1, (int) ($product->moq ?? 1));
                if ($quantity < $moq) {
                    throw new \InvalidArgumentException("Minimum order quantity for {$product->name} is {$moq}.");
                }

                $unitPrice = $this->pricingService->resolvePrice($product, $request->user());

                QuoteItem::create([
                    'quote_id'      => $quote->id,
                    'product_id'    => $product->id,
                    'variant_id'    => $item['variant_id'] ?? null,
                    'product_name'  => $product->name,
                    'variant_label' => $item['variant_label'] ?? null,
                    'quantity'      => $quantity,
                    'unit_price'    => $unitPrice,
                ]);
            }

            return $quote->load('items');
        });
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quote request submitted',
            'data'    => $quote,
        ]);
    }

    /**
     * List all quote requests (Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Quote::with('items');

        if ($request->has('status') && in_array($request->status, ['new', 'in_progress', 'quoted', 'closed'])) {
            $query->where('status', $request->status);
        }

        $quotes = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $quotes
        ]);
    }

    /**
     * Update quote status (Admin).
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $quote = Quote::find($id);

        if (!$quote) {
            return response()->json([
                'success' => false,
                'message' => 'Quote not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status'      => 'required|in:new,in_progress,quoted,closed',
            'admin_notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        $quote->update($request->only(['status', 'admin_notes']));

        return response()->json([
            'success' => true,
            'data'    => $quote->load('items'),
            'message' => 'Quote updated successfully'
        ]);
    }
}
