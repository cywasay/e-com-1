<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\B2bApplication;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Admin Dashboard Statistics.
     */
    public function index()
    {
        // 1. Total Revenue (excluding cancelled/refunded)
        $totalRevenue = Order::whereNotIn('status', ['cancelled', 'refunded'])->sum('total_amount');

        // 2. Orders Stats
        $totalOrders = Order::count();
        $ordersToday = Order::whereDate('created_at', Carbon::today())->count();

        // 3. Product Stats
        $activeProducts = Product::where('status', 'published')->count();

        // 4. Customer Stats
        $totalCustomers = User::whereIn('role', [User::ROLE_B2B_BUYER, User::ROLE_B2C_CUSTOMER])->count();
        $b2bAccounts = User::where('role', User::ROLE_B2B_BUYER)->count();

        // 5. B2B Applications
        $pendingApplications = B2bApplication::where('status', 'pending')->count();

        // 6. Recent Orders
        $recentOrders = Order::with('customer:id,name')
            ->latest()
            ->take(5)
            ->get();

        // 7. Low Stock Products
        $lowStockProducts = ProductVariant::with('product:id,name')
            ->where('stock_qty', '<', 10)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($variant) {
                return [
                    'product_name' => $variant->product->name,
                    'sku' => $variant->sku,
                    'stock_qty' => $variant->stock_qty,
                    'product_id' => $variant->product_id
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => (float) $totalRevenue,
                'total_orders' => $totalOrders,
                'orders_today' => $ordersToday,
                'active_products' => $activeProducts,
                'total_customers' => $totalCustomers,
                'b2b_accounts' => $b2bAccounts,
                'pending_b2b_applications' => $pendingApplications,
                'recent_orders' => $recentOrders,
                'low_stock_products' => $lowStockProducts
            ]
        ]);
    }
}
