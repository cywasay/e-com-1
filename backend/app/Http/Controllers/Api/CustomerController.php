<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers (B2B and B2C).
     */
    public function index(Request $request)
    {
        $query = User::whereIn('role', [User::ROLE_B2B_BUYER, User::ROLE_B2C_CUSTOMER]);

        // Search by name or email
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && !empty($request->role)) {
            $role = $request->role;
            if ($role === 'b2b') {
                $query->where('role', User::ROLE_B2B_BUYER);
            } elseif ($role === 'b2c') {
                $query->where('role', User::ROLE_B2C_CUSTOMER);
            }
        }

        $customers = $query->select('id', 'name', 'email', 'role', 'b2b_status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }
}
