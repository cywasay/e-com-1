<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuoteController extends Controller
{
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
            'message'          => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        Quote::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Quote request submitted'
        ]);
    }

    /**
     * List all quote requests (Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Quote::query();

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

        $quote->update([
            'status'      => $request->status,
            'admin_notes' => $request->admin_notes ?? $quote->admin_notes
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Quote updated',
            'data'    => $quote
        ]);
    }
}
