<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Admin: List all orders with filters.
     */
    public function index(Request $request)
    {
        $query = Order::with(['customer:id,name,email', 'items.product:id,name']);

        // Search by Order ID
        if ($request->has('search')) {
            $query->where('id', 'like', '%' . $request->search . '%');
        }

        // Filter by Status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by Buyer Type
        if ($request->has('buyer_type')) {
            $query->where('buyer_type', $request->buyer_type);
        }

        // Filter by Date Range
        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(20)
        ]);
    }

    /**
     * Admin: Show full order detail.
     */
    public function show($id)
    {
        $order = Order::with(['customer', 'items.product', 'items.variant', 'items.quantitySet'])->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Admin: Update order status and tracking.
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
            'tracking_number' => 'required_if:status,shipped|nullable|string|max:255',
            'carrier' => 'required_if:status,shipped|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $order->update([
            'status' => $request->status,
            'tracking_number' => $request->tracking_number,
            'carrier' => $request->carrier,
        ]);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order status updated'
        ]);
    }

    /**
     * Customer: List order history.
     */
    public function myOrders(Request $request)
    {
        $orders = Order::with(['items.product:id,name'])
            ->where('customer_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Customer: Show single order detail.
     */
    public function myOrderDetail(Request $request, $id)
    {
        $order = Order::with(['items.product', 'items.variant'])
            ->where('customer_id', $request->user()->id)
            ->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found or access denied'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
