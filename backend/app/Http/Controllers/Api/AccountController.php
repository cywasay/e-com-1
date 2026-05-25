<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AccountController extends Controller
{
    /**
     * Update user profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'current_password' => 'required_with:new_password',
            'new_password' => ['nullable', 'confirmed', Password::min(8)],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update basic info
        $user->name = $request->name;
        if ($request->has('company_name')) {
            $user->company_name = $request->company_name;
        }

        // Update password if provided
        if ($request->new_password) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'The provided current password does not match our records.',
                    'errors' => ['current_password' => ['Incorrect current password.']]
                ], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Profile updated successfully.'
        ]);
    }

    /**
     * Update user default address.
     */
    public function updateAddress(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'emirates' => 'required|string|in:Dubai,Abu Dhabi,Sharjah,Ajman,Umm Al Quwain,Ras Al Khaimah,Fujairah',
            'country' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $addressData = $request->only([
            'full_name', 'phone', 'address_line_1', 'address_line_2', 
            'city', 'emirates', 'country'
        ]);

        $user->default_address = $addressData;
        $user->save();
        $user->refresh();

        return response()->json([
            'success' => true,
            'data' => $user->default_address,
            'message' => 'Address updated successfully.'
        ]);
    }

    /**
     * Account dashboard summary for the logged-in customer.
     */
    public function summary(Request $request)
    {
        $user = $request->user();

        $ordersQuery = Order::where('customer_id', $user->id);
        $quotesQuery = Quote::with(['items.product:id,name'])
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            });

        $recentOrders = (clone $ordersQuery)
            ->with(['items.product:id,name'])
            ->latest()
            ->limit(3)
            ->get();

        $recentQuotes = (clone $quotesQuery)
            ->latest()
            ->limit(3)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders_count' => (clone $ordersQuery)->count(),
                'quotes_count' => (clone $quotesQuery)->count(),
                'has_address' => !empty($user->default_address),
                'recent_orders' => $recentOrders,
                'recent_quotes' => $recentQuotes,
            ],
        ]);
    }

    /**
     * Quote history for the logged-in customer.
     */
    public function myQuotes(Request $request)
    {
        $user = $request->user();

        $quotes = Quote::with(['items.product:id,name'])
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $quotes,
        ]);
    }
}
